import { ZEROEX_DEFAULT_TAKER_ADDRESS } from '@dexkit/wallet-connectors/services/zrx/constants';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const GET_ZRX_URL = `https://api.0x.org`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { routeProxy, chainId } = req.query;
  let proxiedRoute = '';
  if (routeProxy && Array.isArray(routeProxy)) {
    proxiedRoute = '/' + routeProxy.join('/');
  }

  const controller = new AbortController();
  const signal = controller.signal;

  req.on('aborted', () => {
    controller.abort();
  });

  try {
    if (req.method === 'GET') {
      const params = { ...req.query };
      if (!params.taker || params.taker === '') {
        params.taker = ZEROEX_DEFAULT_TAKER_ADDRESS;
      }

      const response = await axios.get(GET_ZRX_URL + proxiedRoute, {
        params: params,
        headers: {
          '0x-api-key':
            process.env.ZRX_API_KEY_PRO ??
            process.env.NEXT_PUBLIC_ZRX_API_KEY ??
            '',
          '0x-version': 'v2',
        },
        signal,
      });

      return res.status(200).json(response.data);
    }
    if (req.method === 'POST') {
      const response = await axios.post(GET_ZRX_URL + proxiedRoute, req.body, {
        params: req.query,
        headers: {
          '0x-api-key':
            process.env.ZRX_API_KEY_PRO ??
            process.env.NEXT_PUBLIC_ZRX_API_KEY ??
            '',
          '0x-version': 'v2',
        },
        signal,
      });

      return res.status(200).json(response.data);
    }
  } catch (err: any) {
    return res.status(err.response?.status).json(err.response?.data);
  }
  return res.status(500).json({ message: 'method not supported' });
}
