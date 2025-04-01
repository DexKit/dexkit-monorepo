import { useMutation, useQuery } from "@tanstack/react-query";
import { cloneForm, getForm, listForms } from "../services";
import { ContractFormParams } from "../types";

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
    { enabled: id !== undefined },
  );
}

export const LIST_FORMS = "LIST_FORMS";

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
          }) as ContractFormData,
      );
    },
    { enabled: creatorAddress !== undefined },
  );
}
