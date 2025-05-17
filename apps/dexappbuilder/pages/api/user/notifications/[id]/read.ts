import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { DEXKIT_BASE_API_URL } from '../../../../../src/constants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const token = await getToken({ req });
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid notification ID' });
    }

    await axios.post(
      `${DEXKIT_BASE_API_URL}/user/notifications/${id}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    return res.status(200).json({ success: true, message: 'Notification marked as read' });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error?.message || 'Unknown error'
    });
  }
} 