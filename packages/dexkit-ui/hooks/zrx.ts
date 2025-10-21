import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import { EXCHANGE_NOTIFICATION_TYPES } from "@dexkit/exchange/constants/messages";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Hex, concat, maxUint256, numberToHex, size } from "viem";

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { client } from "@dexkit/wallet-connectors/thirdweb/client";
import { defineChain, getContract, sendTransaction } from "thirdweb";
import { approve } from "thirdweb/extensions/erc20";
import { ZRX_PRICE_QUERY, ZRX_QUOTE_QUERY } from "../constants/zrx";
import { useGaslessTrades } from "../modules/swap/hooks/useGaslessTrades";
import { ZeroExApiClient } from "../modules/swap/services/zrxClient";
import {
  SignatureType,
  ZeroExGaslessQuoteResponse,
  ZeroExQuote,
  ZeroExQuoteGasless,
  ZeroExQuoteResponse,
  txMutationParams,
} from "../modules/swap/types";
import { SiteContext } from "../providers/SiteProvider";
import { AppNotificationType } from "../types";
import { splitSignature } from "../utils";
import { useDexKitContext } from "./useDexKitContext";
import { useTrackUserEventsMutation } from "./userEvents";

export function useZrxPriceQuery({
  params,
  useGasless,
  onSuccess,
  onError,
}: {
  params: ZeroExQuote | ZeroExQuoteGasless;
  useGasless?: boolean;
  onSuccess?: (data?: ZeroExQuoteResponse | ZeroExGaslessQuoteResponse) => void;
  onError?: (error: any) => void;
}) {
  const { siteId } = useContext(SiteContext);

  return useQuery(
    [ZRX_PRICE_QUERY, params],
    async () => {
      const zrxClient = new ZeroExApiClient(params.chainId, siteId);

      if (useGasless) {
        let gaslessParams = params as ZeroExQuoteGasless;
        return zrxClient.priceGasless(gaslessParams, {});
      } else {
        return zrxClient.price(params as ZeroExQuote, {});
      }
    },
    {
      enabled:
        Boolean(params) &&
        !!params.chainId &&
        !!params.buyToken &&
        !!params.sellToken &&
        !!params.sellAmount &&
        BigInt(params.sellAmount) > 0,
      refetchInterval: useGasless ? 25000 : 10000,
      cacheTime: 0,
      staleTime: 0,
      onSuccess,
      onError,
    }
  );
}

export function useZrxQuoteQuery({
  params,
  useGasless,
  onSuccess,
  onError,
  options,
  isEnabled = true,
}: {
  params: ZeroExQuote | ZeroExQuoteGasless;
  useGasless?: boolean;
  onSuccess?: (data?: ZeroExQuoteResponse | ZeroExGaslessQuoteResponse) => void;
  onError?: (error: any) => void;
  options?: any;
  isEnabled?: boolean;
}) {
  const { siteId } = useContext(SiteContext);
  const { widgetId, apiKey } = useDexKitContext();

  return useQuery(
    [ZRX_QUOTE_QUERY, params, widgetId, siteId],
    async () => {
      const zrxClient = new ZeroExApiClient(params.chainId, siteId, widgetId, apiKey);

      if (useGasless) {
        let gaslessParams = params as ZeroExQuoteGasless;
        return zrxClient.quoteGasless(gaslessParams, {});
      } else {
        return zrxClient.quote(params as ZeroExQuote, {});
      }
    },
    {
      onSuccess,
      onError,
      enabled:
        Boolean(params) &&
        !!params.chainId &&
        !!params.buyToken &&
        !!params.sellToken &&
        !!params.sellAmount &&
        params.sellToken !== params.buyToken &&
        BigInt(params.sellAmount) > 0 &&
        isEnabled,
      cacheTime: 0,
      staleTime: 0,
      refetchInterval: useGasless ? 25000 : 10000,
      ...options,
    }
  );
}

export const useZrxQuoteMutation = ({
  params,
  useGasless,
  onSuccess,
  onError,
  options,
}: {
  params: ZeroExQuote | ZeroExQuoteGasless;
  useGasless?: boolean;
  onSuccess?: (data?: ZeroExQuoteResponse | ZeroExGaslessQuoteResponse) => void;
  onError?: (error: any) => void;
  options?: any;
}) => {
  const { siteId } = useContext(SiteContext);
  const { widgetId, apiKey } = useDexKitContext();
  return useMutation(
    [ZRX_QUOTE_QUERY, params],
    async () => {
      const zrxClient = new ZeroExApiClient(params.chainId, siteId, widgetId, apiKey);

      if (useGasless) {
        let gaslessParams = params as ZeroExQuoteGasless;
        return await zrxClient.quoteGasless(gaslessParams, {});
      } else {
        return await zrxClient.quote(params as ZeroExQuote, {});
      }
    },
    {
      onSuccess,
      onError,
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
};

export function useMarketTradeGaslessExec({
  onNotification,
}: {
  onNotification: (params: any) => void;
}) {
  const { siteId } = useContext(SiteContext);
  const { widgetId, apiKey } = useDexKitContext();
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

      const client = new ZeroExApiClient(chainId, siteId, widgetId, apiKey);

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
    chainId,
    quote,
    canGasless,
    quoteQuery,
    side,
    buyAmount,
    sellToken,
    buyToken,
    sellAmount,
  } = p;
  const { activeAccount, provider } = useWeb3React();

  const { createNotification } = useDexKitContext();
  const marketTradeGasless = useMarketTradeGaslessExec({
    onNotification: createNotification,
  });

  const [gaslessTrades, setGaslessTrades] = useGaslessTrades();
  const trackUserEvent = useTrackUserEventsMutation();

  return useMutation(async () => {
    if (sellAmount && buyAmount && chainId && quote) {
      if (canGasless) {
        let data = quote as ZeroExGaslessQuoteResponse;
        const tokenApprovalRequired = data.issues.allowance != null;
        const gaslessApprovalAvailable = data.approval != null;

        let hash: any = null;
        let approvalSignature = null;
        let approvalDataToSubmit: any = null;
        let tradeDataToSubmit: any = null;
        let tradeSignature: any = null;

        if (tokenApprovalRequired) {
          if (gaslessApprovalAvailable) {
            approvalSignature = await activeAccount?.signTypedData({
              types: data.approval.eip712.types,
              domain: data.approval.eip712.domain,
              message: data.approval.eip712.message,
              primaryType: data.approval.eip712.primaryType,
            });
          } else {
            if (quote.issues.allowance !== null) {
              try {
                if (activeAccount) {
                  const contract = getContract({
                    client,
                    address: quote?.sellToken,
                    chain: defineChain(chainId),
                  });
                  //const simulateRequest = await simulateApproveRequest;
                  const transaction = await approve({
                    contract,
                    spender: quote?.issues.allowance?.spender,
                    amount: quote?.sellAmount
                      ? BigInt(quote.sellAmount).toString()
                      : maxUint256.toString(),
                  });

                  await sendTransaction({
                    transaction,
                    account: activeAccount,
                  });
                }

                data = (await quoteQuery.refetch())
                  .data as ZeroExGaslessQuoteResponse;
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

        tradeSignature = await activeAccount?.signTypedData({
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

          hash = await marketTradeGasless.mutateAsync(requestBody);
          const subType = side == "buy" ? "marketBuy" : "marketSell";
          const messageType = EXCHANGE_NOTIFICATION_TYPES[
            subType
          ] as AppNotificationType;

          gaslessTrades.push({
            type: subType,
            chainId: chainId!,
            tradeHash: hash,
            icon: messageType.icon,
            values: {
              sellAmount: quote?.sellAmount || "0",
              sellTokenSymbol: sellToken?.symbol.toUpperCase() || "",
              buyAmount: quote?.buyAmount || "0",
              buyTokenSymbol: sellToken?.symbol.toUpperCase() || "",
            },
          });

          // We use this on gasless trade updater to issue swap trades notifications
          setGaslessTrades(gaslessTrades);

          return hash;
        } catch (error) {
          console.error("Error submitting the gasless swap", error);
          throw new Error("Error submitting the gasless swap");
        }
      } else {
        let data = quote as ZeroExQuoteResponse;

        if (data?.sellToken === ZEROEX_NATIVE_TOKEN_ADDRESS) {
          console.log("Native token detected, no need for allowance check");
        } else if (data?.issues.allowance !== null) {
          try {
            if (activeAccount) {
              const contract = getContract({
                client,
                address: quote?.sellToken,
                chain: defineChain(chainId),
              });
              //const simulateRequest = await simulateApproveRequest;
              const transaction = await approve({
                contract,
                spender: quote?.issues.allowance?.spender,
                amount: quote?.sellAmount
                  ? BigInt(quote.sellAmount).toString()
                  : maxUint256.toString(),
              });

              await sendTransaction({ transaction, account: activeAccount });
            }
          } catch (error) {
            console.log("Error approving Permit2:", error);
            throw new Error("Error approving Permit2");
          }
        }

        let signature: Hex | undefined;

        data = (await quoteQuery.refetch()).data as ZeroExQuoteResponse;

        if (data.permit2?.eip712) {
          signature = await activeAccount?.signTypedData(data.permit2.eip712);
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
        let hash;

        if (quote?.sellToken === ZEROEX_NATIVE_TOKEN_ADDRESS) {
          // Directly sign and send the native token transaction
          hash = await activeAccount?.sendTransaction({
            chainId: chainId,
            gas: !!data?.transaction.gas
              ? BigInt(data?.transaction.gas)
              : undefined,
            to: data?.transaction.to,
            data: data.transaction.data,
            value: BigInt(data.transaction.value),
            gasPrice: !!data?.transaction.gasPrice
              ? BigInt(data?.transaction.gasPrice)
              : undefined,
          });
        } else if (signature && data.transaction.data) {
          hash = await activeAccount?.sendTransaction({
            chainId: chainId,
            data: data.transaction.data,
            gas: data.transaction.gas,
            gasPrice: data.transaction.gasPrice,

            to: data.transaction.to,
            value: data.transaction.value,
          });
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
            hash: hash?.transactionHash,
            chainId,
          },
          values: {
            sellAmount,
            sellTokenSymbol: sellToken.symbol.toUpperCase(),
            buyAmount,
            buyTokenSymbol: buyToken.symbol.toUpperCase(),
          },
        });

        trackUserEvent.mutate({
          // event: side == "buy" ? UserEvents.marketBuy : UserEvents.marketSell,
          event: UserEvents.swap,
          hash: hash?.transactionHash,
          chainId,
          metadata: JSON.stringify({
            quote,
          }),
        });

        await provider?.waitForTransaction(hash?.transactionHash as string);
        return hash?.transactionHash;
      }
    }
  });
};
