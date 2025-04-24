import { MY_APPS_ENDPOINT } from '@dexkit/core/constants';
import { UserEvents } from '@dexkit/core/constants/userEvents';
import { login } from '@dexkit/ui/services/auth';
import axios from 'axios';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';



const userEventsApi = axios.create({
  baseURL: MY_APPS_ENDPOINT,
  headers: { 'content-type': 'application/json' },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { address, signature, siteId, referral } = req.body.data;
    const response = await login({ address, signature, chainId: req.body.data?.chainId });
    const data = (await response.data);
    res.setHeader('Set-Cookie', [serialize('refresh_token', data.refresh_token, { httpOnly: true, path: '/', }), serialize('refresh_token_auth', data.refresh_token, { httpOnly: true })]);
    try {
      await userEventsApi.post('/user-events', { event: UserEvents.loginSignMessage, account: address, siteId, refreshToken: data.refresh_token, referral }, {
        headers: {
          'DexKit-Api-Key': process.env.MARKETPLACE_API_KEY as string
        }
      })
    } catch (e) {
      console.log(e)
    }


    return res.status(response.status).json({ access_token: data.access_token });
  }
  throw new Error('not authorized')

}
