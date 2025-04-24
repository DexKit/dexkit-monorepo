import { DkApiPlatformCoin } from "@dexkit/widgets/src/types/api";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { DEXKIT_UI_BASE_API_URL } from "../constants/api";

export const COIN_PLATFORM_SEARCH_QUERY = "COIN_PLATFORM_SEARCH_QUERY";

export function usePlatformCoinSearch({
  keyword,
  network,
}: {
  keyword?: string;
  network?: string;
}) {
  return useQuery(
    [COIN_PLATFORM_SEARCH_QUERY, keyword, network],
    async ({ signal }) => {
      const req = await axios.get<DkApiPlatformCoin[]>(
        `${DEXKIT_UI_BASE_API_URL}/coin/search-platforms`,
        { params: { keyword, network } }
      );

      return [...req.data];
    }
  );
}
