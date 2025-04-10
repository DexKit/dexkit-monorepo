import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { ZeroExQuoteResponse } from "@dexkit/ui/modules/swap/types";
import { client } from "@dexkit/wallet-connectors/thirdweb/client";
import { useMutation } from "@tanstack/react-query";
import { useIntl } from "react-intl";
import { defineChain, prepareTransaction, sendTransaction } from "thirdweb";
import type { Account } from "thirdweb/wallets";
import { NotificationCallbackParams } from "../types";

export interface SwapExecParams {
  quote: ZeroExQuoteResponse;
  activeAccount: Account
  onHash: (hash: string) => void;
  sellToken: Token;
  buyToken: Token;
  chainId: number
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
      onHash,
      sellToken,
      buyToken,
      chainId,
      activeAccount
    }: SwapExecParams) => {


      try {

        const transaction = prepareTransaction({
          to: quote?.to,
          chain: defineChain(chainId),
          client,
          value: BigInt(quote?.value),
          //@ts-ignore
          data: quote?.data
        });

        const tx = await sendTransaction({ account: activeAccount, transaction });

        onNotification({
          chainId,
          title: formatMessage({
            id: "swap.tokens",
            defaultMessage: "Swap Tokens", // TODO: add token symbols and amounts
          }),
          hash: tx.transactionHash,
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
          hash: tx.transactionHash,
          chainId,
          metadata: JSON.stringify({
            quote: quote,
            sellToken,
            buyToken,
          }),
        });

        onHash(tx.transactionHash);

        return await true;
      } catch (err) {
        throw err;
      }
    }
  );
}
