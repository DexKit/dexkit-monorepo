import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useQuery } from "@tanstack/react-query";
import { getDKCoinPrices } from "../../services/currency";
import { useTokenList } from "../blockchain";
import { useCurrency } from "../currency";

const GET_DK_COIN_PRICES = "GET_DK_COIN_PRICES";

export const useCoinPricesQuery = ({
  includeNative,
  chainId,
}: {
  includeNative: boolean;
  chainId?: number;
}) => {
  const { chainId: walletChainId } = useWeb3React();
  const chain = chainId || walletChainId;

  const tokens = useTokenList({ chainId: chain });
  const { currency } = useCurrency();
  return useQuery(
    [GET_DK_COIN_PRICES, chain, tokens, currency],
    async () => {
      if (chain === undefined || (tokens === undefined && !includeNative)) {
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
      const contractAddresses = tokens.map((t) => t.address);
      const dkPrices = await getDKCoinPrices({
        chainId: chain,
        contractAddresses,
        currency,
      });
      const tokenPrices = {};
      for (let index = 0; index < dkPrices.tokens.length; index++) {
        const element = dkPrices.tokens[index];
        //@ts-ignore
        tokenPrices[`${element.tokenAddress.toLowerCase()}`] = {
          [`${currency}`]:
            Number(element.usdPrice) * Number(dkPrices.currencyUSDRatio),
        };
      }

      if (includeNative) {
        if (dkPrices.tokens) {
        }
      }

      return { ...prices, ...tokenPrices } as {
        [key: string]: { [key: string]: number };
      };
    },
    { enabled: chain !== undefined, suspense: false },
  );
};
