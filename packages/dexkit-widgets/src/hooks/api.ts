import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { DEXKIT_API_URL } from "../constants/api";
import { DkApiPlatformCoin } from "../types/api";

export const COIN_PLATFORM_SEARCH_QUERY = "COIN_PLATFORM_SEARCH_QUERY";

export function usePlatformCoinSearch({
  keyword,
  network,
  disable,
}: {
  keyword?: string;
  network?: string;
  disable?: boolean;
}) {
  return useQuery(
    [COIN_PLATFORM_SEARCH_QUERY, keyword, network, disable],
    async ({ signal }) => {
      if (disable) {
        return null;
      }

      const req = await axios.get<DkApiPlatformCoin[]>(
        `${DEXKIT_API_URL}/coin/search-platforms`,
        { params: { keyword, network } }
      );

      return [...req.data];
    }
  );
}
