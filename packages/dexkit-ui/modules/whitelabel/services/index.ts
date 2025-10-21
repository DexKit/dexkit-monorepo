import { myAppsApi } from "../../../constants/api";
import { ConfigResponse } from "../../wizard/types/config";
import { PageTemplateResponse } from "../types";

export async function deleteConfig(slug: string) {
  return await myAppsApi.delete<ConfigResponse[]>(`/site`, {
    params: { slug },
  });
}

/**
 * Get all configs associated with a wallet
 * @param owner
 * @returns
 */
export async function getConfigsByOwner(owner: string) {
  return await myAppsApi.get<ConfigResponse[]>(`/site/${owner}`);
}

/**
 * Get configs associated with a wallet with pagination
 * @param owner
 * @param page
 * @param pageSize
 * @returns
 */
export async function getConfigsByOwnerPaginated(owner: string, page: number = 0, pageSize: number = 10) {
  return await myAppsApi.get<{ data: ConfigResponse[], total: number }>(`/site/${owner}`, {
    params: {
      page,
      pageSize,
    }
  });
}


/**
 * Get all page tempaltes associated with a wallet
 * @param owner
 * @returns
 */
export async function getPageTemplatesByOwner(owner: string) {
  return await myAppsApi.get<PageTemplateResponse[]>(
    `/site/page-template/${owner}`
  );
}

export async function deletePageTemplate(id: string) {
  return await myAppsApi.delete<PageTemplateResponse[]>(
    `/site/page-template/${id}`
  );
}