import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import { EXCHANGE_NOTIFICATION_TYPES } from "@dexkit/exchange/constants/messages";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import {
  concat,
  erc20Abi,
  Hex,
  maxUint256,
  numberToHex,
  publicActions,
  size,
} from "viem";
import {
  useClient,
  useSendTransaction,
  useSignTypedData,
  useSimulateContract,
  useWriteContract,
} from "wagmi";
import { ZRX_PRICE_QUERY, ZRX_QUOTE_QUERY } from "../constants/zrx";
import { useGaslessTrades } from "../modules/swap/hooks/useGaslessTrades";
import { ZeroExApiClient } from "../modules/swap/services/zrxClient";
import {
  SignatureType,
  txMutationParams,
  ZeroExGaslessQuoteResponse,
  ZeroExQuote,
  ZeroExQuoteGasless,
  ZeroExQuoteResponse,
} from "../modules/swap/types";
import { SiteContext } from "../providers/SiteProvider";
import { AppNotificationType } from "../types";
import { splitSignature } from "../utils";
import { useDexKitContext } from "./useDexKitContext";
import { useTrackUserEventsMutation } from "./userEvents";

export function useZrxPriceQuery({
  params,
  useGasless,
}: {
  params: ZeroExQuote | ZeroExQuoteGasless;
  useGasless?: boolean;
}) {
  const { siteId } = useContext(SiteContext);

  return useQuery([ZRX_PRICE_QUERY, params], async () => {
    if (!params.chainId || !params.sellAmount) {
      return null;
    }

    const zrxClient = new ZeroExApiClient(params.chainId, siteId);

    if (useGasless) {
      let gaslessParams = params as ZeroExQuoteGasless;
      return zrxClient.priceGasless(gaslessParams, {});
    } else {
      return zrxClient.price(params as ZeroExQuote, {});
    }
  });
}

export function useZrxQuoteQuery({
  params,
  useGasless,
  onSuccess,
  options,
}: {
  params: ZeroExQuote | ZeroExQuoteGasless;
  useGasless?: boolean;
  onSuccess?: (data?: ZeroExQuoteResponse | ZeroExGaslessQuoteResponse) => void;
  options?: any;
}) {
  const { siteId } = useContext(SiteContext);

  return useQuery(
    [ZRX_QUOTE_QUERY, params],
    async () => {
      const zrxClient = new ZeroExApiClient(params.chainId, siteId);

      if (useGasless) {
        let gaslessParams = params as ZeroExQuoteGasless;
        return zrxClient.quoteGasless(gaslessParams, {});
      } else {
        return zrxClient.quote(params as ZeroExQuote, {});
      }
    },
    {
      onSuccess,
      enabled:
        Boolean(params) &&
        !!params.chainId &&
        !!params.buyToken &&
        !!params.sellToken &&
        !!params.sellAmount &&
        BigInt(params.sellAmount) > 0,
      refetchInterval: useGasless ? 25000 : 10000,
      ...options,
    }
  );
}

export function useMarketTradeGaslessExec({
  onNotification,
}: {
  onNotification: (params: any) => void;
}) {
  const { siteId } = useContext(SiteContext);

  const trackUserEvent = useTrackUserEventsMutation();

  return useMutation(
    async ({
      quote,
      trade,
      approval,
      chainId,
      sellToken,
      buyToken,
      side,
    }: {
      quote: any;
      trade: any;
      approval?: any;
      chainId?: number;
      sellToken: Token;
      buyToken: Token;
      side: "sell" | "buy";
    }) => {
      if (!chainId) {
        return null;
      }

      const client = new ZeroExApiClient(chainId, siteId);

      try {
        const { tradeHash } = await client.submitGasless({
          trade,
          approval,
          chainId: chainId.toString(),
        });

        trackUserEvent.mutate({
          event:
            side === "buy"
              ? UserEvents.marketBuyGasless
              : UserEvents.marketSellGasless,
          chainId,
          metadata: JSON.stringify({
            quote: quote,
          }),
        });

        return tradeHash;
      } catch (err) {
        throw err;
      }
    }
  );
}

export const useSendTxMutation = (p: txMutationParams) => {
  const {
    amount,
    account,
    chainId,
    quote,
    canGasless,
    provider,
    quoteQuery,
    side,
    baseToken,
    formattedCost,
    quoteToken,
  } = p;
  const { signTypedDataAsync } = useSignTypedData();
  const simulateApproveRequest = useSimulateContract({
    abi: erc20Abi,
    address: quote?.sellToken as Hex,
    functionName: "approve",
    args: [
      quote?.issues.allowance?.spender,
      quote?.sellAmount ? BigInt(quote.sellAmount) : maxUint256,
    ],
  });
  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();
  const { createNotification } = useDexKitContext();
  const trackUserEvent = useTrackUserEventsMutation();
  const marketTradeGasless = useMarketTradeGaslessExec({
    onNotification: createNotification,
  });
  const [gaslessTrades, setGaslessTrades] = useGaslessTrades();
  const client = useClient()?.extend(publicActions);

  return useMutation(async () => {
    if (amount && chainId && quote) {
      if (canGasless) {
        const data = quote as ZeroExGaslessQuoteResponse;
        const tokenApprovalRequired = data.issues.allowance != null;
        const gaslessApprovalAvailable = data.approval != null;

        let successfulTradeHash: any = null;
        let approvalSignature: Hex | null = null;
        let approvalDataToSubmit: any = null;
        let tradeDataToSubmit: any = null;
        let tradeSignature: any = null;

        if (tokenApprovalRequired) {
          if (gaslessApprovalAvailable) {
            approvalSignature = await signTypedDataAsync({
              types: data.approval.eip712.types,
              domain: data.approval.eip712.domain,
              message: data.approval.eip712.message,
              primaryType: data.approval.eip712.primaryType,
            });
          } else {
            if (quote.issues.allowance !== null) {
              try {
                const simulateRequest = await simulateApproveRequest;

                console.log(
                  "Approving Permit2 to spend sellToken...",
                  simulateApproveRequest
                );

                const tx = await writeContractAsync({
                  abi: erc20Abi,
                  address: quote?.sellToken as Hex,
                  functionName: "approve",
                  args: simulateRequest.data?.request.args!,
                });

                await provider?.waitForTransaction(tx);

                await quoteQuery.refetch();
              } catch (error) {
                console.log("Error approving Permit2:", error);
                return;
              }
            } else {
              console.log("USDC already approved for Permit2");
            }
          }
        }

        if (approvalSignature) {
          const approvalSplitSig = await splitSignature(approvalSignature);
          approvalDataToSubmit = {
            type: data.approval.type,
            eip712: data.approval.eip712,
            signature: {
              ...approvalSplitSig,
              v: Number(approvalSplitSig.v),
              signatureType: SignatureType.EIP712,
            },
          };
        }

        tradeSignature = await signTypedDataAsync({
          types: data.trade.eip712.types,
          domain: data.trade.eip712.domain,
          message: data.trade.eip712.message,
          primaryType: data.trade.eip712.primaryType,
        });

        const tradeSplitSig = await splitSignature(tradeSignature);
        tradeDataToSubmit = {
          type: data.trade.type,
          eip712: data.trade.eip712,
          signature: {
            ...tradeSplitSig,
            v: Number(tradeSplitSig.v),
            signatureType: SignatureType.EIP712,
          },
        };

        try {
          const requestBody: any = {
            trade: tradeDataToSubmit,
            chainId,
          };
          if (approvalDataToSubmit) {
            requestBody.approval = approvalDataToSubmit;
          }

          successfulTradeHash = await marketTradeGasless.mutateAsync(
            requestBody
          );

          if (successfulTradeHash) {
            const subType = side == "buy" ? "marketBuy" : "marketSell";
            const messageType = EXCHANGE_NOTIFICATION_TYPES[
              subType
            ] as AppNotificationType;

            gaslessTrades.push({
              type: subType,
              chainId,
              tradeHash: successfulTradeHash,
              icon: messageType.icon,
              values: {
                sellAmount: amount,
                sellTokenSymbol: baseToken.symbol.toUpperCase(),
                buyAmount: formattedCost,
                buyTokenSymbol: quoteToken.symbol.toUpperCase(),
              },
            });
            // We use this on gasless trade updater to issue swap trades notifications
            setGaslessTrades(gaslessTrades);

            return successfulTradeHash;
          }
        } catch (error) {
          console.error("Error submitting the gasless swap", error);
        }
      } else {
        let data = quote as ZeroExQuoteResponse;

        if (data?.sellToken === ZEROEX_NATIVE_TOKEN_ADDRESS) {
          console.log("Native token detected, no need for allowance check");
        } else if (
          data?.issues.allowance !== null &&
          BigInt(data?.issues.allowance.actual) < BigInt(data.sellAmount)
        ) {
          try {
            const simulateRequest = await simulateApproveRequest;

            console.log(
              "Approving Permit2 to spend sellToken...",
              simulateApproveRequest
            );

            const tx = await writeContractAsync({
              abi: erc20Abi,
              address: data?.sellToken as Hex,
              functionName: "approve",
              args: simulateRequest.data?.request.args!,
            });

            await provider?.waitForTransaction(tx);
            const response = (await quoteQuery.refetch()).data;
            data = Array.isArray(response) ? response[1] : response;
          } catch (error) {
            console.log("Error approving Permit2:", error);
            return;
          }
        }

        let signature: Hex | undefined;
        let hash: Hex | undefined;

        if (data.permit2?.eip712) {
          signature = await signTypedDataAsync(data.permit2.eip712);
          const signatureLengthInHex = numberToHex(
            size(signature as `0x${string}`),
            {
              signed: false,
              size: 32,
            }
          );

          const transactionData = data.transaction.data as Hex;
          const sigLengthHex = signatureLengthInHex as Hex;
          const sig = signature as Hex;

          data.transaction.data = concat([transactionData, sigLengthHex, sig]);
        }

        const nonce = await client?.getTransactionCount({
          address: account! as Hex,
        });

        if (quote?.sellToken === ZEROEX_NATIVE_TOKEN_ADDRESS) {
          // Directly sign and send the native token transaction
          hash = await sendTransactionAsync({
            account: account! as Hex,
            chainId: client!.chain.id,
            gas: !!data?.transaction.gas
              ? BigInt(data?.transaction.gas)
              : undefined,
            to: data?.transaction.to,
            data: data.transaction.data,
            value: BigInt(data.transaction.value),
            gasPrice: !!data?.transaction.gasPrice
              ? BigInt(data?.transaction.gasPrice)
              : undefined,
            nonce,
          });

          console.log("Transaction hash:", hash);
          console.log(`See tx details at https://basescan.org/tx/${hash}`);
        } else if (signature && data.transaction.data) {
          hash = await sendTransactionAsync({
            chainId: chainId,
            data: data.transaction.data,
            gas: data.transaction.gas,
            gasPrice: data.transaction.gasPrice,
            nonce: nonce,
            to: data.transaction.to,
            value: data.transaction.value,
          });

          console.log("Transaction hash:", hash);
          console.log(`See tx details at https://basescan.org/tx/${hash}`);
        } else {
          console.error("Failed to obtain a signature, transaction not sent.");
        }

        const subType = side == "buy" ? "marketBuy" : "marketSell";
        const messageType = EXCHANGE_NOTIFICATION_TYPES[
          subType
        ] as AppNotificationType;

        createNotification({
          type: "transaction",
          icon: messageType.icon,
          subtype: subType,
          metadata: {
            hash,
            chainId,
          },
          values: {
            sellAmount: amount,
            sellTokenSymbol: baseToken.symbol.toUpperCase(),
            buyAmount: formattedCost,
            buyTokenSymbol: quoteToken.symbol.toUpperCase(),
          },
        });

        trackUserEvent.mutate({
          event: side == "buy" ? UserEvents.marketBuy : UserEvents.marketSell,
          hash,
          chainId,
          metadata: JSON.stringify({
            quote,
          }),
        });

        await provider?.waitForTransaction(hash as Hex);

        return hash;
      }
    }
  });
};
