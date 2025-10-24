import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DEPLOYABLE_CONTRACTS_URL } from "../constants";
import { cloneForm, getForm, listForms, saveContractDeploy } from "../services";
import { ContractFormParams, DeployableContract } from "../types";
export type ContractFormData = {
  id: number;
  creatorAddress: string;
  params: ContractFormParams;
  templateId?: number;
  name?: string;
  description?: string;
};

export function useCloseFormMutation() {
  return useMutation(async ({ id }: { id: number }) => {
    return await cloneForm({ id });
  });
}

export const GET_FORM = "GET_FORM";

export function useFormQuery({ id }: { id?: number }) {
  return useQuery<ContractFormData | null>({
    queryKey: [GET_FORM, id],
    queryFn: async ({ signal }) => {
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
    enabled: id !== undefined,
  });
}

export const LIST_FORMS = "LIST_FORMS";

export function useListFormsQuery({
  creatorAddress,
  query,
}: {
  creatorAddress?: string;
  query?: string;
}) {
  return useQuery<ContractFormData[] | null>({
    queryKey: [LIST_FORMS, creatorAddress, query],
    queryFn: async ({ signal }) => {
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
          }) as ContractFormData
      );
    },
    enabled: creatorAddress !== undefined,
  });
}

export const DEPLOYABLE_CONTRACTS_QUERY = "DEPLOYABLE_CONTRACTS_QUERY";

export function useDeployableContractsQuery() {
  return useQuery({
    queryKey: [DEPLOYABLE_CONTRACTS_QUERY],
    queryFn: async () => {
      return (await axios.get<DeployableContract[]>(DEPLOYABLE_CONTRACTS_URL))
        .data;
    },
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
