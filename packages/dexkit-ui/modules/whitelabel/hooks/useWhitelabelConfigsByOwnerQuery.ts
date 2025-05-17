import { useQuery } from "@tanstack/react-query";
import { AppConfig } from "../../wizard/types/config";
import { getConfigsByOwner } from "../services";

export const QUERY_WHITELABEL_CONFIGS_BY_OWNER_NAME =
  'GET_WHITELABEL_CONFIGS_BY_OWNER_QUERY';

export interface ConfigsByOwnerParams {
  owner?: string;
}


export const useWhitelabelConfigsByOwnerQuery = ({
  owner,
}: ConfigsByOwnerParams) => {
  return useQuery([QUERY_WHITELABEL_CONFIGS_BY_OWNER_NAME, owner], async () => {
    if (!owner) {
      return [];
    }

    try {
      const response = await getConfigsByOwner(owner);
      return response.data.map((resp) => ({
        ...resp,
        appConfig: JSON.parse(resp.config) as AppConfig,
      }));
    } catch (error) {
      console.error("Error fetching configs by owner:", error);
      return [];
    }
  }, {
    refetchOnWindowFocus: false
  });
};