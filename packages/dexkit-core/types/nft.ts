import type { BigNumber } from "ethers";

export type Nft = {
  contractAddress: string;
  owner?: string;
  tokenURI: string;
  symbol: string;
  tokenId: string;
  collectionName?: string;
  chainId: number;
};

export type NftMetadataAttribute = {};

export type NftMetadata = {
  name?: string;
  image?: string;
  description?: string;
  attributes?: NftMetadataAttribute[];
};

export interface Asset {
  id: string;
  dbId?: number;
  chainId: number;
  contractAddress: string;
  owner?: string;
  tokenURI: string;
  collectionName: string;
  symbol: string;
  type?: string;
  balance?: BigNumber;
  metadata?: AssetMetadata;
  protocol?: "ERC1155" | "ERC721";
}

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
