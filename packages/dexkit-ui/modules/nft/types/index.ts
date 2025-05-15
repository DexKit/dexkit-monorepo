import type { Token } from "@dexkit/core/types";

import type { DkApiPlatformCoin } from "@dexkit/widgets/src/types/api";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { BigNumber } from "ethers";
import type { NFTType, SellOrBuy, TraderOrderStatus } from "../constants/enum";

export interface AssetMetadata {
  name: string;
  image?: string;
  description?: string;
  animation_url?: string;
  attributes?: {
    display_type?: string;
    trait_type: string;
    value: string;
  }[];
}

export interface Asset {
  id: string;
  chainId: number;
  contractAddress: string;
  owner?: string;
  tokenURI: string;
  collectionName: string;
  symbol: string;
  type?: string;
  metadata?: AssetMetadata;
  balance?: BigNumber;
  protocol?: "ERC1155" | "ERC721";
}

export interface Collection {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  imageUrl?: string;
  nftType?: NFTType;
  description?: string;
  syncStatus?: string;
  syncedAssets?: number;
  traitCounts?: string;
  totalSupply?: number;
}

export interface ContractURIMetadata {
  name: string;
  image?: string;
  description?: string;
  banner_image_url?: string;
  external_link?: string;
}

export type AssetStoreOptions = {
  name?: string;
  title?: string;
  profileImageURL?: string;
  backgroundImageURL?: string;
  description?: string;
  storeAccount?: string;
};

export interface TraderOrderFilter {
  nftToken?: string;
  nftTokenId?: string;
  erc20Token?: string;
  chainId?: number;
  maker?: string;
  taker?: string;
  nonce?: string;
  sellOrBuyNft?: string; // TODO: COLOCAR ENUM
  status?: TraderOrderStatus;
  visibility?: string;
  offset?: number;
  limit?: number;
}

export type AssetAPI = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  tokenId: string;
  name: string | null;
  collectionName: string | null;
  symbol: string | null;
  address: string;
  networkId: string;
  chainId: number | null;
  imageUrl: string | null;
  tokenURI: string | null;
  rawData: string | null;
  rawDataJSON?: {
    image?: string;
    name?: string;
    description?: string;
  };
  description: string | null;
  protocol?: "ERC1155" | "ERC721";
  spamInfo?: any;
};

export type OrderbookAPI = {
  data: {
    asset?: AssetAPI;
    order?: OrderBookItem;
    token?: DkApiPlatformCoin;
  }[];
  total: number;
  take: number;
  skip: number;
};

export interface OrderBookItem {
  erc20Token: string;
  erc20TokenAmount: string;
  nftToken: string;
  nftTokenId: string;
  nftTokenAmount: string;
  nftType: NFTType;
  sellOrBuyNft: SellOrBuy;
  chainId: string;
  order: SwapApiOrder;
  orders?: SwapApiOrder[];
  asset?: Asset;
  token?: Token;
}

export interface OrderbookResponse {
  orders: OrderBookItem[];
}

export interface HiddenAsset {
  id: string;
  chainId: number;
  contractAddress: string;
}

export interface AssetBalance {
  balance?: BigNumber;
  asset: Asset;
}

export type AssetOptions = {
  options?: Omit<UseQueryOptions<Asset>, any>;
};

export interface CollectionAPI {
  chainId: number;
  networkId: string;
  name: string;
  imageUrl?: string;
  address: string;
  protocol: string;
  description?: string;
  syncStatus?: string;
  syncedAssets?: number;
  symbol: string;
  traitCounts?: string;
  totalSupply?: number;
}

export type CollectionUniformItem = {
  name: string;
  contractAddress: string;
  backgroundImage: string;
  network: string;
  chainId: number;
  image: string;
};

export interface SwapApiOrder {
  direction: number;
  erc20Token: string;
  erc20TokenAmount: string;
  erc721Token: string;
  erc721TokenId: string;
  erc721TokenProperties: any[];
  expiry: string;
  fees: any[];
  maker: string;
  nonce: string;
  signature: {
    r: string;
    s: string;
    signatureType: number;
    v: number;
  };
  taker: string;
}
