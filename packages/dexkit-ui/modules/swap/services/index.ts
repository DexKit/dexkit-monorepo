import { DkApiPlatformCoin } from "@dexkit/widgets/src/types/api";
import axios from 'axios';
import { DEXKIT_UI_BASE_API_URL } from "../../../constants/api";


const API_ENDPOINT = `${DEXKIT_UI_BASE_API_URL}`;



export async function getApiCoinPlatforms({ keyword, network, signal }: { keyword?: string, network?: string, signal?: AbortSignal }) {
  return await axios.get<DkApiPlatformCoin[]>(
    `${API_ENDPOINT}/coin/search-platforms`,
    { params: { keyword, network } }
  );
}