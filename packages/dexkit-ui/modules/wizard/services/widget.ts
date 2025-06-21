
import { myAppsApi } from "../../../constants/api";
import { WidgetResponse } from "../types/widget";

/**
 * Get widget admin config
 * @param queryParameters
 * @returns
 */
export async function getWidgetConfig({ id, isOnSite }: { id: number, isOnSite?: boolean }) {
  return await myAppsApi.get<WidgetResponse>(isOnSite ? `/widget/for-site/${id}` : `/widget/${id}`);
}

/**
 * Deletes a widget by its unique identifier.
 *
 * Sends a DELETE request to the API to remove the widget with the specified ID.
 * If the ID is not provided, the request may fail or be ignored depending on the API implementation.
 *
 * @param {Object} params - The parameters for deleting the widget.
 * @param {number} [params.id] - The unique identifier of the widget to delete.
 * @returns  A promise that resolves to the response of the delete operation.
 */
export async function deleteWidget({ id }: { id?: number }) {
  return await myAppsApi.delete<WidgetResponse>(`/widget/${id}`);
}

/**
 * Get all configs associated with a wallet
 * @param owner
 * @returns
 */
export async function getWidgetsByOwner() {
  return await myAppsApi.get<WidgetResponse[]>(`/widget/list/by-owner`);
}
