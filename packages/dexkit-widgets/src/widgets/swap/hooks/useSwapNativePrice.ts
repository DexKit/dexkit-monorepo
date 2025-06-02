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
        const client = new ZeroExApiClient(chainId, siteId);

        if (buyToken) {
          if (buyToken.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS.toLowerCase()) {
            const sellTokenAmount = parseEther('0.001');
            const sellAmountUnits = formatUnits(BigInt(sellTokenAmount), 18);

            return {
              sellTokenToEthRate: '1',
              sellAmountUnits: sellAmountUnits.toString(),
              buyAmountUnits: sellAmountUnits.toString()
            };
          }

          const amountsToTry = ['0.01', '0.1', '1.0'];

          for (const amount of amountsToTry) {
            try {
              const sellTokenAmount = parseEther(amount);
              const quoteParam: ZeroExQuote = {
                chainId,
                buyToken: buyToken.address,
                sellToken: ZEROEX_NATIVE_TOKEN_ADDRESS,
                feeRecipient: swapFees?.recipient,
                taker: params.account || "0x0000000000000000000000000000000000000000",
                sellAmount: sellTokenAmount.toString(),
              };

              if (maxSlippage !== undefined) {
                quoteParam.slippagePercentage = maxSlippage;
              } else {
                quoteParam.slippagePercentage = 0.01; // 1%
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
