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
    if (!owner) return;

    return (await getConfigsByOwner(owner)).data.map((resp) => ({
      ...resp,
      appConfig: JSON.parse(resp.config) as AppConfig,
    }));
  });
};