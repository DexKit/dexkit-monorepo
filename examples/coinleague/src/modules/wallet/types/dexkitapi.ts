export type DkApiAsset = {
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
  description: string | null;
  protocol?: 'ERC1155' | 'ERC721';
  spamInfo?: any;
  isHidden?: boolean;
};

export type DkApiAccountsNftResult = {
  total: number;
  account: string;
  assets: DkApiAsset[];
};
