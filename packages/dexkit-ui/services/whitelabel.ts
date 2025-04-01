import { myAppsApi } from "../constants/api";
import { ConfigResponse } from "../modules/wizard/types/config";

/**
 * Get config by name or domain, at least one of these parameters should be passed
 * @param queryParameters
 * @returns
 */
export async function getConfig(queryParameters: {
  domain?: string;
  slug?: string;
  appPage?: string;
}) {
  return await myAppsApi.get<ConfigResponse>(`/site`, {
    params: {
      domain: queryParameters.domain,
      slug: queryParameters.slug,
      ["app-page"]: queryParameters.appPage,
    },
  });
}
