import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { DEXKIT_BASE_API_URL } from '../../../src/constants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unathorized' });
    }

    const notificationsResponse = await axios.get(
      `${DEXKIT_BASE_API_URL}/user/notifications`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    return res.status(200).json(notificationsResponse.data);

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error?.message || 'Unknown error'
    });
  }
} 