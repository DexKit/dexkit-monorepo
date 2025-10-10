import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants";
import { WRAPPED_TOKEN_ADDRESSES } from "@dexkit/evm-chains/constants";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useQuery } from "@tanstack/react-query";
import { getSimpleCoinPrices } from "../../services/currency";
import { useTokenList } from "../blockchain";
import { useCurrency } from "../currency";

const GET_SIMPLE_COIN_PRICES = 'GET_SIMPLE_COIN_PRICES';

export const useSimpleCoinPricesQuery = ({
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
    [GET_SIMPLE_COIN_PRICES, chain, tokens, currency],
    async () => {
      if (
        chain === undefined ||
        (tokens === undefined && !includeNative)
      ) {
        return;
      }
      const prices: { [key: string]: { [key: string]: number } } = {};

      if (includeNative) {
        /*  const activeNetwork = NETWORKS[chain];
          if (activeNetwork && activeNetwork.coingeckoPlatformId) {
            const nativePrice = await getDkCoinPrices({
              coingeckoIds: [activeNetwork.coingeckoPlatformId],
              currency,
            });
            if (nativePrice[`${activeNetwork.coingeckoPlatformId}`]) {
              prices[ZEROEX_NATIVE_TOKEN_ADDRESS] =
                nativePrice[`${activeNetwork.coingeckoPlatformId}`];
            }
          }*/
      }
      if (tokens.length === 0) {
        return prices;
      }
      const contractAddresses = tokens.map((t: any) => t.address);
      const wrapped_address = WRAPPED_TOKEN_ADDRESSES[chain]?.toLowerCase() || ' ';
      // Our API returns native as the wrapped coin
      if (includeNative) {

        if (!contractAddresses.includes(wrapped_address)) {
          contractAddresses.push(wrapped_address);
        }
      }


      let simplePrices = await getSimpleCoinPrices({ chainId: chain, contractAddresses, currency });


      if (includeNative) {
        const priceWrapped = simplePrices[wrapped_address];
        if (priceWrapped) {
          simplePrices = {
            ...simplePrices,
            [ZEROEX_NATIVE_TOKEN_ADDRESS]: priceWrapped
          }
        }

      }


      return simplePrices as { [key: string]: { [key: string]: number } };
    },
    { enabled: chain !== undefined, suspense: false }
  );
};