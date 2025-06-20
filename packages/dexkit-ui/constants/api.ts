import axios from "axios";
import { AssetAPI } from "../modules/nft/types";
import {
  getAccessToken,
  getAccessTokenAndRefresh,
  getRefreshAccessToken,
} from "../services/auth";

export const DEXKIT_UI_BASE_API_URL =
  process.env.NEXT_PUBLIC_DEXKIT_DASH_ENDPOINT || "http://localhost:5000";
//const DEXKIT_UI_BASE_API_URL = 'https://nft-api.dexkit.com'
export const DEXKIT_NFT_BASE_URL = `${DEXKIT_UI_BASE_API_URL}`;

export const DEXKIT_STORAGE_MERKLE_TREE_URL =
  "https://dexkit-storage.nyc3.cdn.digitaloceanspaces.com/dexkit/merkle-tree/";

export const TRADER_BASE_API = "https://0x-orderbook.dexkit.com";
//export const TRADER_BASE_API = 'http://localhost:5000'

export const TRADER_ORDERBOOK_API = `${TRADER_BASE_API}/orderbook/orders`;

export const ENS_BASE_URL = "https://metadata.ens.domains";

export const metadataENSapi = axios.create({ baseURL: ENS_BASE_URL });

const DEXKIT_DASH_ENDPOINT = `${DEXKIT_UI_BASE_API_URL}`;

export const dexkitNFTapi = axios.create({
  baseURL: DEXKIT_NFT_BASE_URL,
  timeout: 2500,
});

export const myAppsApi = axios.create({
  baseURL: DEXKIT_DASH_ENDPOINT,
  headers: { "content-type": "application/json" },
});

myAppsApi.interceptors.request.use(
  async (config) => {
    const access_token = await getAccessTokenAndRefresh({});
    if (access_token)
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${access_token}`,
      };
    return config;
  },
  async function (error) {
    try {
      const access_token = await getAccessToken();
      if (error.response.status === 401 && access_token) {
        return await getAccessTokenAndRefresh({});
      }
    } catch {
      return Promise.reject(error);
    }
  }
);

myAppsApi.interceptors.response.use(
  async (response) => {
    return response;
  },
  async function (error) {
    try {
      const access_token = await getAccessToken();
      if (error.response.status === 401 && access_token) {
        return await getRefreshAccessToken({});
      }
    } catch {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export async function getAssetDexKitApi({
  networkId,
  contractAddress,
  tokenId,
}: {
  networkId: string;
  contractAddress: string;
  tokenId: string;
}) {
  const resp = await dexkitNFTapi.get<AssetAPI>(
    `/asset/${networkId}/${contractAddress.toLowerCase()}/${tokenId}`
  );
  // We replace it with the cdn image
  const imageUrl = resp.data.imageUrl?.replace(
    "dexkit-storage.nyc3.digitaloceanspaces.com",
    "dexkit-storage.nyc3.cdn.digitaloceanspaces.com"
  );

  if (imageUrl) {
    return { ...resp.data, imageUrl };
  }
  return resp.data;
}
