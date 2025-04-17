import { ChainId } from '@0x/contract-addresses';
import { getCoinPrices } from '@dexkit/ui/services/currency';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { COINGECKO_ENDPOIT, COINGECKO_PLATFORM_ID } from '@dexkit/core/constants';
import { NETWORKS } from '../constants/chain';
import { currencyAtom, currencyUserAtom } from '../state/atoms';
import { useAppConfig } from './app';

export function useCurrency(): string {
  const appConfig = useAppConfig();
  const curr = useAtomValue(currencyAtom);
  const currUser = useAtomValue(currencyUserAtom);

  const currency = useMemo(() => {
    if (currUser) {
      return currUser;
    }
    if (appConfig.currency && appConfig.currency !== curr) {
      return appConfig.currency
    }
    return curr || 'usd' as string;
  }, [appConfig.locale, curr, currUser])

  return currency || 'usd';
}



export const GET_FIAT_RATION = 'GET_FIAT_RATION';

export function useFiatRatio({
  chainId,
  contractAddress,
  currency,
}: {
  chainId?: ChainId;
  contractAddress?: string;
  currency?: string;
}) {
  return useQuery(
    [GET_FIAT_RATION, chainId, contractAddress, currency],
    async () => {
      if (!chainId || !contractAddress || !currency) {
        return;
      }

      const platformId = COINGECKO_PLATFORM_ID[chainId];

      if (!platformId) {
        return;
      }

      const response = await axios.get(
        `${COINGECKO_ENDPOIT}/simple/token_price/${platformId}?contract_addresses=${contractAddress}&vs_currencies=${currency}`
      );

      return response.data[contractAddress][currency];
    }
  );
}

export const GET_NATIVE_COIN_PRICE = 'GET_NATIVE_COIN_PRICE';

export const useNativeCoinPriceQuery = (defaultChainId?: number) => {
  const { provider, chainId: walletChainId } = useWeb3React();
  const chainId = defaultChainId || walletChainId;
  const currency = useCurrency();
  return useQuery(
    [GET_NATIVE_COIN_PRICE, chainId, currency],
    async () => {
      if (provider === undefined || chainId === undefined) {
        return;
      }

      const activeNetwork = NETWORKS[chainId];
      if (activeNetwork && activeNetwork.coingeckoPlatformId) {
        const nativePrice = await getCoinPrices({
          coingeckoIds: [activeNetwork.coingeckoPlatformId],
          currency,
        });
        if (nativePrice[`${activeNetwork.coingeckoPlatformId}`]) {
          return nativePrice[`${activeNetwork.coingeckoPlatformId}`][currency];
        }
      }
    },
    { enabled: provider !== undefined, suspense: true }
  );
};
