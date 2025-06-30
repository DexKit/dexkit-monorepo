import { ZeroExApiClient } from "@dexkit/ui/modules/swap/services/zrxClient";
import {
  ZeroExQuote,
  ZeroExQuoteResponse,
} from "@dexkit/ui/modules/swap/types";
import { useContext } from "react";

import { ChainId } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { ZEROEX_AFFILIATE_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import { SiteContext } from "@dexkit/ui/providers/SiteProvider";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import type { BigNumber } from "ethers";
import { SwapSide } from "../types";

import { useDexKitContext } from "@dexkit/core/hooks/useDexKitContext";
import { SwapVariant } from "@dexkit/ui/modules/wizard/types";
import { formatUnits } from "viem";
export interface SwapQuoteParams {
  sellToken?: Token;
  sellTokenAmount?: BigNumber;
  buyToken?: Token;
  buyTokenAmount?: BigNumber;
  chainId: ChainId;
  skipValidation?: boolean;
  quoteFor?: SwapSide;
  account?: string;
  slippagePercentage?: number;
}

export const SWAP_PRICE = "SWAP_PRICE";

export function useSwapPrice({
  maxSlippage,
  zeroExApiKey,
  swapFees,
  params,
  variant,
}: {
  maxSlippage?: number;
  zeroExApiKey?: string;
  swapFees?: { recipient: string; amount_percentage: number };
  params: SwapQuoteParams;
  variant?: SwapVariant;
}): UseQueryResult<
  | (Pick<ZeroExQuoteResponse, "sellTokenToEthRate" | "buyTokenToEthRate"> & {
    buyAmountUnits: string;
    sellAmountUnits: string;
  })
  | undefined
  | null,
  unknown
> {
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
  const { widgetId, apiKey } = useDexKitContext();


  return useQuery(
    [
      SWAP_PRICE,
      refetchParams,
      params.chainId,
      params.account,
      maxSlippage,
      zeroExApiKey,
      swapFees,
      variant,
    ],
    async ({ signal }) => {
      if (!variant || variant === SwapVariant.Classic) {
        return null;
      }

      if (!params) {
        return null;
      }

      const {
        chainId,
        buyToken,
        sellToken,
        sellTokenAmount,
        quoteFor,
      } = { ...params };
      const client = new ZeroExApiClient(chainId, siteId, widgetId, apiKey);

      if (buyToken && sellToken && quoteFor) {
        const quoteParam: ZeroExQuote = {
          chainId,
          buyToken: buyToken?.address,
          sellToken: sellToken?.address,

          affiliateAddress: ZEROEX_AFFILIATE_ADDRESS,
          feeRecipient: swapFees?.recipient,
          taker: params.account || "",
          buyTokenPercentageFee: swapFees
            ? swapFees.amount_percentage / 100
            : undefined,
        };

        if (maxSlippage !== undefined) {
          quoteParam.slippagePercentage = maxSlippage;
        }

        if (quoteFor === "sell" && sellTokenAmount?.gt(0)) {
          quoteParam.sellAmount = sellTokenAmount?.toString();
          const {
            sellTokenToEthRate,
            buyTokenToEthRate,
            buyAmount,
            sellAmount,
          } = await client.price(quoteParam, { signal });

          const buyAmountUnits = formatUnits(
            BigInt(buyAmount),
            buyToken.decimals
          );
          const sellAmountUnits = formatUnits(
            BigInt(sellAmount),
            sellToken.decimals
          );

          return {
            sellTokenToEthRate,
            buyTokenToEthRate,
            buyAmountUnits,
            sellAmountUnits,
          };
        }
      }
      return null;
    },
    { enabled: Boolean(params), refetchInterval: 5000 }
  );
}
