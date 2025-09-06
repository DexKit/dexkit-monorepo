import type { NextApiRequest, NextApiResponse } from 'next';
//@ts-ignore
import qrcode from 'yaqrcode';

export default async function handler(request: NextApiRequest, res: NextApiResponse) {
  const { payment } = request.query;

  if (!payment) {
    res.status(400).json({ error: 'Payment parameter is required' });
    return;
  }

  try {
    const size = 500;
    const base64 = qrcode(payment as string, {
      size,
    });

    // Return the QR code as base64 data
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(base64);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
}
