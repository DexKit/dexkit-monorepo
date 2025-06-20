import { ChainId } from "@dexkit/core/constants/enums";

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

export const ZERO_EX_V2_URL = (chainId?: number) =>
  `https://${ZEROEX_CHAIN_PREFIX(chainId)}api.0x.org`;

export const ZEROEX_QUOTE_ENDPOINT = "/swap/v1/quote";

export const ZEROEX_TOKENS_ENDPOINT = "/swap/v1/tokens";
export const ZEROEX_ORDERBOOK_ENDPOINT = "/orderbook/v1/order";
export const ZEROEX_ORDERBOOK_ORDERS_ENDPOINT = "/orderbook/v1/orders";

export const ZEROEX_AFFILIATE_ADDRESS =
  "0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d";
export const ZEROEX_FEE_RECIPIENT =
  "0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d";

// neutral address that helps 0x API provide accurate quotes
export const ZEROEX_DEFAULT_TAKER_ADDRESS =
  "0x00000000000000000000000000000000000fffff";
