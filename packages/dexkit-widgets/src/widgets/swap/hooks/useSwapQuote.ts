import { ZeroExApiClient } from "@dexkit/ui/modules/swap/services/zrxClient";
import {
  ZeroExQuote,
  ZeroExQuoteGasless,
  ZeroExQuoteResponse,
} from "@dexkit/ui/modules/swap/types";
import { useContext, useState } from "react";
import { SUPPORTED_GASLESS_CHAIN } from "../../../constants";

import { Token } from "@dexkit/core/types";
import { isNativeInSell } from "@dexkit/ui/modules/swap/utils";
import { SiteContext } from "@dexkit/ui/providers/SiteProvider";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import type { BigNumber } from "ethers";
import { SwapSide } from "../types";

export interface SwapQuoteParams {
  sellToken?: Token;
  sellTokenAmount?: BigNumber;
  buyToken?: Token;
  buyTokenAmount?: BigNumber;
  chainId: number;
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
  setApprovalSignature: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
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

      const client = new ZeroExApiClient(chainId, siteId);

      if (buyToken && sellToken && quoteFor) {
        const buyAmount =
          quoteFor === "buy" && buyTokenAmount?.gt(0)
            ? buyTokenAmount?.toString()
            : undefined;
        const sellAmount =
          quoteFor === "sell" && sellTokenAmount?.gt(0)
            ? sellTokenAmount?.toString()
            : undefined;

        if (
          isGasless &&
          SUPPORTED_GASLESS_CHAIN.includes(chainId) &&
          !isNativeInSell({ side: quoteFor, sellToken, buyToken })
        ) {
          const quoteParam: ZeroExQuoteGasless = {
            chainId: String(chainId),
            buyToken: buyToken?.address,
            sellToken: sellToken?.address,
            slippageBps: maxSlippage ? maxSlippage * 100 * 100 : undefined,
            swapFeeRecipient: swapFees?.recipient || "",
            swapFeeBps: 0,
            swapFeeToken: sellToken?.address,
            taker: account || "",
            buyAmount,
            sellAmount,
          };

          return [quoteFor, await client.quoteGasless(quoteParam, { signal })];
        } else {
          const quoteParam: ZeroExQuote = {
            chainId: String(chainId),
            buyToken: buyToken?.address,
            sellToken: sellToken?.address,
            taker: account || "",
            slippageBps: maxSlippage ? maxSlippage * 100 * 100 : undefined,
            buyAmount,
            sellAmount,
          };

          return [quoteFor, await client.quote(quoteParam, { signal })];
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
    setApprovalSignature,
  };
}
