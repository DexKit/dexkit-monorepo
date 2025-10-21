import { ChainId } from "@dexkit/core/constants/enums";
import { getPricesByChain } from "@dexkit/core/services";
import { Token } from "@dexkit/core/types";
import { useQuery } from "@tanstack/react-query";

export const COIN_PRICES_QUERY = "COIN_PRICES_QUERY";

export function useCoinPrices({
  currency,
  tokens,
  chainId,
}: {
  tokens?: Token[];
  chainId?: ChainId;
  currency?: string;
}) {
  return useQuery([COIN_PRICES_QUERY, chainId, tokens, currency], async () => {
    if (!chainId || !tokens || !currency) {
      return {};
    }

    return await getPricesByChain(chainId, tokens, currency);
  }, {
    enabled: !!(chainId && tokens && currency),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
