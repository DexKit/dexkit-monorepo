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





