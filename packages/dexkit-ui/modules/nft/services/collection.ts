import { ERC721Abi } from "@dexkit/core/constants/abis";
import { Asset } from "@dexkit/core/types/nft";
import { Interface } from "@dexkit/core/utils/ethers/abi/Interface";
import { CallInput } from "@indexed-finance/multicall";
import axios from "axios";
import { providers } from "ethers";
import { getAssetProtocol, getAssetsData, getOrderbookOrders } from ".";
import { DEXKIT_AUTHENTICATE_API_KEY } from "../../../constants";
import { dexkitNFTapi } from "../../../constants/api";
import { getMulticallFromProvider } from "../../../services/multical";
import {
  AssetAPI,
  Collection,
  CollectionAPI,
  TraderOrderFilter,
} from "../types";

export async function getApiCollectionData(
  networkId?: string,
  contractAddress?: string,
): Promise<Collection | undefined> {
  if (!networkId || !contractAddress) {
    return;
  }

  const response = await dexkitNFTapi.get<Collection>(
    `/collection/${networkId}/${contractAddress.toLowerCase()}`,
  );
  return response.data;
}

export async function getCollectionAssetsDexKitApi({
  networkId,
  contractAddress,
  traitsFilter,
  skip,
  take,
}: {
  networkId: string;
  contractAddress: string;
  traitsFilter?: string;
  skip?: number;
  take?: number;
}) {
  const resp = await dexkitNFTapi.get<{
    data: AssetAPI[];
    skip: number;
    take: number;
    total: number;
  }>(`/asset/collection/${networkId}/${contractAddress.toLowerCase()}`, {
    params: { skip, take, traits: traitsFilter },
  });
  return resp.data;
}

export async function getCollectionAssetsFromOrderbook(
  provider?: providers.JsonRpcProvider,
  filters?: TraderOrderFilter,
) {
  if (provider === undefined || filters?.nftToken === undefined) {
    return;
  }

  const orderbook = await getOrderbookOrders(filters);

  const ids = new Set<string>(
    orderbook.orders.map((order) => order.nftTokenId),
  );

  const protocol = await getAssetProtocol(provider, filters.nftToken);

  const isERC1155 = protocol === "ERC1155";
  let assets: Asset[] = [];
  const tokenIds = Array.from(ids);
  const maxItemsFetch = 25;
  const divider = Math.ceil(tokenIds.length / maxItemsFetch);
  for (let index = 0; index < divider; index++) {
    const max =
      (index + 1) * maxItemsFetch > tokenIds.length
        ? tokenIds.length
        : (index + 1) * maxItemsFetch;
    const idsToPick = tokenIds.slice(index * maxItemsFetch, max);
    const ass = await getAssetsData(
      provider,
      filters.nftToken,
      idsToPick,
      isERC1155,
    );
    if (ass) {
      assets = assets.concat(ass);
    }
  }
  return assets;
}

export async function getSyncCollectionData(
  networkId?: string,
  contractAddress?: string,
): Promise<Collection | undefined> {
  if (!networkId || !contractAddress) {
    return;
  }

  const response = await dexkitNFTapi.get<Collection>(
    `/collection/sync/${networkId}/${contractAddress.toLowerCase()}`,
    {
      headers: {
        "Dexkit-Api-Key": DEXKIT_AUTHENTICATE_API_KEY,
      },
    },
  );
  return response.data;
}

export async function getApiAccountContractCollectionData(
  account?: string,
): Promise<{ collection: CollectionAPI }[] | undefined> {
  if (!account) {
    return;
  }

  const response = await dexkitNFTapi.get<{ collection: CollectionAPI }[]>(
    `/contract/collections/account/${account.toLowerCase()}`,
  );
  return response.data;
}

export async function getApiContractCollectionData(
  networkId?: string,
  address?: string,
): Promise<{ collection: CollectionAPI; metadata: any } | undefined> {
  if (!networkId || !address) {
    return;
  }

  const response = await dexkitNFTapi.get<{
    collection: CollectionAPI;
    metadata: any;
  }>(`/contract/collection/${networkId}/${address.toLowerCase()}`);
  return response.data;
}

export async function getCollectionData(
  provider?: providers.JsonRpcProvider,
  contractAddress?: string,
): Promise<Collection | undefined> {
  if (!provider || !contractAddress) {
    return;
  }

  const multicall = await getMulticallFromProvider(provider);
  const iface = new Interface(ERC721Abi);
  let calls: CallInput[] = [];

  calls.push({
    interface: iface,
    target: contractAddress,
    function: "name",
  });

  calls.push({
    interface: iface,
    target: contractAddress,
    function: "symbol",
  });

  const response = await multicall?.multiCall(calls);
  if (response) {
    const [, results] = response;

    const name = results[0];
    const symbol = results[1];

    const { chainId } = await provider.getNetwork();

    return {
      name,
      symbol,
      address: contractAddress,
      chainId,
    };
  }
}

export async function getCollectionByApi({
  chainId,
  contractAddress,
}: {
  chainId: number;
  contractAddress: string;
}) {
  const resp = await axios.get<Collection>("/api/collection", {
    params: { chainId, contractAddress },
  });

  return resp.data;
}
