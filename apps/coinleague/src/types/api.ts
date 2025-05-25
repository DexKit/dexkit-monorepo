export type DkApiCoin = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  symbol: string;
  description?: string | null;
  logoUrl: string;
  isCoingeckoListed: boolean;
  coingeckoId: string;
  platformId: string;
  coinPlatforms: {
    id: number;
    createdAt: string;
    updatedAt: string;
    address: string;
    decimals: number;
    chainId: number;
    networkId: string;
    platformId: string;
    coinId: number;
  }[];
};

export type DkApiPlatformCoin = {
  id: number;
  createdAt: string;
  updatedAt: string;
  address: string;
  decimals: number;
  chainId: number;
  networkId: string;
  platformId: string;
  coinId: number;
  coin?: DkApiCoin;
};
