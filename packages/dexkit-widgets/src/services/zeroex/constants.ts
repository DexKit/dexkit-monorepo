import { ChainId } from "@dexkit/core/constants/enums";
import { NETWORK_SLUG } from "@dexkit/core/constants/networks";

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
    case ChainId.Goerli:
      return "goerli.";
    case ChainId.Base:
      return "base.";
    default:
      return "";
  }
};

export const ZERO_EX_URL = (chainId?: number, siteId?: number) => {
  if (siteId !== undefined) {
    return `/api/zrx/${siteId}/${NETWORK_SLUG(chainId)}`;
  }

  return `https://${ZEROEX_CHAIN_PREFIX(chainId)}api.0x.org`;
};

export const ZEROEX_QUOTE_ENDPOINT = "/swap/v1/quote";

export const ZEROEX_TOKENS_ENDPOINT = "/swap/v1/tokens";

export const ZEROEX_AFFILIATE_ADDRESS =
  "0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d";
export const ZEROEX_FEE_RECIPIENT =
  "0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d";
