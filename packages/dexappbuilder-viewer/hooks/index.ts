import { getConfig } from "@dexkit/ui/services/whitelabel";
import { useQuery } from "@tanstack/react-query";

export const QUERY_WHITELABEL_CONFIG_NAME = "GET_WHITELABEL_CONFIG_QUERY";

/**
 * get config by name or query
 * @param param0
 * @returns
 */
export const useWhitelabelConfigQuery = ({
  domain,
  slug,
  page,
}: {
  domain?: string;
  slug?: string;
  page?: string;
}) => {
  return useQuery(
    [QUERY_WHITELABEL_CONFIG_NAME, domain || "", slug || ""],
    async () => {
      if (domain === undefined && slug === undefined) {
        return;
      }

      return (await getConfig({ domain, slug, appPage: page })).data;
    },
    { refetchOnWindowFocus: false, refetchOnReconnect: false },
  );
};
