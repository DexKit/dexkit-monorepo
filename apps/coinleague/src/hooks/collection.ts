import { useQuery } from '@tanstack/react-query';

import { Asset } from '@dexkit/core/types/nft';
import { getCollectionAssetsDexKitApi } from '@dexkit/ui/modules/nft/services/collection';






export const GET_ASSET_LIST_FROM_COLLECTION = 'GET_ASSET_LIST_FROM_COLLECTION';

interface Props {
  network: string,
  address: string,
  skip?: number;
  take?: number;
  traitsFilter?: string
}


export const useAssetListFromCollection = (params: Props) => {
  const { network, address, traitsFilter, skip, take } = params

  return useQuery(
    [GET_ASSET_LIST_FROM_COLLECTION, network, address, traitsFilter, skip, take],
    async () => {
      /* let traitsFilterString;
       if (traitsFilter) {
         traitsFilterString = traitsFilter.map(t => `${t.property}.${t.value}`);
         traitsFilterString = traitsFilterString.join(',')
       }*/
      const { data, total } = await getCollectionAssetsDexKitApi({ networkId: network, contractAddress: address, traitsFilter: traitsFilter, skip: skip, take })


      return {

        assets: data.map(asset => {
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
        total
      };

    }
  );
};
