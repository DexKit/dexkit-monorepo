import { ChainId } from '@/modules/common/constants/enums';
import axios from 'axios';
import { ethers } from 'ethers';
import { PROFILE_API } from '../constants';
import { GameProfile } from '../types';
;
const profileaApi = axios.create({ baseURL: PROFILE_API });
export const signUpdate = async (provider: ethers.providers.Web3Provider, chainId: ChainId) => {
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
    message: 'Create my Profile',
    powered: 'Powered By DexKit',
  };

  const messageSigned = ethers.utils._TypedDataEncoder.getPayload(
    domain,
    types,
    message
  );
  const sig = await signer._signTypedData(domain, types, message);
  return { sig, messageSigned };
};

export const create = (
  sig: string,
  message: string,
  tokenAddress: string,
  tokenId: string,
  username: string,
  account: string,
  chainId: ChainId = ChainId.Polygon,
) => {

  const data = {
    address: account,
    message: message,
    tokenAddress: tokenAddress,
    signature: sig,
    username: username,
    tokenId: tokenId,
    chainId: chainId,
  }

  return profileaApi.post('/create', data)

};

export const createUsername = (
  sig: string,
  message: string,
  username: string,
  account: string,
  chainId: ChainId = ChainId.Polygon,
) => {
  const data = {
    address: account,
    message: message,
    signature: sig,
    username: username,
    chainId: chainId,
  }
  return profileaApi.post('/create-username', data)
};

export const remove = (sig: string, message: string, account: string) => {
  const data = {
    message: message,
    signature: sig,
  };

  return profileaApi.delete(`/${account}`, { data })

};

export const getProfile = async (address: string) => {
  return axios
    .get<GameProfile>(`${PROFILE_API}/${address}`)
    .then((response) => response.data);
};

/**
 *
 * @param addresses list of addresses
 * @returns
 */
export const getProfiles = (addresses: string[]): Promise<GameProfile[]> => {
  return axios
    .post<GameProfile[]>(`${PROFILE_API}/get-all-address`, { addresses })
    .then((response) => response.data);
};
