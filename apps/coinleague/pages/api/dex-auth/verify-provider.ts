import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { myAppsApi } from 'src/services/whitelabel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({ message: "You must be logged on provider." });
    return;
  }
  const refreshToken = req.cookies.refresh_token_auth;
  if (!refreshToken) {
    res.status(401).json({ message: "You must be logged on app." });
    return;
  }

  await myAppsApi.post('/user-credentials/associate-user', { ['user']: session.user }, {
    headers: {
      'Authorization': `Bearer ${refreshToken}`
    }
  })

  return res.status(200).json({ message: 'user associated with provider' });
}
