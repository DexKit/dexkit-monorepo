import type { NextApiRequest, NextApiResponse } from 'next';
import { myAppsApi } from 'src/services/whitelabel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const refreshToken = req.cookies?.refresh_token_auth || req.cookies?.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ message: "You must be logged on app." });
  }

  if (req.headers['x-vercel-ip-country'] === 'BR' && req.headers['x-vercel-ip-city'] === encodeURIComponent('Rio de Janeiro')) {

  } else {
    return res.status(401).json({ message: `You not attend requirements for airdrop: ${req.headers['x-vercel-ip-country']}: ${req.headers['x-vercel-ip-city']}` });
  }

  try {
    const { data } = await myAppsApi.post<{ txHash: string }>('/campaign/claim/1', undefined, {
      headers: {
        'authorization': `Bearer ${refreshToken}`,
        'DexKit-Api-Key': process.env.MARKETPLACE_API_KEY as string
      }
    })
    return res.status(200).json({ txHash: data.txHash });
  } catch (e) {
    return res.status(500).json({ message: 'Requirements not attended' });
  }
}
