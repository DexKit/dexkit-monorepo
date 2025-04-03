import { useMemo } from "react";

import { ChainId, GET_NATIVE_TOKEN } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { SwapVariant } from "@dexkit/ui/modules/wizard/types";
import type { BigNumber } from "ethers";
import { useIntl } from "react-intl";
import { zeroAddress } from "viem";
import { useCoinPrices } from "../../../hooks/useCoinPrices";
import { SwapSide } from "../types";
import { useSwapPrice } from "./useSwapPrice";

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

  const quotePrice = useSwapPrice({
    maxSlippage,
    zeroExApiKey,
    swapFees,
    params,
    variant,
  });

  const nativeToken = chainId && GET_NATIVE_TOKEN(chainId);

  const coinPrices = useCoinPrices({
    currency,
    tokens: chainId ? [nativeToken] : [],
    chainId,
  });

  return useMemo(() => {
    if (
      coinPrices.data &&
      nativeToken?.chainId &&
      currency &&
      quotePrice.data
    ) {
      try {
        const t = coinPrices.data[nativeToken.chainId];
        if (t) {
          const price = t[zeroAddress];
          const currencyPrice = price[currency];
          const ethRates = quotePrice.data;
          const buyAmountUnits = Number(quotePrice.data.buyAmountUnits);
          const sellAmountUnits = Number(quotePrice.data.sellAmountUnits);

          return {
            buyPrice: intl.formatNumber(
              (currencyPrice / Number(ethRates.buyTokenToEthRate)) *
                buyAmountUnits,
              { style: "currency", currency }
            ),
            sellPrice: intl.formatNumber(
              (currencyPrice / Number(ethRates.sellTokenToEthRate)) *
                sellAmountUnits,
              { style: "currency", currency }
            ),
            isLoadingPrice: quotePrice.isLoading || coinPrices.isLoading,
          };
        }
      } catch (e) {
        return {};
      }
    }

    return { isLoadingPrice: quotePrice.isLoading || coinPrices.isLoading };
  }, [
    quotePrice.isLoading,
    quotePrice.data,
    currency,
    coinPrices.isLoading,
    coinPrices.data,
  ]);
}
