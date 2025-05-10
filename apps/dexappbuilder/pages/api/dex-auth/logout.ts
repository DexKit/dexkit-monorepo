import { logout } from '@dexkit/ui/services/auth';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.substring(7, authHeader.length);
  const response = await logout({ accessTk: token });
  res.setHeader('Set-Cookie', [serialize('refresh_token', '', { httpOnly: true, path: '/', }), serialize('refresh_token_auth', '', { httpOnly: true })]);
  const data = (await response.data);
  return res.status(response.status).json(data)
}
