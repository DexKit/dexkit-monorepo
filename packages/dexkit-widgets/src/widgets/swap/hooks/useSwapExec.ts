import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { ZeroExQuoteResponse } from "@dexkit/ui/modules/swap/types";
import { useMutation } from "@tanstack/react-query";
import type { providers } from "ethers";
import { BigNumber } from "ethers";
import { useIntl } from "react-intl";
import { NotificationCallbackParams } from "../types";

export interface SwapExecParams {
  quote: ZeroExQuoteResponse;
  provider?: providers.Web3Provider;
  onHash: (hash: string) => void;
  sellToken: Token;
  buyToken: Token;
}

export function useSwapExec({
  onNotification,
}: {
  onNotification: (params: NotificationCallbackParams) => void;
}) {
  const { formatMessage } = useIntl();
  const trackUserEvent = useTrackUserEventsMutation();

  return useMutation(
    async ({
      quote,
      provider,
      onHash,
      sellToken,
      buyToken,
    }: SwapExecParams) => {
      if (!provider) {
        throw new Error("no provider");
      }

      const chainId = (await provider.getNetwork()).chainId;
      const { data, value, to } = quote.transaction;

      try {
        const tx = await provider.getSigner().sendTransaction({
          data: data,
          value: BigNumber.from(value),
          to,
        });

        onNotification({
          chainId,
          title: formatMessage({
            id: "swap.tokens",
            defaultMessage: "Swap Tokens", // TODO: add token symbols and amounts
          }),
          hash: tx.hash,
          params: {
            type: "swap",
            sellAmount: quote.sellAmount,
            buyAmount: quote.buyAmount,
            sellToken,
            buyToken,
          },
        });

        trackUserEvent.mutate({
          event: UserEvents.swap,
          hash: tx.hash,
          chainId,
          metadata: JSON.stringify({
            quote: quote,
            sellToken,
            buyToken,
          }),
        });

        onHash(tx.hash);

        return await tx.wait();
      } catch (err) {
        throw err;
      }
    }
  );
}
