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
      debugger;
      const { data, value, to } = quote.transaction;
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      try {
        if (quote.permit2?.eip712) {
          const { domain, types, message } = quote.permit2.eip712;
          debugger;
          const signature = await signer._signTypedData(domain, types, message);
          debugger;
          console.log("Signed permit2 message from quote response");

          // 5. append sig length and sig data to transaction.data
          // if (signature && quote?.transaction?.data) {
          //   const signatureLengthInHex = numberToHex(size(signature), {
          //     signed: false,
          //     size: 32,
          //   });

          //   const transactionData = quote.transaction.data as Hex;
          //   const sigLengthHex = signatureLengthInHex as Hex;
          //   const sig = signature as Hex;

          //   quote.transaction.data = concat([
          //     transactionData,
          //     sigLengthHex,
          //     sig,
          //   ]);
          // } else {
          //   throw new Error("Failed to obtain signature or transaction data");
          // }
        }

        const nonce = await provider.getTransactionCount(address);
        const tx = await provider.getSigner().sendTransaction({
          data: data,
          value: BigNumber.from(value),
          to,
          nonce,
          chainId,
          gasLimit: !!quote?.transaction.gas
            ? BigInt(quote?.transaction.gas)
            : undefined,
          gasPrice: !!quote?.transaction.gasPrice
            ? BigInt(quote?.transaction.gasPrice)
            : undefined,
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
        debugger;
        throw err;
      }
    }
  );
}
