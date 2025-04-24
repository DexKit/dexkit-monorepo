export type Nft = {
  contractAddress: string;
  owner?: string;
  tokenURI: string;
  symbol: string;
  tokenId: string;
  collectionName?: string;
};

export type NftMetadataAttribute = {};

export type NftMetadata = {
  name: string;
  image: string;
  description: string;
  attributes: NftMetadataAttribute[];
};
