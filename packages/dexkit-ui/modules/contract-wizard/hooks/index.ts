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
        const params: any = {
          owner: safeOwner,
          name,
          chainId,
          cursor: page * pageSize,
          limit: pageSize,
        };

        if (safeFilter.hide !== undefined) {
          params.hide = safeFilter.hide;
        }

        const [dataResponse, countResponse] = await Promise.all([
          instance.get("/forms/deploy/list", { params }),
          instance.get("/forms/deploy/list", {
            params: {
              ...params,
              cursor: 0,
              limit: 10000,
              hide: safeFilter.hide
            }
          })
        ]);

        const data = dataResponse.data;
        const countData = countResponse.data;

        if (!data || typeof data !== 'object') {
          return {
            data: [],
            total: 0,
            skip: page * pageSize,
            take: pageSize,
          };
        }

        const items = data.items || [];

        let filteredItems = items;
        let filteredCountItems = countData?.items || [];

        if (safeFilter.hide !== undefined) {
          filteredItems = items.filter((contract: any) => {
            if (safeFilter.hide === false) {
              return contract.hide !== true;
            } else if (safeFilter.hide === true) {
              return contract.hide === true;
            }
            return true;
          });

          filteredCountItems = (countData?.items || []).filter((contract: any) => {
            if (safeFilter.hide === false) {
              return contract.hide !== true;
            } else if (safeFilter.hide === true) {
              return contract.hide === true;
            }
            return true;
          });
        }

        const total = safeFilter.hide !== undefined
          ? filteredCountItems.length
          : countData?.total || countData?.count || (countData?.items?.length || 0) || data.total || data.count || 0;

        const mappedItems = filteredItems.map((contract: any) => ({
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
