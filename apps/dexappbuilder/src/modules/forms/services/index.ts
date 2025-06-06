import { ChainId } from '@dexkit/core';
import { myAppsApi } from '@dexkit/ui/constants/api';
import { TemplateInstance } from '../types';

import { saveContractDeploy } from '@dexkit/ui/modules/forms/services';

export { saveContractDeploy };

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
    {},
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
    {},
  );
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
    {},
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
    {},
  );
}

export async function getFormTemplate({
  id,
  signal,
}: {
  id: number;
  signal?: AbortSignal;
}) {
  return await myAppsApi.get(`/forms/templates/${id}`, {});
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
  return await myAppsApi.delete(`/forms/${id}`, {});
}
