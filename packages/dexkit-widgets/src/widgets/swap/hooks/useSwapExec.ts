import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { ZeroExQuoteResponse } from "@dexkit/ui/modules/swap/types";
import { useMutation, UseQueryResult } from "@tanstack/react-query";
import type { providers } from "ethers";
import { useState } from "react";
import { useIntl } from "react-intl";
import { concat, erc20Abi, Hex, maxUint256, numberToHex, publicActions, size } from "viem";
import { useAccount, useChainId, useClient, useSendTransaction, useSignTypedData, useSimulateContract, useWriteContract } from "wagmi";
import { NotificationCallbackParams } from "../types";

export interface SwapExecParams {
  quote: ZeroExQuoteResponse;
  quoteQuery: UseQueryResult;
  provider?: providers.Web3Provider;
  onHash: (hash: string) => void;
  sellToken: Token;
  buyToken: Token;
}

export function useSwapExec({
  onNotification
}: {
  onNotification: (params: NotificationCallbackParams) => void
}) {
  const { formatMessage } = useIntl();
  const trackUserEvent = useTrackUserEventsMutation();
  const account = useAccount();
  const chainId = useChainId();
  const client = useClient()?.extend(publicActions);
  const { signTypedDataAsync } = useSignTypedData();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();
  const [quoteState, setQuoteState] = useState<ZeroExQuoteResponse | undefined>(undefined);
  const simulateApproveRequest = useSimulateContract({
    abi: erc20Abi,
    address: quoteState?.sellToken as Hex,
    functionName: "approve",
    args: [quoteState?.issues.allowance?.spender, maxUint256],
  });

  return useMutation(
    async ({
      quote,
      quoteQuery,
      provider,
      onHash,
      sellToken,
      buyToken,
    }: SwapExecParams) => {
      if (!provider) {
        throw new Error("no provider");
      }
     
      if (quote?.sellToken === ZEROEX_NATIVE_TOKEN_ADDRESS) {
        console.log("Native token detected, no need for allowance check");
      } else if (quote?.issues.allowance !== null) {
        try {

          console.log(
            "Approving Permit2 to spend sellToken...",
            simulateApproveRequest
          );

          const tx = await writeContractAsync({
            abi: erc20Abi,
            address: quote?.sellToken as Hex,
            functionName: "approve",
            args: [quote?.issues.allowance?.spender, maxUint256],
          });

          await provider?.waitForTransaction(tx);

          await quoteQuery.refetch();
        } catch (error) {
          console.log("Error approving Permit2:", error);
          return;
        }
      }

      let signature: Hex | undefined;
      let hash: Hex | undefined;

      if (quote.permit2?.eip712) {
        signature = await signTypedDataAsync(quote.permit2.eip712);

        const signatureLengthInHex = numberToHex(
          size(signature as `0x${string}`),
          {
            signed: false,
            size: 32,
          }
        );

        const transactionData = quote.transaction.data as Hex;
        const sigLengthHex = signatureLengthInHex as Hex;
        const sig = signature as Hex;

        quote.transaction.data = concat([transactionData, sigLengthHex, sig]);
      }

      const nonce = await client?.getTransactionCount({
        address: account.address!,
      });

      if (quote?.sellToken === ZEROEX_NATIVE_TOKEN_ADDRESS) {
        // Directly sign and send the native token transaction
        hash = await sendTransactionAsync({
          account: account.address!,
          chainId: client!.chain.id,
          gas: !!quote?.transaction.gas
            ? BigInt(quote?.transaction.gas)
            : undefined,
          to: quote?.transaction.to,
          data: quote.transaction.data,
          value: BigInt(quote.transaction.value),
          gasPrice: !!quote?.transaction.gasPrice
            ? BigInt(quote?.transaction.gasPrice)
            : undefined,
          nonce,
        });

        console.log("Transaction hash:", hash);
        console.log(`See tx details at https://basescan.org/tx/${hash}`);
      } else if (signature && quote.transaction.data) {
        hash = await sendTransactionAsync({
          chainId: chainId,
          data: quote.transaction.data,
          gas: quote.transaction.gas,
          gasPrice: quote.transaction.gasPrice,
          nonce: nonce,
          to: quote.transaction.to,
          value: quote.transaction.value,
        });

        console.log("Transaction hash:", hash);
        console.log(`See tx details at https://basescan.org/tx/${hash}`);
      } else {
        console.error("Failed to obtain a signature, transaction not sent.");
      }
        onNotification({
          chainId,
          title: formatMessage({
            id: "swap.tokens",
            defaultMessage: "Swap Tokens", // TODO: add token symbols and amounts
          }),
          hash,
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
          hash: hash,
          chainId,
          metadata: JSON.stringify({
            quote: quote,
            sellToken,
            buyToken,
          }),
        });

        onHash(hash!);

        return await provider?.waitForTransaction(hash!);;
    }
  );
}
