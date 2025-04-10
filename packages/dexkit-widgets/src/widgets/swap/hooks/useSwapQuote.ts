import { ZeroExApiClient } from "@dexkit/ui/modules/swap/services/zrxClient";
import { ZeroExQuote, ZeroExQuoteGasless, ZeroExQuoteResponse } from "@dexkit/ui/modules/swap/types";
import { useContext, useState } from "react";
import { SUPPORTED_GASLESS_CHAIN } from "../../../constants";

import { ChainId } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { ZEROEX_AFFILIATE_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import { isNativeInSell } from "@dexkit/ui/modules/swap/utils";
import { SiteContext } from "@dexkit/ui/providers/SiteProvider";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { SwapSide } from "../types";

export interface SwapQuoteParams {
  sellToken?: Token;
  sellTokenAmount?: bigint;
  buyToken?: Token;
  buyTokenAmount?: bigint;
  chainId: ChainId;
  skipValidation?: boolean;
  quoteFor?: SwapSide;
  account?: string;
  slippagePercentage?: number;
}

export interface UseQuoteSwap {
  enabled: boolean;
  setSkipValidation: React.Dispatch<React.SetStateAction<boolean>>;
  setIntentOnFilling: React.Dispatch<React.SetStateAction<boolean>>;
  setTradeSignature: React.Dispatch<React.SetStateAction<string | undefined>>;
  setApprovalSignature: React.Dispatch<React.SetStateAction<string | undefined>>;
  params: SwapQuoteParams | undefined;
  setEnabled: React.Dispatch<boolean>;
  quoteQuery: UseQueryResult<
    [string, ZeroExQuoteResponse | null] | undefined,
    unknown
  >;
}

export const SWAP_QUOTE = "SWAP_QUOTE";

export function useSwapQuote({
  onSuccess,
  maxSlippage,
  zeroExApiKey,
  swapFees,
  isGasless,
  params,
}: {
  onSuccess: (data?: [string, ZeroExQuoteResponse | null]) => void;
  maxSlippage?: number;
  zeroExApiKey?: string;
  isGasless?: boolean;
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
  params: SwapQuoteParams;
}): UseQuoteSwap {
  const [enabled, setEnabled] = useState(true);
  const [skipValidation, setSkipValidation] = useState(true);
  const [intentOnFilling, setIntentOnFilling] = useState(false);
  const [tradeSignature, setTradeSignature] = useState<string>();
  const [approvalSignature, setApprovalSignature] = useState<string>();

  const refetchParams =
    params.quoteFor === "buy"
      ? {
        sellToken: params.sellToken,
        buyToken: params.buyToken,
        buyTokenAmount: params.buyTokenAmount,
      }
      : {
        sellToken: params.sellToken,
        sellTokenAmount: params.sellTokenAmount,
        buyToken: params.buyToken,
      };

  const { siteId } = useContext(SiteContext);

  const quoteQuery = useQuery(
    [
      SWAP_QUOTE,
      refetchParams,
      params.chainId,
      params.account,
      isGasless,
      maxSlippage,
      zeroExApiKey,
      skipValidation,
      intentOnFilling,
      swapFees,
    ],
    async ({ signal }) => {
      if (!params) {
        return null;
      }

      const {
        account,
        chainId,
        buyToken,
        sellToken,
        sellTokenAmount,
        buyTokenAmount,
        skipValidation: canSkipValitaion,
        quoteFor,
      } = { ...params, skipValidation };

      const client = new ZeroExApiClient(chainId, zeroExApiKey, siteId);

      if (buyToken && sellToken && quoteFor) {
        if (isGasless && SUPPORTED_GASLESS_CHAIN.includes(chainId) && !isNativeInSell({ side: quoteFor, sellToken, buyToken })) {
          const quoteParam: ZeroExQuoteGasless = {
            buyToken: buyToken?.address,
            sellToken: sellToken?.address,
            feeRecipient: swapFees?.recipient,
            affiliateAddress: ZEROEX_AFFILIATE_ADDRESS,
            acceptedTypes: "metatransaction_v2",
            feeType: "volume",
            feeSellTokenPercentage: swapFees
              ? swapFees.amount_percentage / 100
              : undefined,
            skipValidation: canSkipValitaion,
          };

          if (account) {
            quoteParam.takerAddress = account;
          }
          if (intentOnFilling) {
            quoteParam.checkApproval = true;
          }

          if (quoteFor === "buy" && buyTokenAmount !== undefined && buyTokenAmount > BigInt(0)) {
            quoteParam.buyAmount = buyTokenAmount?.toString();
            if (intentOnFilling) {
              return [quoteFor, await client.quoteGasless(quoteParam, { signal })];
            } else {
              return [quoteFor, await client.priceGasless(quoteParam, { signal })];
            }

          } else if (quoteFor === "sell" && sellTokenAmount !== undefined && sellTokenAmount > BigInt(0)) {
            quoteParam.sellAmount = sellTokenAmount?.toString();
            if (intentOnFilling) {
              return [quoteFor, await client.quoteGasless(quoteParam, { signal })];
            } else {
              return [quoteFor, await client.priceGasless(quoteParam, { signal })];
            }
          }

        } else {
          const quoteParam: ZeroExQuote = {
            buyToken: buyToken?.address,
            sellToken: sellToken?.address,
            affiliateAddress: ZEROEX_AFFILIATE_ADDRESS,
            feeRecipient: swapFees?.recipient,
            buyTokenPercentageFee: swapFees
              ? swapFees.amount_percentage / 100
              : undefined,
            skipValidation: canSkipValitaion,
          };

          if (account && !skipValidation) {
            quoteParam.takerAddress = account;
          }

          if (intentOnFilling && zeroExApiKey) {
            quoteParam.intentOnFilling = true;
          }

          if (maxSlippage !== undefined) {
            quoteParam.slippagePercentage = maxSlippage;
          }

          if (quoteFor === "buy" && buyTokenAmount !== undefined && buyTokenAmount > BigInt(0)) {
            quoteParam.buyAmount = buyTokenAmount?.toString();
            return [quoteFor, await client.quote(quoteParam, { signal })];
          } else if (quoteFor === "sell" && sellTokenAmount !== undefined && sellTokenAmount > BigInt(0)) {
            quoteParam.sellAmount = sellTokenAmount?.toString();
            return [quoteFor, await client.quote(quoteParam, { signal })];
          }
        }
      }
      return null;
    },
    {
      enabled: Boolean(params),
      refetchInterval: intentOnFilling && isGasless ? 25000 : 10000,
      onSuccess,
    }
  );

  return {
    enabled,
    params,
    setEnabled,
    quoteQuery,
    setSkipValidation,
    setIntentOnFilling,
    setTradeSignature,
    setApprovalSignature
  };
}