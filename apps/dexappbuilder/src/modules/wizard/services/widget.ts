import { myAppsApi } from "@dexkit/ui/constants/api";
import { WidgetResponse } from "@dexkit/ui/modules/wizard/types/widget";





/**
 * Get widget admin config
 * @param queryParameters
 * @returns
 */
export async function getAdminWidgetConfig({ id }: { id: number }) {
  return await myAppsApi.get<WidgetResponse>(`/widget/by-owner/${id}`);
}

/**
 * Get widget admin config
 * @param queryParameters
 * @returns
 */
export async function getWidgetConfig({ id }: { id: number }) {
  return await myAppsApi.get<WidgetResponse>(`/widget/${id}`);
}

/**
 * Get all configs associated with a wallet
 * @param owner
 * @returns
 */
export async function getWidgetsByOwner() {
  return await myAppsApi.get<WidgetResponse[]>(`/widget/list/by-owner`);
}

/**
 * upsert widget
 * @param queryParameters
 * @returns
 */
export async function upsertWidgetConfig({ id, config }: { id?: number, config: string }) {
  return await myAppsApi.post<WidgetResponse>(`/widget/upsert`, {
    id,
    config,
  });
}
