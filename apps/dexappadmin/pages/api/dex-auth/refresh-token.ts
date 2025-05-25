import { requestAccestoken } from '@dexkit/ui/services/auth';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const refreshToken = req.cookies?.refresh_token_auth || req.cookies?.refresh_token;
    const response = await requestAccestoken({ refreshToken: refreshToken as string })
    const data = (await response.data);
    return res.status(response.status).json({ access_token: data.access_token });

  } catch (e: any) {
    if (e && e?.status && e?.status === 401) {
      return res.status(401).json({ ...e })
    }


    return res.status(500).json({ error: e })
  }

}
