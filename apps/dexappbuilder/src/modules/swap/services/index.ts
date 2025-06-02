import axios from "axios";
import { DEXKIT_BASE_API_URL } from "src/constants";
import { DkApiCoin, DkApiPlatformCoin } from "src/types/api";

const API_ENDPOINT = `${DEXKIT_BASE_API_URL}`;

export async function getApiCoinPlatforms({ keyword, network, signal }: { keyword?: string, network?: string, signal?: AbortSignal }) {
  return await axios.get<DkApiPlatformCoin[]>(
    `${API_ENDPOINT}/coin/search-platforms`,
    { signal, params: { keyword, network } }
  );
}


export async function getApiCoins({ keyword, network, signal }: { keyword?: string, network?: string, signal?: AbortSignal }) {
  return await axios.get<DkApiCoin[]>(
    `${API_ENDPOINT}/coin/search`,
    { signal, params: { keyword, network } }
  );
}