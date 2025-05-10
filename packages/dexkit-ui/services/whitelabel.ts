import { myAppsApi } from "../constants/api";
import { SiteResponse } from "../modules/wizard/types/config";
import { AppPageSection } from "../modules/wizard/types/section";

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
  return await myAppsApi.get<SiteResponse>(`/site`, {
    params: {
      domain: queryParameters.domain,
      slug: queryParameters.slug,
      ["app-page"]: queryParameters.appPage,
    },
  });
}

/**
 * Get config by name or domain, at least one of these parameters should be passed
 * @param queryParameters
 * @returns
 */
export async function getProtectedAppConfig(queryParameters: {
  domain?: string;
  slug?: string;
  appPage?: string;
}) {
  return await myAppsApi.get<{
    sections: AppPageSection[];
    result: boolean;
    balances: { [key: number]: string };
    partialResults: { [key: number]: boolean };
  }>(`/site/protected`, {
    params: {
      domain: queryParameters.domain,
      slug: queryParameters.slug,
      ["app-page"]: queryParameters.appPage,
    },
  });
}
/**
 * Get config by name or domain, at least one of these parameters should be passed
 * @param queryParameters
 * @returns
 */
export async function getSitemapConfig(queryParameters: {
  domain?: string;
  slug?: string;
}) {
  return await myAppsApi.get<SiteResponse>(`/site/sitemap`, {
    params: {
      domain: queryParameters.domain,
      slug: queryParameters.slug,
    },
  });
}
