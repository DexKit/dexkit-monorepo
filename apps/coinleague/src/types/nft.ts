import { AssetAPI, OrderBookItem } from '@dexkit/ui/modules/nft/types';
import { DkApiPlatformCoin } from '@dexkit/widgets/src/types/api';








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

export type AssetStoreOptions = {
  name?: string;
  title?: string;
  profileImageURL?: string;
  backgroundImageURL?: string;
  description?: string;
  storeAccount?: string;
}