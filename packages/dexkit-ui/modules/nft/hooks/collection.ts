import { useAppConfig } from "../../../hooks";

import { useQuery } from "@tanstack/react-query";
import {
  getApiAccountContractCollectionData,
  getApiContractCollectionData,
  getCollectionAssetsDexKitApi,
  getCollectionAssetsFromOrderbook,
} from "../services/collection";

import { ChainId } from "@dexkit/core/constants/enums";
import { Asset } from "@dexkit/core/types/nft";
import { omitNull } from "@dexkit/core/utils";
import {
  getNetworkSlugFromChainId,
  isAddressEqual,
} from "@dexkit/core/utils/blockchain";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { ThirdwebSDK } from "@thirdweb-dev/react";
import { THIRDWEB_CLIENT_ID } from "../../../constants/thirdweb";
import { hexToString } from "../../../utils";
import { NFTType } from "../constants/enum";

import {
  getApiCollectionData,
  getCollectionData,
} from "../services/collection";
import { TraderOrderFilter } from "../types";
import { CollectionStatsRari } from "../types/rarible";

export function useCollections() {
  const appConfig = useAppConfig();
  return appConfig?.collections;
}

export const GET_ASSET_LIST_FROM_COLLECTION = "GET_ASSET_LIST_FROM_COLLECTION";

interface Props {
  network: string;
  address: string;
  skip?: number;
  take?: number;
  traitsFilter?: string;
}

export const useAssetListFromCollection = (params: Props) => {
  const { network, address, traitsFilter, skip, take } = params;

  return useQuery(
    [
      GET_ASSET_LIST_FROM_COLLECTION,
      network,
      address,
      traitsFilter,
      skip,
      take,
    ],
    async () => {
      /* let traitsFilterString;
       if (traitsFilter) {
         traitsFilterString = traitsFilter.map(t => `${t.property}.${t.value}`);
         traitsFilterString = traitsFilterString.join(',')
       }*/
      const { data, total } = await getCollectionAssetsDexKitApi({
        networkId: network,
        contractAddress: address,
        traitsFilter: traitsFilter,
        skip: skip,
        take,
      });

      return {
        assets: data.map((asset) => {
          let metadata: any = {};
          if (asset.rawData) {
            metadata = JSON.parse(asset.rawData);
          }
          if (asset.imageUrl) {
            metadata.image = asset.imageUrl;
          }
          return {
            contractAddress: asset.address,
            id: String(asset.tokenId),
            chainId: asset.chainId,
            tokenURI: asset.tokenURI,
            collectionName: asset.collectionName,
            symbol: asset.symbol,
            metadata,
          };
        }) as Asset[],
        skip,
        take,
        total,
      };
    },
  );
};

export const GET_COLLECTION_STATS = "GET_COLLECTION_STATS";

interface CollectionStatsProps {
  network?: string;
  address?: string;
}

export const useCollectionStats = (params: CollectionStatsProps) => {
  const { network, address } = params;

  return useQuery<CollectionStatsRari | undefined>(
    [GET_COLLECTION_STATS, network, address],
    async () => {
      return undefined;
    },
    { enabled: false },
  );
};

export const GET_COLLECTION_DATA = "GET_COLLECTION_DATA";

export function useCollection(
  contractAddress?: string,
  chainId?: ChainId,
  lazy?: boolean,
) {
  const { provider, chainId: chainProvider } = useWeb3React();
  const appConfig = useAppConfig();

  return useQuery(
    [GET_COLLECTION_DATA, contractAddress, chainId],
    async () => {
      if (chainId === undefined || contractAddress === undefined) {
        return;
      }

      const sdk = new ThirdwebSDK(chainId, { clientId: THIRDWEB_CLIENT_ID });

      const twContract = await sdk.getContract(contractAddress as string);

      const isTw = twContract.abi.find((m) => m.name === "contractVersion");

      let collectionFromConfig: any = {};
      let collectionObj: any = {};

      collectionFromConfig = appConfig.collections?.find(
        (c) =>
          isAddressEqual(c.contractAddress, contractAddress) &&
          c.chainId === chainId,
      );

      if (isTw) {
        let contract = await sdk.getContract(contractAddress);
        let metadata = await contract.metadata.get();

        const contractType: string = hexToString(
          await twContract.call("contractType"),
        );

        let type = contractType?.toLowerCase()?.startsWith("edition")
          ? NFTType.ERC1155
          : NFTType.ERC721;

        collectionObj = {
          address: contractAddress,
          chainId,
          name: metadata.name,
          symbol: metadata.symbol,
          description: metadata.description,
          imageUrl: metadata.image,
          nftType: type?.toLowerCase()?.startsWith("edition")
            ? NFTType.ERC1155
            : NFTType.ERC721,
        };
      }

      const collection = await getApiCollectionData(
        getNetworkSlugFromChainId(chainId),
        contractAddress,
      );

      if (collection) {
        return {
          ...omitNull(collectionObj),
          ...omitNull(collection),
          ...omitNull(collectionFromConfig),
        };
      }

      if (
        chainId === undefined ||
        provider === undefined ||
        contractAddress === undefined ||
        chainProvider === undefined
      ) {
        return;
      }

      const onChainCollection = await getCollectionData(
        provider,
        contractAddress,
      );

      return {
        ...omitNull(collectionObj),
        ...omitNull(onChainCollection),
        ...omitNull(collectionFromConfig),
      };
    },
    {
      enabled:
        (provider !== undefined && chainId === chainProvider) || Boolean(lazy),
      refetchOnMount: Boolean(lazy),
      refetchOnWindowFocus: Boolean(lazy),
    },
  );
}

export const COLLECTION_ASSETS_FROM_ORDERBOOK =
  "COLLECTION_ASSETS_FROM_ORDERBOOK";

export function useCollectionAssetsFromOrderbook(
  filters: TraderOrderFilter,
  networkChainId?: ChainId,
) {
  const { provider, chainId: injectedChainId } = useWeb3React();
  const chainId = networkChainId || injectedChainId;

  const isProviderEnabled =
    provider !== undefined &&
    chainId !== undefined &&
    chainId === filters.chainId;

  return useQuery(
    [COLLECTION_ASSETS_FROM_ORDERBOOK, filters],
    () => {
      if (provider === undefined) {
        return;
      }

      return getCollectionAssetsFromOrderbook(provider, filters);
    },
    { enabled: isProviderEnabled },
  );
}

export const GET_ACCOUNT_CONTRACT_COLLECTION_DATA =
  "GET_ACCOUNT_CONTRACT_COLLECTION_DATA";

export function useAccountContractCollection(account?: string) {
  return useQuery([GET_COLLECTION_DATA, account], async () => {
    if (account === undefined) {
      return;
    }
    const contractData = await getApiAccountContractCollectionData(account);
    if (contractData) {
      return contractData;
    }
  });
}

export const GET_CONTRACT_COLLECTION_DATA = "GET_CONTRACT_COLLECTION_DATA";

export function useContractCollection(networkId?: string, address?: string) {
  return useQuery(
    [GET_CONTRACT_COLLECTION_DATA, address?.toLowerCase(), networkId],
    async () => {
      if (!networkId || address === undefined) {
        return;
      }
      const contractData = await getApiContractCollectionData(
        networkId,
        address,
      );
      if (contractData) {
        return contractData;
      }
    },
  );
}
