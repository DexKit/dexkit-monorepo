import { myAppsApi } from "@dexkit/ui/constants/api";
import { WidgetConfig } from "@dexkit/ui/modules/wizard/types/widget";





/**
 * Get widget admin config
 * @param queryParameters
 * @returns
 */
export async function getAdminWidgetConfig({ id }: { id: number }) {
  return await myAppsApi.get<WidgetConfig>(`/widget/admin/${id}`);
}

/**
 * Get widget admin config
 * @param queryParameters
 * @returns
 */
export async function getWidgetConfig({ id }: { id: number }) {
  return await myAppsApi.get<WidgetConfig>(`/widget/${id}`);
}

/**
 * Get all configs associated with a wallet
 * @param owner
 * @returns
 */
export async function getWidgetsByOwner(owner: string) {
  return await myAppsApi.get<WidgetConfig[]>(`/widget/list/${owner}`);
}

/**
 * Update widget
 * @param queryParameters
 * @returns
 */
export async function updateWidgetConfig({ id, config }: { id: number, config: WidgetConfig }) {
  return await myAppsApi.post<WidgetConfig>(`/widget/update/${id}`, {
    config,
  });
}

/**
 * Create widget
 * @param queryParameters
 * @returns
 */
export async function createWidgetConfig({ config }: { config: WidgetConfig }) {
  return await myAppsApi.post<WidgetConfig>(`/widget/create`, {
    config
  });
}