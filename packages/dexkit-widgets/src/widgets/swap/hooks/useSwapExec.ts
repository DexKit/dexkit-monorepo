import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { ZeroExQuoteResponse } from "@dexkit/ui/modules/swap/types";
import { useMutation } from "@tanstack/react-query";
import type { providers } from "ethers";
import { BigNumber } from "ethers";
import { useIntl } from "react-intl";
import { concat, Hex, numberToHex, size } from "viem";
import { useAccount, useChainId, useSignTypedData } from "wagmi";
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
  const account = useAccount();
  const chainId = useChainId();
  const { signTypedDataAsync } = useSignTypedData();

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

      const { value, to } = quote.transaction;
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      try {
        if (quote.permit2?.eip712) {
          const { domain, types, message, primaryType } = quote.permit2.eip712;

          const signature = await signTypedDataAsync({
            domain,
            types,
            message,
            primaryType,
            account: account.address,
          });

          const signatureLengthInHex = numberToHex(size(signature), {
            signed: false,
            size: 32,
          });

          const transactionData = quote.transaction.data as Hex;
          const sigLengthHex = signatureLengthInHex as Hex;
          const sig = signature as Hex;

          quote.transaction.data = concat([transactionData, sigLengthHex, sig]);
        }

        const nonce = await provider.getTransactionCount(address);
        const tx = await provider.getSigner().sendTransaction({
          data: quote.transaction.data,
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
        throw err;
      }
    }
  );
}
