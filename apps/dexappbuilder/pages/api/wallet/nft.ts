import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { DEXKIT_BASE_API_URL } from '../../../src/constants';

const DEXKIT_NFT_BASE_URL = `${DEXKIT_BASE_API_URL}`;
const dexkitNFTapi = axios.create({
  baseURL: DEXKIT_NFT_BASE_URL,
  headers: { 'DexKit-Api-Key': process.env.MARKETPLACE_API_KEY as string },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> {
  const { networks, accounts } = req.query;

  try {
    const response = await dexkitNFTapi.get(
      `/account/nfts/${networks}/${accounts}`,
    );

    if (response.data && Array.isArray(response.data)) {
      const processedData = response.data.map((networkAccountAssets) => {
        if (
          networkAccountAssets &&
          Array.isArray(networkAccountAssets.assets)
        ) {
          const processedAssets = networkAccountAssets.assets.map(
            (asset: any) => {
              const dbId = asset.asset_table_id;

              let dbAssetIdValue: number | undefined = undefined;
              if (typeof dbId === 'number') {
                dbAssetIdValue = dbId;
              } else if (typeof dbId === 'string') {
                const parsed = parseInt(dbId, 10);
                if (!isNaN(parsed)) {
                  dbAssetIdValue = parsed;
                }
              }

              return {
                ...asset,
                dbAssetId: dbAssetIdValue,
                dbId: dbAssetIdValue,
                id: asset.id || asset.tokenId,
              };
            },
          );
          return {
            ...networkAccountAssets,
            assets: processedAssets,
          };
        }
        return networkAccountAssets;
      });
      return res.json(processedData);
    } else {
      return res.json(response.data || []);
    }
  } catch (e: any) {
    console.error('[API /wallet/nft] Error fetching NFTs:', e);
    const errorMessage =
      e.response?.data?.message ||
      e.message ||
      'Error fetching NFTs from backend';
    return res
      .status(e.response?.status || 500)
      .json({ message: errorMessage });
  }
}
