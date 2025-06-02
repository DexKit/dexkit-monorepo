import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { DEXKIT_BASE_API_URL } from '../../../src/constants';

const DEXKIT_NFT_BASE_URL = `${DEXKIT_BASE_API_URL}`;
const dexkitNFTapi = axios.create({ baseURL: DEXKIT_NFT_BASE_URL, headers: { 'DexKit-Api-Key': process.env.MARKETPLACE_API_KEY as string } });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {

  const { networks, accounts } = req.query;

  try {
    const response = await dexkitNFTapi.get(`/account/nfts/${networks}/${accounts}`)
    return res.json(response.data);
  } catch (e) {
    return res.json([])
  }


}
