import { getProviderByChainId } from '@dexkit/core/utils/blockchain';
import { getCollectionData } from '@dexkit/ui/modules/nft/services/collection';
import { Collection } from '@dexkit/ui/modules/nft/types';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chainId, contractAddress } = req.query;

  const provider = getProviderByChainId(parseInt(chainId as string));

  const collection: Collection | undefined = await getCollectionData(
    provider,
    contractAddress as string
  );

  if (!collection) {
    return res.status(404).end();
  }

  return res.json(collection);
}
