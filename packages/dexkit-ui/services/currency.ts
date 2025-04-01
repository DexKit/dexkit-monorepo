import {
  COINGECKO_ENDPOIT,
  COINGECKO_PLATFORM_ID,
  ChainId,
} from "@dexkit/core/constants";
import axios from "axios";
import { myAppsApi } from "../constants/api";

export const getTokenPrices = async ({
  chainId,
  addresses,
  currency = "usd",
}: {
  chainId: ChainId;
  addresses: string[];
  currency: string;
}): Promise<{ [key: string]: { [key: string]: number } }> => {
  const platformId = COINGECKO_PLATFORM_ID[chainId];
  if (!platformId) {
    return {};
  }

  const priceResponce = await axios.get(
    `${COINGECKO_ENDPOIT}/simple/token_price/${platformId}?contract_addresses=${addresses.concat(
      ",",
    )}&vs_currencies=${currency}`,
  );

  return priceResponce.data as { [key: string]: { [key: string]: number } };
};

export const getCoinPrices = async ({
  coingeckoIds,
  currency = "usd",
}: {
  coingeckoIds: string[];
  currency: string;
}): Promise<{ [key: string]: { [key: string]: number } }> => {
  const priceResponce = await axios.get(
    `${COINGECKO_ENDPOIT}/simple/price?ids=${coingeckoIds.concat(
      ",",
    )}&vs_currencies=${currency}`,
  );

  return priceResponce.data as { [key: string]: { [key: string]: number } };
};

type DkCoinPriceAPIResponse = {
  currency: string;
  currencyUSDRatio: string;
  tokens: {
    tokenName: string;
    tokenSymbol: string;
    tokenLogo: string;
    tokenDecimals: string;
    nativePrice: {
      value: string;
      decimals: number;
      name: string;
      symbol: string;
      address: string;
    };
    usdPrice: number;
    usdPriceFormatted: string;
    exchangeName: string;
    exchangeAddress: string;
    tokenAddress: string;
    priceLastChangedAtBlock: string;
    verifiedContract: boolean;
    "24hrPercentChange": string;
  }[];
};

/**
 * Alternative coin price currency
 * @param param0
 * @returns
 */
export const getDKCoinPrices = async ({
  chainId,
  contractAddresses,
  currency = "usd",
}: {
  contractAddresses: string[];
  chainId: number;
  currency: string;
}): Promise<DkCoinPriceAPIResponse> => {
  const priceResponce = await myAppsApi.get(
    `coin/chain/${chainId}/price?contract_addresses=${contractAddresses.concat(
      ",",
    )}&vs_currency=${currency}`,
  );

  return priceResponce.data as DkCoinPriceAPIResponse;
};

/**
 * Alternative simple coin price currency
 * @param param0
 * @returns
 */
export const getSimpleCoinPrices = async ({
  chainId,
  contractAddresses,
  currency = "usd",
}: {
  contractAddresses: string[];
  chainId: number;
  currency: string;
}): Promise<{ [key: string]: { [key: string]: number } }> => {
  const priceResponce = await myAppsApi.get(
    `coin/chain/${chainId}/price/simple?contract_addresses=${contractAddresses.concat(
      ",",
    )}&vs_currency=${currency}`,
  );

  return priceResponce.data as { [key: string]: { [key: string]: number } };
};
