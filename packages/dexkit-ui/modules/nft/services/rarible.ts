import axios from "axios";
import {
  AssetRari,
  CollectionRari,
  CollectionStatsRari,
} from "../types/rarible";

const RARIBLE_BASE_URL = "https://api.rarible.org";

const raribleApi = axios.create({
  baseURL: RARIBLE_BASE_URL,
  headers: {
    "X-API-KEY": process.env.RARIBLE_API_KEY || "",
  },
});

export function getRariCollection(collection: string) {
  return raribleApi.get<CollectionRari>(`/v0.1/collections/${collection}`);
}

export function getRariCollectionStats(collection: string, currency: string) {
  return raribleApi.get<CollectionStatsRari>(
    `/v0.1/data/collections/${collection}/stats?currency=${currency}`,
  );
}

export function getRariAsset(asset: string) {
  return raribleApi.get<AssetRari>(`/v0.1/items/${asset}`);
}
