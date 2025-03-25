import { DEXKIT_BASE_API_URL } from '@/modules/common/constants';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const DEXKIT_NFT_BASE_URL = `${DEXKIT_BASE_API_URL}`;

const dexkitApiClient = axios.create({
  baseURL: DEXKIT_NFT_BASE_URL,
  headers: { 'DexKit-Api-Key': process.env.MARKETPLACE_API_KEY as string },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  const { networks, accounts } = req.query;

  try {
    const response = await dexkitApiClient.get(
      `/account/nfts/${networks}/${accounts}`
    );

    if (response.data === '') {
      return res.json([]);
    }

    return res.json(response.data);
  } catch (e) {
    return res.json([]);
  }
}
