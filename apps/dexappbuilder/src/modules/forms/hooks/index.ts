import { ChainId } from '@dexkit/core';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { ContractFormData } from '@dexkit/ui/modules/forms/hooks';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { ContractFormParams } from '@dexkit/web3forms/types';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ContractFactory } from 'ethers';
import { useContext } from 'react';
import { DEPLOYABLE_CONTRACTS_URL } from '../constants';
import {
  cloneForm,
  createForm,
  createFormTemplate,
  createTemplateInstance,
  deleteForm,
  getForm,
  getFormTemplate,
  listFormTemplates,
  listForms,
  listTemplateInstances,
  saveContractDeploy,
  updateForm,
  updateFormTemplate,
} from '../services';
import { DeployableContract, DeployedContract, FormTemplate } from '../types';

export function useCreateFormMutation({ templateId }: { templateId?: number }) {
  return useMutation(
    async (params: {
      creatorAddress: string;
      params: ContractFormParams;
      name: string;
      description: string;
    }) => {
      let data = (
        await createForm({
          name: params.name,
          description: params.description,
          creatorAddress: params.creatorAddress,
          params: JSON.stringify(params.params),
          templateId,
        })
      ).data;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        creatorAddress: data.creatorAddress,
        params: JSON.parse(data.rawData),
        templateId: data.template?.id,
      } as ContractFormData;
    }
  );
}

export function useUpdateFormMutation() {
  return useMutation(
    async (params: {
      id: number;
      name: string;
      description: string;
      params: ContractFormParams;
    }) => {
      return await updateForm({
        id: params.id,
        name: params.name,
        description: params.description,
        params: JSON.stringify(params.params),
      });
    }
  );
}

export const GET_FORM = 'GET_FORM';

export function useFormQuery({ id }: { id?: number }) {
  return useQuery<ContractFormData | null>(
    [GET_FORM, id],
    async ({ signal }) => {
      if (!id) {
        return null;
      }

      const data = (await getForm({ id, signal })).data;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        creatorAddress: data.creatorAddress,
        params: JSON.parse(data.rawData),
        templateId: data.template?.id,
      } as ContractFormData;
    },
    { enabled: id !== undefined }
  );
}

export function useCreateFormTemplateMutation() {
  return useMutation(
    async (params: {
      abi: string;
      name: string;
      description: string;
      bytecode: string;
    }) => {
      return (
        await createFormTemplate({
          abi: params.abi,
          bytecode: params.bytecode,
          description: params.description,
          name: params.name,
        })
      ).data;
    }
  );
}

export function useUpdateFormTemplateMutation() {
  return useMutation(
    async (params: {
      id: number;
      abi: string;
      name: string;
      description: string;
      bytecode: string;
    }) => {
      return (
        await updateFormTemplate({
          id: params.id,
          abi: params.abi,
          bytecode: params.bytecode,
          description: params.description,
          name: params.name,
        })
      ).data;
    }
  );
}

export const GET_FORM_TEMPLATE_QUERY = 'GET_FORM_TEMPLATE_QUERY';

export function useFormTemplateQuery({ id }: { id?: number }) {
  return useQuery<FormTemplate | null>(
    [GET_FORM_TEMPLATE_QUERY, id],
    async ({ signal }) => {
      if (!id) {
        return null;
      }

      const data = (await getFormTemplate({ id, signal })).data;

      return {
        id: data.id,
        creatorAddress: data.creatorAddress,
        abi: JSON.parse(data.abi),
        bytecode: data.bytecode,
        description: data.description,
        name: data.name,
      } as FormTemplate;
    },
    { enabled: id !== undefined, refetchOnWindowFocus: false }
  );
}

export const LIST_FORMS = 'LIST_FORMS';

export function useListFormsQuery({
  creatorAddress,
  query,
}: {
  creatorAddress?: string;
  query?: string;
}) {
  return useQuery<ContractFormData[] | null>(
    [LIST_FORMS, creatorAddress, query],
    async ({ signal }) => {
      if (!creatorAddress) {
        return null;
      }

      const data = (
        await listForms({ creatorAddress: creatorAddress, signal, query })
      ).data;

      return data.map(
        (form: any) =>
          ({
            id: form.id,
            name: form.name,
            description: form.description,
            creatorAddress: form.creatorAddress,
            params: JSON.parse(form.rawData),
            templateId: form.template?.id,
          } as ContractFormData)
      );
    }
  );
}

export const LIST_FORM_TEMPLATES = 'LIST_FORM_TEMPLATES';

export function useListFormTemplatesQuery({
  creatorAddress,
  query,
}: {
  creatorAddress?: string;
  query?: string;
}) {
  return useQuery<FormTemplate[] | null>(
    [LIST_FORM_TEMPLATES, creatorAddress, query],
    async ({ signal }) => {
      if (!creatorAddress) {
        return null;
      }

      const data = (
        await listFormTemplates({
          creatorAddress: creatorAddress,
          signal,
          query,
        })
      ).data;

      return data.map(
        (template: any) =>
          ({
            id: template.id,
            creatorAddress: template.creatorAddress,
            abi: JSON.parse(template.abi),
            bytecode: template.bytecode,
            description: template.description,
            name: template.name,
          } as FormTemplate)
      );
    },
    { enabled: creatorAddress !== undefined }
  );
}

export interface UseDeployContractParam {
  args: any[];
}

export function useDeployContractMutation({
  abi,
  bytecode,
}: {
  abi: any[];
  bytecode: string;
}) {
  return useMutation(async (params: UseDeployContractParam) => {
    const contractFactory = new ContractFactory(abi, bytecode);

    const contract = await contractFactory.deploy(params.args);

    return contract;
  });
}

export function useSaveInstanceMutation() {
  return useMutation(
    async (params: {
      templateId: number;
      chainId: ChainId;
      contractAddress: string;
      name: string;
      description: string;
    }) => {
      return await createTemplateInstance(params);
    }
  );
}

const LIST_INSTANCES_QUERY = 'LIST_INSTANCES_QUERY';

export function useListTemplateInstances({
  templateId,
}: {
  templateId?: number;
}) {
  return useQuery(
    [LIST_INSTANCES_QUERY, templateId],
    async () => {
      if (!templateId) {
        return null;
      }

      return await listTemplateInstances(templateId);
    },
    { enabled: templateId !== undefined }
  );
}

export function useCloseFormMutation() {
  return useMutation(async ({ id }: { id: number }) => {
    return await cloneForm({ id });
  });
}

export function useDeleteFormMutation() {
  return useMutation(async ({ id }: { id: number }) => {
    return await deleteForm({ id });
  });
}

export function useSaveContractDeployed() {
  const { account } = useWeb3React();

  return useMutation(
    async ({
      contractAddress,
      name,
      chainId,
      type,
      metadata,
      createdAtTx,
      referral,
    }: {
      contractAddress: string;
      name?: string;
      type?: string;
      chainId: number;
      createdAtTx?: string;
      referral?: string;
      metadata?: {
        name?: string;
        description?: string;
        symbol?: string;
        image?: string;
      };
    }) => {
      return await saveContractDeploy({
        contractAddress,
        name,
        chainId,
        type,
        metadata,
        owner: account?.toLowerCase(),
        createdAtTx,
        referral,
      });
    }
  );
}

export function useImportContract() {
  const { account } = useWeb3React();

  const { instance } = useContext(DexkitApiProvider);

  return useMutation(
    async ({
      contractAddress,
      name,
      chainId,
      type,
      referral,
    }: {
      contractAddress: string;
      name?: string;
      type?: string;
      chainId: number;
      referral?: string;
    }) => {
      return await instance?.post('/forms/deploy/contract/import', {
        contractAddress,
        name,
        chainId,
        type,
        owner: account?.toLowerCase(),
        referral,
      });
    }
  );
}

export const INFINITE_LIST_DEPLOYED_CONTRACTS =
  'INFINITE_LIST_DEPLOYED_CONTRACTS';

export function useInfiniteListDeployedContracts({
  page = 1,
  owner,
  name,
  chainId,
}: {
  page?: number;
  owner: string;
  name?: string;
  chainId?: ChainId;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useInfiniteQuery<{
    items: {
      name: string;
      contractAddress: string;
      owner: string;
      id: number;
      type?: string;
      chainId?: number;
    }[];
    nextCursor?: number;
  }>(
    [INFINITE_LIST_DEPLOYED_CONTRACTS, page, owner, name, chainId],
    async ({ pageParam }) => {
      if (instance) {
        return (
          await instance.get<{
            items: {
              name: string;
              contractAddress: string;
              owner: string;
              id: number;
              type?: string;
              chainId?: number;
            }[];
            nextCursor?: number;
          }>('/forms/deploy/list', {
            params: { cursor: pageParam, limit: 20, owner, name, chainId },
          })
        ).data;
      }

      return { items: [], nextCursor: undefined };
    },
    {
      getNextPageParam: ({ nextCursor }) => nextCursor,
    }
  );
}

export const LIST_DEPLOYED_CONTRACTS = 'LIST_DEPLOYED_CONTRACTS';

export function useListDeployedContracts({
  page = 0,
  pageSize = 10,
  owner,
  name,
  chainId,
  sort,
  filter,
}: {
  page?: number;
  pageSize?: number;
  owner?: string;
  name?: string;
  chainId?: ChainId;
  sort?: string[];
  filter?: any;
}) {
  const { instance } = useContext(DexkitApiProvider);
  return useQuery<{
    data: DeployedContract[];
    skip?: number;
    take?: number;
    total?: number;
  }>(
    [
      LIST_DEPLOYED_CONTRACTS,
      owner,
      name,
      chainId,
      sort,
      page,
      pageSize,
      filter,
    ],
    async () => {
      if (instance) {
        return (
          await instance.get<{
            data: {
              name: string;
              contractAddress: string;
              owner: string;
              id: number;
              type?: string;
              chainId?: number;
            }[];
            skip?: number;
            take?: number;
            total?: number;
          }>('/forms/deploy/contract/list', {
            params: {
              owner,
              name,
              chainId,
              skip: page * pageSize,
              take: pageSize,
              sort,
              filter: filter ? JSON.stringify(filter) : undefined,
            },
          })
        ).data;
      }

      return { data: [] };
    }
  );
}

export function useContractVisibility() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(
    async ({ visibility, id }: { id: number; visibility: boolean }) => {
      return (
        await instance?.post(`/forms/deploy/contract/${id}/visibility`, {
          visibility,
        })
      )?.data;
    }
  );
}

export const DEPLOYABLE_CONTRACTS_QUERY = 'DEPLOYABLE_CONTRACTS_QUERY';

export function useDeployableContractsQuery() {
  return useQuery([DEPLOYABLE_CONTRACTS_QUERY], async ({}) => {
    return (await axios.get<DeployableContract[]>(DEPLOYABLE_CONTRACTS_URL))
      .data;
  });
}
