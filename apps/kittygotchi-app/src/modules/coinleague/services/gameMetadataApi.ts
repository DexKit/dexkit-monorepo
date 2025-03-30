import { ChainId } from '@/modules/common/constants/enums';
import axios from 'axios';
import { ethers } from 'ethers';

import { GAME_METADATA_API } from '../constants';
import { GameMetadata } from '../types';

const gameMetadataApi = axios.create({ baseURL: GAME_METADATA_API });

export const GET_API_PREFIX = (chainId: ChainId) => {
  if (chainId === ChainId.BSC) {
    return `${ChainId.BSC}/`;
  }
  return '';
};

export const signUpdate = async (
  provider: ethers.providers.Web3Provider,
  chainId: ChainId,
) => {
  const signer = provider.getSigner();
  const domain = {
    name: 'Coinleague',
    version: '1',
    chainId: chainId,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  };

  const types = {
    Message: [
      { name: 'message', type: 'string' },
      { name: 'powered', type: 'string' },
    ],
  };
  const message = {
    message: 'Update my Game Metadata',
    powered: 'Powered By DexKit',
  };
  const messageSigned = ethers.utils._TypedDataEncoder.getPayload(
    domain,
    types,
    message,
  );

  const sig = await signer._signTypedData(domain, types, message);
  return { sig, messageSigned };
};

export const update = (
  sig: string,
  message: string,
  data: any,
  room: string,
  id: string,
  account: string,
  chainId: ChainId = ChainId.Polygon,
) => {
  return gameMetadataApi.post(`/api/${id}`, {
    owner: account,
    message: message,
    creator: account,
    signature: sig,
    room: room,
    title: data.title,
    description: data.description,
    smallDescription: data.smallDescription,
    chainId: chainId,
  });
};

export const remove = (
  sig: string,
  message: string,
  data: any,
  room: string,
  id: string,
  account: string,
  chainId: ChainId = ChainId.Polygon,
) => {
  return gameMetadataApi.delete(`/api/${id}`, {
    data: {
      owner: account,
      message: message,
      creator: account,
      signature: sig,
      room: room,
      title: data.title,
      description: data.description,
      smallDescription: data.smallDescription,
      chainId: chainId,
    },
  });
};

export const getGameMetadata = async (
  id: string,
  room: string,
  chainId: ChainId = ChainId.Polygon,
) => {
  return gameMetadataApi.get<GameMetadata>(
    `/api/${room}/${GET_API_PREFIX(chainId)}${id}`,
  );
};

export const getGamesMetadata = (
  ids: string,
  room: string,
  chainId: ChainId = ChainId.Polygon,
) => {
  return gameMetadataApi.get<GameMetadata[]>(
    `/api/${room}/all-games/${GET_API_PREFIX(chainId)}${ids}`,
  );
};

export const getAllGamesMetadata = (
  room: string,
  chainId: ChainId = ChainId.Polygon,
) => {
  return gameMetadataApi.get<GameMetadata[]>(
    `/api/${room}/${GET_API_PREFIX(chainId)}all-games`,
  );
};
