import { myAppsApi } from "../../../constants/api";
import { WidgetResponse } from "../../wizard/types/widget";

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
