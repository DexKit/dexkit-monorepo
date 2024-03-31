import { Token } from '@dexkit/core/types';
import { Asset, SwapApiOrder } from '@dexkit/core/types/nft';
import { DkApiPlatformCoin } from '@dexkit/widgets/src/types/api';
import { UseQueryOptions } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { NFTType, SellOrBuy, TraderOrderStatus } from "../constants/enum";

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
}



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
  id: number
  createdAt: Date
  updatedAt: Date
  tokenId: string
  name: string | null
  collectionName: string | null
  symbol: string | null
  address: string
  networkId: string
  chainId: number | null
  imageUrl: string | null
  tokenURI: string | null
  rawData: string | null
  description: string | null
  protocol?: 'ERC1155' | 'ERC721';
  spamInfo?: any
}

export type OrderbookAPI = {
  data: {
    asset?: AssetAPI,
    order?: OrderBookItem,
    token?: DkApiPlatformCoin
  }[]
  total: number,
  take: number,
  skip: number;
}


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