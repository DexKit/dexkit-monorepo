import { myAppsApi } from '@/modules/admin/dashboard/dataProvider';
import { ChainId } from '@dexkit/core';
import { TemplateInstance } from '../types';

export async function createForm({
  creatorAddress,
  params,
  signal,
  description,
  name,
  templateId,
}: {
  creatorAddress: string;
  name: string;
  description: string;
  params: string;
  templateId?: number;
  signal?: AbortSignal;
}) {
  return await myAppsApi.post(
    '/forms/create',
    { creatorAddress, params, name, description, templateId },
    { signal },
  );
}

export async function updateForm({
  id,
  name,
  description,
  params,
  signal,
}: {
  id: number;
  name: string;
  description: string;
  params: string;
  signal?: AbortSignal;
}) {
  return await myAppsApi.post(
    `/forms/${id}`,
    { name, description, params },
    { signal },
  );
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

export async function createFormTemplate({
  name,
  description,
  bytecode,
  abi,
  signal,
}: {
  name: string;
  description: string;
  bytecode: string;
  abi: string;
  signal?: AbortSignal;
}) {
  return await myAppsApi.post(
    '/forms/templates/create',
    { name, description, bytecode, abi },
    { signal },
  );
}

export async function updateFormTemplate({
  id,
  name,
  description,
  bytecode,
  abi,
  signal,
}: {
  id: number;
  name: string;
  description: string;
  bytecode: string;
  abi: string;
  signal?: AbortSignal;
}) {
  return await myAppsApi.post(
    `/forms/templates/${id}`,
    { name, description, bytecode, abi },
    { signal },
  );
}

export async function getFormTemplate({
  id,
  signal,
}: {
  id: number;
  signal?: AbortSignal;
}) {
  return await myAppsApi.get(`/forms/templates/${id}`, { signal });
}

export async function listFormTemplates({
  creatorAddress,
  signal,
  query,
}: {
  creatorAddress: string;
  signal?: AbortSignal;
  query?: string;
}) {
  return await myAppsApi.get(`/forms/templates`, {
    signal,
    params: { creatorAddress, query },
  });
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

export async function createTemplateInstance({
  contractAddress,
  chainId,
  templateId,
  name,
  description,
}: {
  templateId: number;
  chainId: ChainId;
  contractAddress: string;
  name: string;
  description: string;
}) {
  return (
    await myAppsApi.post('/forms/templates/instance/create', {
      contractAddress,
      chainId,
      templateId,
      name,
      description,
    })
  ).data;
}

export async function listTemplateInstances(
  templateId: number,
): Promise<TemplateInstance[]> {
  return (await myAppsApi.get(`/forms/templates/${templateId}/instances`)).data;
}

export async function cloneForm({ id }: { id: number }) {
  return (await myAppsApi.post<{ id: number }>(`/forms/${id}/clone`)).data;
}

export async function deleteForm({
  id,
  signal,
}: {
  id: number;
  signal?: AbortSignal;
}) {
  return await myAppsApi.delete(`/forms/${id}`, {
    signal,
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
