import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { DkApiPlatformCoin } from 'src/types/api';
import { Token } from 'src/types/blockchain';

import {
  getChainIdFromSlug,
  getNetworkSlugFromChainId,
  isAddressEqual,
} from '@dexkit/core/utils/blockchain';
import { useTokenList } from '@dexkit/ui/hooks/blockchain';
import { getApiCoinPlatforms, getApiCoins } from '../services';

export function useSearchSwapTokens({
  keyword,
  network,
  excludeNative,
  excludeTokenList,
  featuredTokens,
}: {
  keyword?: string;
  network?: string;
  excludeNative?: boolean;
  excludeTokenList?: boolean;
  featuredTokens?: Token[];
}) {
  const tokensFromList = useTokenList({
    chainId: getChainIdFromSlug(network)?.chainId,
    includeNative: excludeNative ? false : true,
  });

  const nativeToken = useTokenList({
    chainId: getChainIdFromSlug(network)?.chainId,
    onlyNative: true,
  });

  const coinSearchQuery = usePlatformCoinSearch({ keyword, network });

  const tokens = useMemo(() => {
    if (coinSearchQuery.data) {
      let coins = coinSearchQuery.data
        .filter((c) => Boolean(getNetworkSlugFromChainId(c.chainId)))
        .map((c: DkApiPlatformCoin) => {
          return {
            decimals: c.decimals,
            address: c.address,
            name: c.coin?.name,
            chainId: c.chainId,
            network: getNetworkSlugFromChainId(c.chainId),
            coingeckoId: c.coin?.coingeckoId,
            symbol: c.coin?.symbol,
            logoURI: c.coin?.logoUrl,
          } as Token;
        });

      if (network && !excludeTokenList && !featuredTokens) {
        coins = [...tokensFromList, ...coins];
      }
      if (featuredTokens) {
        coins = [...nativeToken, ...featuredTokens, ...coins];
      }

      if (keyword) {
        coins = coins.filter(
          (c) =>
            c.name.toLowerCase().search(keyword?.toLowerCase()) > -1 ||
            c.symbol.toLowerCase().search(keyword?.toLowerCase()) > -1,
        );
      }

      return coins.reduce<Token[]>((acc, current) => {
        const found =
          acc.find(
            (c) =>
              isAddressEqual(c.address, current.address) &&
              c.chainId === current.chainId,
          ) !== undefined;

        if (!found) {
          acc.push(current);
        }

        return acc;
      }, []);
    } else {
      let tokens = tokensFromList;

      if (keyword) {
        tokens = tokens.filter(
          (c) =>
            c.name.toLowerCase().search(keyword?.toLowerCase()) > -1 ||
            c.symbol.toLowerCase().search(keyword?.toLowerCase()) > -1,
        );
      }
      return tokens;
    }

    return [];
  }, [coinSearchQuery.data, network, keyword, tokensFromList]);

  return { tokens, isLoading: coinSearchQuery.isLoading };
}

export const COIN_PLATFORM_SEARCH_QUERY = 'COIN_PLATFORM_SEARCH_QUERY';

export function usePlatformCoinSearch({
  keyword,
  network,
}: {
  keyword?: string;
  network?: string;
}) {
  return useQuery(
    [COIN_PLATFORM_SEARCH_QUERY, keyword, network],
    async ({ signal }) => {
      if (keyword) {
        const req = await getApiCoinPlatforms({ signal, keyword, network });

        return req.data;
      }

      return [];
    },
  );
}

export const COIN_SEARCH_QUERY = 'COIN_SEARCH_QUERY';

export function useCoinSearch({
  keyword,
  network,
}: {
  keyword?: string;
  network?: string;
}) {
  return useQuery([COIN_SEARCH_QUERY, keyword, network], async ({ signal }) => {
    const req = await getApiCoins({ signal, keyword, network });

    return req.data;
  });
}
