import { ChainId } from "@dexkit/core/constants/enums";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { ZrxOrder } from "@dexkit/ui/modules/swap/types";
import { useMutation } from "@tanstack/react-query";
import type { providers } from "ethers";
import { Contract } from "ethers";
import { ZRX_EXCHANGE_ABI } from "../../constants/zrx";
import { getZrxExchangeAddress } from "../../utils";

export function useZrxCancelOrderMutation() {
  const trackUserEvent = useTrackUserEventsMutation();
  return useMutation(
    async ({
      chainId,
      provider,
      order,
    }: {
      chainId?: ChainId;
      provider?: providers.Web3Provider;
      order: ZrxOrder;
    }) => {
      const contractAddress = getZrxExchangeAddress(chainId);

      if (!contractAddress || !provider || !chainId) {
        throw new Error("no provider or contract address");
      }

      const contract = new Contract(
        contractAddress,
        ZRX_EXCHANGE_ABI,
        provider.getSigner(),
      );

      const tx = await contract.cancelLimitOrder(order);

      trackUserEvent.mutate({
        event: UserEvents.orderCancelled,
        hash: tx.hash,
        chainId,
        metadata: JSON.stringify({
          order,
        }),
      });

      return tx.hash;
    },
  );
}
