import { ChainId } from "@dexkit/core/constants";
import { NETWORK_ID } from "../../../constants/enum";

export enum MARKETPLACES {
  OPEN_SEA = "OPEN_SEA",
  RARIBLE = "RARIBLE",
  LOOKS_RARE = "LOOKSRARE",
  SUDOSWAP = "SUDOSWAP",
}

export const MARKETPLACES_INFO = {
  [MARKETPLACES.OPEN_SEA]: {
    logo: "/marketplaces/opensealogo.svg",
    name: "OpenSea",
    baseAssetUrl: "https://opensea.io/assets/",
    networkMapping: {
      [NETWORK_ID.Ethereum]: "ethereum",
      [NETWORK_ID.Polygon]: "matic",
      [NETWORK_ID.Optimism]: "optimism",
      [NETWORK_ID.Arbitrum]: "arbitrum",
      [NETWORK_ID.Avalanche]: "avalanche",
      [NETWORK_ID.BSC]: "bsc",
      [NETWORK_ID.Base]: "base",
    },
  },
  [MARKETPLACES.RARIBLE]: {
    logo: "/marketplaces/rariblelogo.png",
    name: "Rarible",
    baseAssetUrl: "https://rarible.com/token/",
    networkMapping: {
      [NETWORK_ID.Ethereum]: "ethereum",
      [NETWORK_ID.Polygon]: "polygon",
      [NETWORK_ID.Base]: "base",
    },
  },
  [MARKETPLACES.LOOKS_RARE]: {
    logo: "/marketplaces/looksrare.png",
    name: "LooksRare",
    baseAssetUrl: "https://looksrare.org/collections/",
  },
  [MARKETPLACES.SUDOSWAP]: {
    logo: "/marketplaces/sudoswaplogo.png",
    name: "SudoSwap",
    baseAssetUrl: "https://sudoswap.xyz/#/item/",
  },
};

export type SUPPORTED_RARIBLE_NETWORKS =
  | NETWORK_ID.Ethereum
  | NETWORK_ID.Polygon
  | NETWORK_ID.Base;

export const IS_SUPPORTED_BY_RARIBLE = (
  network?: SUPPORTED_RARIBLE_NETWORKS,
) =>
  network
    ? network === NETWORK_ID.Ethereum ||
      network === NETWORK_ID.Polygon ||
      network === NETWORK_ID.Base
    : false;

export const IS_CHAIN_SUPPORTED_BY_RARIBLE = (chainId?: number) =>
  chainId
    ? chainId === ChainId.Ethereum ||
      chainId === ChainId.Polygon ||
      chainId === ChainId.Base
    : false;

export const MAP_NETWORK_TO_RARIBLE = {
  [NETWORK_ID.Ethereum]: "ETHEREUM",
  [NETWORK_ID.Polygon]: "POLYGON",
  [NETWORK_ID.Base]: "BASE",
  //[NETWORK_ID.Arbitrum]: 'ARBITRUM'
};

export const MAP_COIN_TO_RARIBLE = {
  [NETWORK_ID.Ethereum]: "ETH",
  [NETWORK_ID.Polygon]: "MATIC",
  [NETWORK_ID.Base]: "ETH",
  //[NETWORK_ID.Arbitrum]: 'ETH'
} as { [key: string]: string };
