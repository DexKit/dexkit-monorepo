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
  return await myAppsApi.get(`/forms/${id}`, {});
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
    params: { creatorAddress, query },
  });
}

export async function saveContractDeploy({
  contractAddress,
  name,
  type,
  chainId,
  metadata,
  createdAtTx,
  owner,
  referral,
}: {
  contractAddress: string;
  name?: string;
  type?: string;
  chainId: number;
  owner?: string;
  createdAtTx?: string;
  referral?: string;
  metadata?: {
    name?: string;
    description?: string;
    symbol?: string;
    image?: string;
  };
}) {
  return await myAppsApi.post(`/forms/deploy`, {
    name,
    contractAddress,
    type,
    createdAtTx,
    chainId,
    referral,
    metadata: JSON.stringify(metadata),
    owner,
  });
}
