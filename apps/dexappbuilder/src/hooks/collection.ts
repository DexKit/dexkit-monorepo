import { useQuery } from '@tanstack/react-query';

import { Asset } from '@dexkit/core/types/nft';
import { EVM_CHAINS } from '@dexkit/evm-chains/constants';
import {
  getCollectionAssetsDexKitApi,
  getSyncCollectionData,
} from '@dexkit/ui/modules/nft/services/collection';
import { client } from '@dexkit/wallet-connectors/thirdweb/client';
import { defineChain, getContract, readContract } from 'thirdweb';

export const GET_ASSET_LIST_FROM_COLLECTION = 'GET_ASSET_LIST_FROM_COLLECTION';

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

export const useGetNextTokenIdToMint = ({
  address,
  network,
  enabled = true,
}: {
  address: string;
  network: string;
  enabled?: boolean;
}) => {
  return useQuery(
    ['GET_NEXT_TOKEN_ID_TO_MINT', address, network],
    () => {
      const chainId = EVM_CHAINS.find((x) => x.slug === network)?.chainId || 1;

      const contract = getContract({
        client,
        address,
        chain: defineChain(chainId),
      });
      return readContract({
        contract,
        method: 'function nextTokenIdToMint() view returns (uint256)',
        params: [],
      });
    },
    {
      enabled: enabled && !!address && !!network,
    },
  );
};

export const useResyncAssets = ({
  address,
  network,
  enabled = true,
}: {
  address: string;
  network: string;
  enabled?: boolean;
}) => {
  return useQuery(
    ['RESYNC_ASSETS', address, network],
    async () => {
      debugger;
      const response = await getSyncCollectionData(network, address, true);

      debugger;

      return response;
    },
    {
      enabled: enabled && !!address && !!network,
    },
  );
};
