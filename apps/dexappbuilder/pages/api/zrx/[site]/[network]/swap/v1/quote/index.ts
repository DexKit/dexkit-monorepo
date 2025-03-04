import { getApiKeyData } from '@/modules/wizard/services/integrations';
import { MY_APPS_ENDPOINT } from '@dexkit/core';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { ZEROEX_CHAIN_PREFIX } from '@dexkit/ui/modules/swap/constants';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const GET_ZRX_URL = (chainId?: number) =>
  `https://${ZEROEX_CHAIN_PREFIX(chainId)}api.0x.org`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return;
  const { network, site } = req.query;

  const controller = new AbortController();
  const signal = controller.signal;

  req.on('aborted', () => {
    controller.abort();
  });

  try {
    const apiKey = await getApiKeyData({
      type: 'zrx',
      siteId: parseInt(site as string),
      instance: axios.create({
        baseURL: MY_APPS_ENDPOINT,
        headers: {
          'DexKit-Api-Key': process.env.MARKETPLACE_API_KEY as string,
        },
      }),
    });

    const response = await axios.get(
      GET_ZRX_URL(NETWORK_FROM_SLUG(network as string)?.chainId) +
      '/swap/v1/quote',
      {
        params: req.query,
        headers: {
          '0x-api-key':
            apiKey?.value || process.env.NEXT_PUBLIC_ZRX_API_KEY || '',
        },
        signal,
      }
    );

    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(499).json(err);
  }
}
