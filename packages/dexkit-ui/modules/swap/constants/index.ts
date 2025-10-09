import { ChainId } from "@dexkit/core/constants/enums";

export const SUPPORTED_GASLESS_CHAIN = [1, 137, 42161, 8453, 10];

export const SUPPORTED_UNISWAP_V2 = [25];

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
    case ChainId.Optimism:
      return "optimism.";
    case ChainId.Arbitrum:
      return "arbitrum.";
    case ChainId.Base:
      return "base.";
    case ChainId.Goerli:
      return "goerli.";
    case ChainId.Linea:
      return "linea.";
    case ChainId.Scroll:
      return "scroll.";
    case ChainId.Mantle:
      return "mantle.";
    case ChainId.Blast:
      return "blast.";
    case ChainId.Mode:
      return "mode.";
    default:
      return "";
  }
};

export const SWAP_UNI_V2_URL = () => {
  return `${process.env.NEXT_PUBLIC_DEXKIT_DASH_ENDPOINT}/swap/univ2withfee`;
};

export const ZERO_EX_V2_WIDGET_URL = () => {
  return `${process.env.NEXT_PUBLIC_DEXKIT_DASH_ENDPOINT}/swap/api`;



  /*if (siteId !== undefined) {
      return `/api/zrx/${siteId}/${NETWORK_SLUG(chainId)}`;
  }
  
    return `https://${ZEROEX_CHAIN_PREFIX(chainId)}api.0x.org`;*/
};

export const ZERO_EX_V2_URL = (chainId?: number, siteId?: number) => {
  return `/api/zrx-api/v2/${siteId || "dexappbuilder"}/${chainId}`;
}


export const ZERO_EX_V1_URL = (chainId?: number, siteId?: number) => {
  return `/api/zrx-api/v1/${siteId || "dexappbuilder"}/${chainId}`;
};

export const ZEROEX_QUOTE_ENDPOINT = "/swap/permit2/quote";
export const ZEROEX_PRICE_ENDPOINT = "/swap/permit2/price";

export const ZEROEX_TOKENS_ENDPOINT = "/swap/v1/tokens";
export const ZEROEX_ORDERBOOK_ENDPOINT = "/orderbook/v1/order";

export const ZEROEX_ORDERBOOK_ORDERS_ENDPOINT = "/orderbook/v1/orders";

export const ZEROEX_AFFILIATE_ADDRESS =
  "0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d";
export const ZEROEX_FEE_RECIPIENT =
  "0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d";

// TX relay endpoints

export const ZEROEX_GASLESS_PRICE_ENDPOINT = "/gasless/price";

export const ZEROEX_GASLESS_QUOTE_ENDPOINT = "/gasless/quote";

export const ZEROEX_GASLESS_SUBMIT_ENDPOINT = "/gasless/submit";

export const ZEROEX_GASLESS_STATUS_ENDPOINT = "/gasless/status";

export const ZEROEX_SUPPORTS_GASLESS_ENDPOINT = "/gasless/chains";
