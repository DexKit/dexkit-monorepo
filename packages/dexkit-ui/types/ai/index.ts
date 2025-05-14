import { Asset } from "@dexkit/core/types/nft";

export interface ExtendedAsset extends Asset {
  imageUrl?: string;
  name?: string;
  networkId?: string;
}

export type UserOptions = {
  username?: string;
  bio?: string;
  shortBio?: string;
  profileImageURL?: string;
  backgroundImageURL?: string;
  discordVerified?: boolean;
  twitterVerified?: boolean;
  createdOnSiteId?: number;
  profileNft?: Asset;
  nftChainId?: number;
  nftAddress?: string;
  nftId?: string;
};

export type FeatUsageItem = {
  id: number;
  featUsageId: number;
  price: string;
  amount: string;
  featId: number;
  feat: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type FeatureSum = {
  amount: string;
  featId: number;
};

export type Feature = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type Subscription = {
  id: number;
  account: string;
  status: string;
  period_start: string;
  period_end: string;
  createdAt: string;
  updatedAt: string;
  planName: string;
  creditsAvailable: string;
  creditsUsed: string;
};

export type ImageGenerate = {
  prompt: string;
  numImages: number;
  model?: string;
  size: string;
};

export type FeatUsage = {
  id: number;
  used: string;
  available: string;
  account: string;
  type: string;
  name: string;
  subscriptionId: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};
