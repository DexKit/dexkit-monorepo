import { getChainSlug, getProviderByChainId } from '@dexkit/core/utils/blockchain';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Asset } from '@dexkit/core/types/nft';
import { getAssetData, getAssetDexKitApi, getAssetMetadata } from '@dexkit/ui/modules/nft/services';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let asset: Asset | undefined;
  const { chainId, contractAddress, tokenId } = req.query;

  if (!chainId || !contractAddress || !tokenId) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

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
    res.status(404).json({ error: 'Asset not found' });
    return;
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
        res.json({
          ...asset,
          metadata: {
            ...metadata,
            image: assetAPI.imageUrl,
          },
        });
        return;
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

  res.json({ ...asset, metadata });
}
