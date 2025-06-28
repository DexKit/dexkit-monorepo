import { useMemo } from "react";

import { ChainId, GET_NATIVE_TOKEN } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { SwapVariant } from "@dexkit/ui/modules/wizard/types";
import type { BigNumber } from "ethers";
import { useIntl } from "react-intl";
import { zeroAddress } from "viem";
import { useCoinPrices } from "../../../hooks/useCoinPrices";
import { SwapSide } from "../types";
import { useSwapNativePrice } from "./useSwapNativePrice";

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

export const SWAP_PRICE = "SWAP_CURRENCY_PRICE";

export function useSwapCurrencyPrice({
  maxSlippage,
  zeroExApiKey,
  swapFees,
  params,
  currency,
  variant,
}: {
  maxSlippage?: number;
  zeroExApiKey?: string;
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
  currency: string;
  params: SwapQuoteParams;
  variant?: SwapVariant;
}): { buyPrice?: string; sellPrice?: string; isLoadingPrice?: boolean } {
  const intl = useIntl();

  const chainId = params.chainId;

  const quotePriceBuyToken = useSwapNativePrice({
    maxSlippage,
    zeroExApiKey,
    swapFees,
    params: {
      buyToken: params.buyToken,
      chainId: params.chainId,
      account: params.account
    },
    variant,
  });

  const quotePriceSellToken = useSwapNativePrice({
    maxSlippage,
    zeroExApiKey,
    swapFees,
    params: {
      buyToken: params.sellToken,
      chainId: params.chainId,
      account: params.account
    },
    variant,
  });

  const nativeToken = chainId && GET_NATIVE_TOKEN(chainId);

  const coinPrices = useCoinPrices({
    currency,
    tokens: chainId ? [nativeToken] : [],
    chainId,
  });

  return useMemo(() => {
    if (!params.buyToken || !params.sellToken) {
      return { isLoadingPrice: false };
    }

    if (
      coinPrices.data &&
      nativeToken?.chainId &&
      currency &&
      quotePriceBuyToken.data &&
      quotePriceSellToken.data
    ) {
      try {
        const t = coinPrices.data[nativeToken.chainId];
        const buyTokenToEthRate = quotePriceBuyToken.data?.sellTokenToEthRate;
        const sellTokenToEthRate = quotePriceSellToken.data?.sellTokenToEthRate;

        if (t && buyTokenToEthRate && sellTokenToEthRate) {
          const price = t[zeroAddress];
          const currencyPrice = price[currency];

          return {
            buyPrice: intl.formatNumber(
              (currencyPrice / Number(buyTokenToEthRate)),
              { style: "currency", currency }
            ),
            sellPrice: intl.formatNumber(
              (currencyPrice / Number(sellTokenToEthRate)),
              { style: "currency", currency }
            ),
            isLoadingPrice: false,
          };
        }
      } catch (e) {
        return { isLoadingPrice: false };
      }
    }

    const hasTokens = Boolean(params.buyToken && params.sellToken);
    const isActuallyLoading = quotePriceBuyToken.isLoading || coinPrices.isLoading || quotePriceSellToken.isLoading;
    
    return { 
      isLoadingPrice: hasTokens && isActuallyLoading 
    };
  }, [
    params.buyToken,
    params.sellToken,
    quotePriceBuyToken.isLoading,
    quotePriceBuyToken.data,
    quotePriceSellToken.isLoading,
    quotePriceSellToken.data,
    currency,
    coinPrices.isLoading,
    coinPrices.data,
    nativeToken?.chainId,
    intl,
  ]);
}
