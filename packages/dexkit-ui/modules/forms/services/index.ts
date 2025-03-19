import { myAppsApi } from "../../../constants/api";

export async function cloneForm({ id }: { id: number }) {
  return (await myAppsApi.post<{ id: number }>(`/forms/${id}/clone`)).data;
}

export async function getForm({
  id,
  signal,
}: {
  id: number;
  signal?: AbortSignal;
}) {
  return await myAppsApi.get(`/forms/${id}`, { signal });
}

export async function listForms({
  creatorAddress,
  signal,
  query,
}: {
  creatorAddress: string;
  query?: string;
  signal?: AbortSignal;
}) {
  return await myAppsApi.get(`/forms`, {
    signal,
    params: { creatorAddress, query },
  });
}
