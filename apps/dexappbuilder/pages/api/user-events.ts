import type { NextApiRequest, NextApiResponse } from 'next';
import { myAppsApi } from 'src/services/whitelabel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  if (req.method !== 'POST') {
    return res.status(500).json({ message: 'only post request supported' });
  }
  const refreshToken = req.cookies?.refresh_token_auth || req.cookies?.refresh_token;
  body.refreshToken = refreshToken;


  try {
    await myAppsApi.post('/user-events', body, {
      headers: {
        'authorization': `Bearer ${refreshToken}`,
        'DexKit-Api-Key': process.env.MARKETPLACE_API_KEY as string
      }
    })
    return res.status(200).json({ message: 'update success' });;
  } catch (e: any) {
    console.error('User Events API error:', e?.message || 'Unknown error', e?.response?.status);
    
    return res.status(500).json({ 
      message: 'User Events:Requirements not attended',
      error: e?.message || 'Unknown error',
      status: e?.response?.status
    });
  }
}
