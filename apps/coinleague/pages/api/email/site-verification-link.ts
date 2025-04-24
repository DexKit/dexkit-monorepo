import type { NextApiRequest, NextApiResponse } from 'next';
import { myAppsApi } from 'src/services/whitelabel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const refreshToken = req.cookies?.refresh_token_auth || req.cookies?.refresh_token;
  const { siteId } = req.query;
  if (!refreshToken) {
    return res.status(401).json({ message: "You must be logged on app." });
  }

  try {
    const { data } = await myAppsApi.get(`/auth/send-verification-link-site/${siteId}`, {
      headers: {
        'authorization': `Bearer ${refreshToken}`,
        'DexKit-Api-Key': process.env.MARKETPLACE_API_KEY as string
      }
    })
    return res.status(200).json({});
  } catch (e) {
    return res.status(500).json({ message: 'Requirements not attended' });
  }
}
