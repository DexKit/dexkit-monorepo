import { useQuery } from "@tanstack/react-query";
import { AppConfig } from "../../wizard/types/config";
import { getConfigsByOwner } from "../services/index";

export const QUERY_WHITELABEL_CONFIGS_BY_OWNER_PAGINATED_NAME = 'WHITELABEL_CONFIGS_BY_OWNER_PAGINATED';

export interface ConfigsByOwnerPaginatedParams {
  owner?: string;
  page?: number;
  pageSize?: number;
}

export const useWhitelabelConfigsByOwnerPaginatedQuery = ({
  owner,
  page = 0,
  pageSize = 10,
}: ConfigsByOwnerPaginatedParams) => {
  return useQuery([QUERY_WHITELABEL_CONFIGS_BY_OWNER_PAGINATED_NAME, owner, page, pageSize], async () => {
    if (!owner) {
      return { data: [], total: 0 };
    }

    try {
      const response = await getConfigsByOwner(owner);
      const allData = response.data.map((resp) => ({
        ...resp,
        appConfig: JSON.parse(resp.config) as AppConfig,
      }));

      // Client-side pagination
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = allData.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        total: allData.length,
      };
    } catch (error) {
      console.error("Error fetching configs by owner:", error);
      return { data: [], total: 0 };
    }
  }, {
    refetchOnWindowFocus: false
  });
};
