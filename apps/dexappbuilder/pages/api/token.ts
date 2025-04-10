


import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import { getTokenMetadata } from '@dexkit/ui/services/token';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chainId, address } = req.query;

  try {
    const contractAddress = address as string;

    if (chainId && isAddress(contractAddress)) {
      return res.json(await getTokenMetadata({ chainId: chainId as unknown as number, address: contractAddress }));
    } else {
      return res.status(404).json({ error: 'chainId or address invalid' });
    }
  } catch (err) {
    return res.status(404).json({});
  }
}
