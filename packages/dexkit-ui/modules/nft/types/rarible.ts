import { MARKETPLACES } from "../constants/marketplaces";

export interface CollectionRari {
  meta: {
    description: string;
    content: {
      url: string;
      "@type": "IMAGE" | "VIDEO" | "HTML";
      representation: "PREVIEW" | "BIG" | "ORIGINAL";
    }[];
  };
}

export interface CollectionStatsRari {
  highestSale: number;
  floorPrice: number;
  marketCap: number;
  items: number;
  owners: number;
  volume: number;
}

export interface AssetRari {
  bestSellOrder: {
    id: string;
    platform: MARKETPLACES;
    status: "ACTIVE" | "FILLED" | "HISTORICAL" | "INACTIVE" | "CANCELLED";
    endedAt: string;
    makePrice: string;
    maker: string;
    makePriceUsd: string;
    take: {
      type: {
        "@type": string;
        blockchain: string;
      };
      value: string;
    };
  };
}
