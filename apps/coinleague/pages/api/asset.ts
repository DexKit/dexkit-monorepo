import { getChainSlug, getProviderByChainId } from '@dexkit/core/utils/blockchain';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Asset } from '@dexkit/core/types/nft';
import { getAssetData, getAssetDexKitApi, getAssetMetadata } from '@dexkit/ui/modules/nft/services';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let asset: Asset | undefined;
  const { chainId, contractAddress, tokenId } = req.query;
  try {
    const provider = getProviderByChainId(parseInt(chainId as string));

    asset = await getAssetData(
      provider,
      contractAddress as string,
      tokenId as string
    );

  } catch (e) {
    console.log(e);
  }

  if (!asset) {
    return res.status(404).end();
  }
  try {
    const assetAPI = await getAssetDexKitApi({
      networkId: getChainSlug(parseInt(chainId as string)) as string,
      contractAddress: contractAddress as string,
      tokenId: tokenId as string,
    });
    if (assetAPI) {
      if (assetAPI.rawData) {
        const metadata = JSON.parse(assetAPI.rawData);
        return res.json({
          ...asset,
          metadata: {
            ...metadata,
            image: assetAPI.imageUrl,
          },
        });
      }
    }
  } catch (e) {
    console.log(e);
    console.log('failed fetching from api');
  }

  const metadata = await getAssetMetadata(asset?.tokenURI, {
    image: '',
    name: `${asset.collectionName} #${asset.id}`,
  });

  return res.json({ ...asset, metadata });
}
