import { useQuery } from "@tanstack/react-query";
import { getPageTemplatesByOwner } from "../services";
import { ConfigsByOwnerParams } from "./useWhitelabelConfigsByOwnerQuery";

export const QUERY_PAGE_TEMPLATES_CONFIGS_BY_OWNER_NAME =
  'GET_PAGE_TEMPLATES_CONFIGS_BY_OWNER_QUERY';

export const usePageTemplatesByOwnerQuery = ({
  owner,
}: ConfigsByOwnerParams) => {
  return useQuery(
    [QUERY_PAGE_TEMPLATES_CONFIGS_BY_OWNER_NAME, owner],
    async () => {
      if (!owner) return;

      return (await getPageTemplatesByOwner(owner)).data;
    }
  );
};