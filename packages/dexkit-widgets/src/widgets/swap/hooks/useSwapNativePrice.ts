import { ZeroExApiClient } from "@dexkit/ui/modules/swap/services/zrxClient";
import {
  ZeroExQuote
} from "@dexkit/ui/modules/swap/types";
import { useContext } from "react";

import { ChainId, ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { SiteContext } from "@dexkit/ui/providers/SiteProvider";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

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

      if (!params) {
        return null;
      }

      const sellTokenAmount = parseEther(NATIVE_MIN_AMOUNT);
      const sellToken = ZEROEX_NATIVE_TOKEN_ADDRESS;

      const {
        chainId,
        buyToken,
      } = { ...params };
      const client = new ZeroExApiClient(chainId, siteId);

      if (buyToken && sellToken) {
        const quoteParam: ZeroExQuote = {
          chainId,
          buyToken: buyToken?.address,
          sellToken: ZEROEX_NATIVE_TOKEN_ADDRESS,
          feeRecipient: swapFees?.recipient,
          taker: params.account || ""
        };

        if (maxSlippage !== undefined) {
          quoteParam.slippagePercentage = maxSlippage;
        }

        if (sellTokenAmount > 0) {
          quoteParam.sellAmount = sellTokenAmount?.toString();
          if (buyToken.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS) {

            const sellAmountUnits = formatUnits(
              BigInt(sellTokenAmount),
              18
            );



            return {
              sellTokenToEthRate: '1',
              sellAmountUnits: sellAmountUnits.toString(),
              buyAmountUnits: sellAmountUnits.toString()
            }
          }


          const {
            buyAmount,
            sellAmount,
          } = await client.price(quoteParam, { signal });

          const buyAmountUnits = formatUnits(
            BigInt(buyAmount),
            buyToken.decimals
          );
          const sellAmountUnits = formatUnits(
            BigInt(sellAmount),
            18
          );

          return {
            sellTokenToEthRate: (Number(buyAmountUnits) / Number(sellAmountUnits)).toString(),
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
