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
  }>(
    [
      LIST_DEPLOYED_CONTRACTS,
      safeOwner,
      name,
      chainId,
      sort,
      page,
      pageSize,
      safeFilter,
    ],
    async () => {
      if (!safeOwner) {
        return {
          data: [],
          total: 0,
          skip: 0,
          take: pageSize,
        };
      }

      if (instance) {
        const response = await instance.get("/forms/deploy/list", {
          params: {
            owner: safeOwner,
            name,
            chainId,
            cursor: page * pageSize,
            limit: pageSize,
          },
        });

        const data = response.data;

        if (!data || typeof data !== 'object') {
          return {
            data: [],
            total: 0,
            skip: page * pageSize,
            take: pageSize,
          };
        }

        const items = data.items || [];
        const total = data.total || data.count || items.length;

        const mappedItems = items.map((contract: any) => ({
          ...contract,
          createdAt: contract.createdAt || contract.created_at || new Date().toISOString(),
          chainId: contract.chainId || contract.chain_id || contract.chainId,
        }));

        return {
          data: mappedItems,
          total: total,
          skip: page * pageSize,
          take: pageSize,
        };
      }

      return {
        data: [],
        total: 0,
        skip: 0,
        take: pageSize,
      };
    },
    {
      enabled: !!safeOwner,
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
