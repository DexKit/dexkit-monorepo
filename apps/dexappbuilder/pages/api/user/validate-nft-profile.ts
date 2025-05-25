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
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userResponse = await axios.get(`${DEXKIT_BASE_API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    const user = userResponse.data;

    if (!user.nftChainId || !user.nftAddress || !user.nftId) {
      return res.status(200).json({ 
        success: true, 
        message: 'The user does not have an NFT profile configured' 
      });
    }

    const validationResponse = await axios.post(
      `${DEXKIT_BASE_API_URL}/user/validate-nft-ownership`,
      {
        nftChainId: user.nftChainId,
        nftAddress: user.nftAddress,
        nftId: user.nftId
      },
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    if (validationResponse.data.isOwner) {
      return res.status(200).json({
        success: true,
        message: 'NFT verified correctly'
      });
    }

    try {
      const updateResult = await axios.put(
        `${DEXKIT_BASE_API_URL}/user`,
        {
          nftChainId: null,
          nftAddress: null,
          nftId: null,
          profileNft: null
        },
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );
      
      try {
        await axios.post(
          `${DEXKIT_BASE_API_URL}/user/notifications`,
          {
            title: {
              en: "NFT Profile Removed",
              es: "Foto de Perfil NFT Removida"
            },
            subtitle: {
              en: "Your NFT profile picture has been removed because you no longer own the NFT.",
              es: "Tu foto de perfil NFT ha sido eliminada porque ya no eres propietario de la NFT."
            },
            metadata: {
              type: "nft_profile_removed",
              nftChainId: user.nftChainId,
              nftAddress: user.nftAddress,
              nftId: user.nftId
            }
          },
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        );
      } catch (notifError) {
      }
      
    } catch (updateError) {
    }

    return res.status(200).json({
      success: false,
      message: 'Your NFT has been removed as your profile picture because you are no longer the owner'
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error validating NFT profile',
      error: error?.message || 'Unknown error'
    });
  }
} 