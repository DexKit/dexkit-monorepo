import { ChainId } from "@dexkit/core/constants/enums";
import { DexkitApiProvider } from "@dexkit/core/providers";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { DeployedContract } from "../../wizard/types";

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
      return await instance?.post("/forms/deploy/contract/import", {
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

export const LIST_DEPLOYED_CONTRACTS = "LIST_DEPLOYED_CONTRACTS";

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
  const { account } = useWeb3React();

  const safeOwner = owner || account?.toLowerCase() || "";

  const safeFilter = filter
    ? {
      ...filter,
      owner: filter.owner || safeOwner,
    }
    : { owner: safeOwner };

  return useQuery<{
    data: DeployedContract[];
    skip?: number;
    take?: number;
    total?: number;
  }>({
    queryKey: [
      LIST_DEPLOYED_CONTRACTS,
      safeOwner,
      name,
      chainId,
      sort,
      page,
      pageSize,
      safeFilter,
    ],
    queryFn: async () => {
      if (!safeOwner) {
        return { data: [] };
      }

      if (instance) {
        return (
          await instance.get("/forms/deploy/contract/list", {
            params: {
              owner: safeOwner,
              name,
              chainId,
              skip: page * pageSize,
              take: pageSize,
              sort,
              filter: safeFilter ? JSON.stringify(safeFilter) : undefined,
            },
          })
        ).data;
      }

      return { data: [] };
    },
    enabled: !!safeOwner,
  });
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