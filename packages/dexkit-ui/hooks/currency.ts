import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { getTokenPrices } from "@dexkit/core/services";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { useAppConfig } from ".";
import { getCoinPrices } from "../services/currency";
import { currencyUserAtom } from "../state";
import { useTokenList } from "./blockchain";

export function useCurrency(): { currency: string, setCurrency: (currency: string) => void } {
  const appConfig = useAppConfig();

  const [currUser, setCurrUser] = useAtom(currencyUserAtom);

  const currency = useMemo(() => {
    if (currUser) {
      return currUser;
    }
    if (appConfig.currency) {
      return appConfig.currency
    }
    return 'usd' as string;
  }, [appConfig.locale, currUser])

  return { currency: currency || 'usd', setCurrency: setCurrUser };
}


export const GET_COIN_PRICES = 'GET_COIN_PRICES';

export const useCoinPricesQuery = ({
  includeNative,
  chainId,
}: {
  includeNative: boolean;
  chainId?: number
}) => {
  const { chainId: walletChainId } = useWeb3React();
  const chain = chainId || walletChainId

  const tokens = useTokenList({ chainId: chain });
  const { currency } = useCurrency();
  return useQuery(
    [GET_COIN_PRICES, chain, tokens, currency],
    async () => {
      if (
        chain === undefined ||
        (tokens === undefined && !includeNative)
      ) {
        return;
      }
      const prices: { [key: string]: { [key: string]: number } } = {};

      if (includeNative) {
        const activeNetwork = NETWORKS[chain];
        if (activeNetwork && activeNetwork.coingeckoPlatformId) {
          const nativePrice = await getCoinPrices({
            coingeckoIds: [activeNetwork.coingeckoPlatformId],
            currency,
          });
          if (nativePrice[`${activeNetwork.coingeckoPlatformId}`]) {
            prices[ZEROEX_NATIVE_TOKEN_ADDRESS] =
              nativePrice[`${activeNetwork.coingeckoPlatformId}`];
          }
        }
      }

      if (tokens.length === 0) {
        return prices;
      }
      const addresses = tokens.map((t: any) => t.address);
      const tokenPrices = await getTokenPrices({
        addresses,
        currency,
        chainId: chain,
      });
      return { ...prices, ...tokenPrices };
    },
    { enabled: chain !== undefined, suspense: false }
  );
};