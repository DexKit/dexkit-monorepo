import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { DEXKIT_BASE_API_URL } from '../../../src/constants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed'
    });
  }

  try {
    const token = await getToken({ req });
    
    const { nftChainId, nftAddress, nftId } = req.body;

    if (!nftChainId || !nftAddress || !nftId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters (nftChainId, nftAddress, nftId)'
      });
    }

    if (!token) {
      if (process.env.NODE_ENV === 'development') {
        return res.status(200).json({
          success: true,
          isOwner: true,
          message: 'Development validation: assuming you are the owner'
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized'
        });
      }
    }

    try {
      const validationResponse = await axios.post(
        `${DEXKIT_BASE_API_URL}/user/validate-nft-ownership`,
        {
          nftChainId,
          nftAddress,
          nftId
        },
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );
      
      return res.status(200).json({
        success: validationResponse.data.isOwner,
        isOwner: validationResponse.data.isOwner,
        message: validationResponse.data.isOwner 
          ? 'You are the owner of this NFT' 
          : 'You are not the owner of this NFT',
        details: validationResponse.data
      });
    } catch (apiError: any) {
      if (process.env.NODE_ENV === 'development') {
        return res.status(200).json({
          success: true,
          isOwner: true,
          message: 'Development validation (API error): assuming you are the owner',
          error: apiError.message
        });
      }
      
      throw apiError;
    }

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error validating NFT ownership',
      error: error?.message || 'Unknown error',
      details: error?.response?.data
    });
  }
} 