import { ChainId } from "@dexkit/core/constants/enums";

export const SUPPORTED_GASLESS_CHAIN = [1, 137, 42161, 8453, 10]


export const ZEROEX_NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const ZEROEX_CHAIN_PREFIX = (chainId?: number) => {
  switch (chainId) {
    case ChainId.Polygon:
      return "polygon.";
    case ChainId.Mumbai:
      return "mumbai.";
    case ChainId.Celo:
      return "celo.";
    case ChainId.Ropsten:
      return "ropsten.";
    case ChainId.BSC:
      return "bsc.";
    case ChainId.Avax:
      return "avalanche.";
    case ChainId.Fantom:
      return "fantom.";
    case ChainId.Optimism:
      return "optimism.";
    case ChainId.Arbitrum:
      return "arbitrum.";
    case ChainId.Base:
      return "base.";
    case ChainId.Goerli:
      return "goerli.";
    default:
      return "";
  }
};

export const ZERO_EX_URL = (chainId?: number, siteId?: number) => {

  return `/api/zrx-api/${siteId || 'dexappbuilder'}/${chainId}`;

  /*if (siteId !== undefined) {
    return `/api/zrx/${siteId}/${NETWORK_SLUG(chainId)}`;
  }

  return `https://${ZEROEX_CHAIN_PREFIX(chainId)}api.0x.org`;*/
};

export const ZEROEX_QUOTE_ENDPOINT = "/swap/v1/quote";

export const ZEROEX_TOKENS_ENDPOINT = "/swap/v1/tokens";
export const ZEROEX_ORDERBOOK_ENDPOINT = "/orderbook/v1/order";
export const ZEROEX_ORDERBOOK_ORDERS_ENDPOINT = "/orderbook/v1/orders";

export const ZEROEX_AFFILIATE_ADDRESS =
  "0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d";
export const ZEROEX_FEE_RECIPIENT =
  "0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d";

// TX relay endpoints

export const ZEROEX_GASLESS_PRICE_ENDPOINT = "/tx-relay/v1/swap/price";

export const ZEROEX_GASLESS_QUOTE_ENDPOINT = "/tx-relay/v1/swap/quote";

export const ZEROEX_GASLESS_SUBMIT_ENDPOINT = "/tx-relay/v1/swap/submit";

export const ZEROEX_GASLESS_STATUS_ENDPOINT = "/tx-relay/v1/swap/status";