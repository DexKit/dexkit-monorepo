import { ZeroExApiClient } from "@dexkit/ui/modules/swap/services/zrxClient";
import {
  ZeroExQuote
} from "@dexkit/ui/modules/swap/types";
import { useContext } from "react";

import { ChainId, ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { SiteContext } from "@dexkit/ui/providers/SiteProvider";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { useDexKitContext } from "@dexkit/ui/hooks";
import { SwapVariant } from "@dexkit/ui/modules/wizard/types";
import { formatUnits, parseEther } from "viem";

interface SwapNativeQuoteParams {
  buyToken?: Token;
  chainId: ChainId;
  account?: string;
}

export const SWAP_NATIVE_PRICE = "SWAP_NATIVE_PRICE";

// Amount used to get a quote
const NATIVE_MIN_AMOUNT = '0.001';

/**
 * returns native price
 * @param param0 
 * @returns 
 */
export function useSwapNativePrice({
  maxSlippage,
  zeroExApiKey,
  swapFees,
  params,
  variant,
}: {
  maxSlippage?: number;
  zeroExApiKey?: string;
  swapFees?: { recipient: string; amount_percentage: number };
  params: SwapNativeQuoteParams;
  variant?: SwapVariant;
}): UseQueryResult<{ sellTokenToEthRate: string, sellAmountUnits: string, buyAmountUnits: string }
  | undefined
  | null,
  unknown
> {
  const refetchParams = {
    buyToken: params.buyToken
  }

  const { siteId } = useContext(SiteContext);
  const { widgetId, apiKey } = useDexKitContext();
  return useQuery(
    [
      SWAP_NATIVE_PRICE,
      refetchParams,
      params.chainId,
      params.account,
      maxSlippage,
      zeroExApiKey,
      swapFees,
      variant,
    ],
    async ({ signal }) => {
      // Classic variant don't have usd prices
      if (!variant || variant === SwapVariant.Classic) {
        return null;
      }

      if (!params || !params.buyToken || !params.chainId) {
        return null;
      }

      const {
        chainId,
        buyToken,
      } = { ...params };

      try {
        const client = new ZeroExApiClient(chainId, siteId, widgetId, apiKey);

        if (buyToken) {
          // Handle native token case
          if (buyToken.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS.toLowerCase()) {
            const sellTokenAmount = parseEther(NATIVE_MIN_AMOUNT);
            const sellAmountUnits = formatUnits(BigInt(sellTokenAmount), 18);

            return {
              sellTokenToEthRate: '1',
              sellAmountUnits: sellAmountUnits.toString(),
              buyAmountUnits: sellAmountUnits.toString()
            };
          }

          // Try different amounts if the first one fails
          const amountsToTry = [NATIVE_MIN_AMOUNT, '0.01', '0.1', '1.0'];

          for (const amount of amountsToTry) {
            try {
              const sellTokenAmount = parseEther(amount);
              const quoteParam: ZeroExQuote = {
                chainId,
                buyToken: buyToken.address,
                sellToken: ZEROEX_NATIVE_TOKEN_ADDRESS,
                feeRecipient: swapFees?.recipient,
                taker: params.account || "",
                sellAmount: sellTokenAmount.toString(),
              };

              if (maxSlippage !== undefined) {
                quoteParam.slippagePercentage = maxSlippage;
              }

              const { buyAmount, sellAmount } = await client.price(quoteParam, { signal });

              const buyAmountUnits = formatUnits(BigInt(buyAmount), buyToken.decimals);
              const sellAmountUnits = formatUnits(BigInt(sellAmount), 18);

              return {
                sellTokenToEthRate: (Number(buyAmountUnits) / Number(sellAmountUnits)).toString(),
                buyAmountUnits,
                sellAmountUnits,
              };
            } catch (error: any) {
              // Continue to next amount if this one fails
              continue;
            }
          }

          return null;
        }
      } catch (error) {
        return null;
      }

      return null;
    },
    {
      enabled: Boolean(params?.buyToken && params?.chainId && variant && variant !== SwapVariant.Classic),
      refetchInterval: 5000,
      retry: 1,
      staleTime: 30000
    }
  );
}
