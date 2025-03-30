import { ChainId } from '@/modules/common/constants/enums';
import { DEXKIT } from '@/modules/common/constants/tokens';
import axios from 'axios';
import { ethers } from 'ethers';
import {
  IMAGE_PATHS,
  IMAGE_PATHS_ICONS,
  KITTYGOTCHI_METADATA_ENDPOINT,
} from '../constants';

export async function signUpdate(
  provider: ethers.providers.Web3Provider,
  chainId: ChainId
) {
  const signer = provider.getSigner();

  const domain = {
    name: 'KittyGotchi',
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

  const values = {
    message: 'Update my Gotchi!',
    powered: 'Powered By DexKit',
  };

  const message = ethers.utils._TypedDataEncoder.getPayload(
    domain,
    types,
    values
  );

  const sig = await signer._signTypedData(domain, types, values);

  return { sig, message };
}

export function getKittygotchiMetadataEndpoint(
  chainId?: number,
  prefix?: string
) {
  if (
    chainId === ChainId.Polygon ||
    chainId === ChainId.BSC ||
    chainId === ChainId.Ethereum
  ) {
    if (chainId === ChainId.Polygon) {
      return `${KITTYGOTCHI_METADATA_ENDPOINT}${
        prefix ? prefix + '/' : ''
      }eth/`;
    }

    if (chainId === ChainId.BSC) {
      return `${KITTYGOTCHI_METADATA_ENDPOINT}${
        prefix ? prefix + '/' : ''
      }bsc/`;
    }

    return KITTYGOTCHI_METADATA_ENDPOINT;
  } else if (chainId === ChainId.Mumbai) {
    return MUMBAI_METADATA_KITTY_ENDPOINT;
  }
}

export const MUMBAI_METADATA_KITTY_ENDPOINT = //'http://localhost:3001/api/'
  'https://mumbai-kittygotchi.dexkit.com/api/';

export function getKittygotchiApi(chainId?: ChainId) {
  const endpoint = getKittygotchiMetadataEndpoint(chainId);
  if (endpoint) {
    return axios.create({ baseURL: endpoint });
  }
}

export enum KittygotchiTraitType {
  ACCESSORIES,
  BODY,
  CLOTHES,
  EARS,
  EYES,
  MOUTH,
  NOSE,
}

export function getImageFromTrait(
  traitType: KittygotchiTraitType,
  value?: string
) {
  let dir = '';

  switch (traitType) {
    case KittygotchiTraitType.ACCESSORIES:
      dir = 'accessories';
      break;
    case KittygotchiTraitType.BODY:
      dir = 'body';
      break;
    case KittygotchiTraitType.CLOTHES:
      dir = 'clothes';
      break;
    case KittygotchiTraitType.EARS:
      dir = 'ears';
      break;
    case KittygotchiTraitType.EYES:
      dir = 'eyes';
      break;
    case KittygotchiTraitType.MOUTH:
      dir = 'mouth';
      break;
    case KittygotchiTraitType.NOSE:
      dir = 'nose';
      break;
  }

  if (value) {
    return IMAGE_PATHS[`${dir}/${value?.toLowerCase()}.png`];
  }

  return '';
}

export function isKittygotchiNetworkSupported(chainId?: number) {
  if (chainId) {
    return (
      chainId === ChainId.Ethereum ||
      chainId === ChainId.Ropsten ||
      chainId === ChainId.Polygon ||
      chainId === ChainId.Mumbai ||
      chainId === ChainId.BSC
    );
  }

  return false;
}

export const GET_DEXKIT = (chainId?: ChainId) => {
  if (chainId) {
    if (isKittygotchiNetworkSupported(chainId)) {
      return DEXKIT[chainId];
    }
  }

  return undefined;
};

export function GET_KITTYGOTCHI_MINT_RATE(chainId?: number) {
  if (chainId) {
    if (chainId === ChainId.Ethereum) {
      return ethers.utils.parseEther('0.02');
    } else if (chainId === ChainId.Ropsten) {
      return ethers.utils.parseEther('0.0000001');
    } else if (chainId === ChainId.Polygon) {
      return ethers.utils.parseEther('10.0');
    } else if (chainId === ChainId.Mumbai) {
      return ethers.utils.parseEther('0.0000000000000001');
    } else if (chainId === ChainId.BSC) {
      return ethers.utils.parseEther('0.05');
    }
  }

  return ethers.utils.parseEther('0');
}

export function getImageFromTraitIcon(
  traitType: KittygotchiTraitType,
  value?: string
) {
  let dir = '';

  switch (traitType) {
    case KittygotchiTraitType.ACCESSORIES:
      dir = 'accessories';
      break;
    case KittygotchiTraitType.BODY:
      dir = 'body';
      break;
    case KittygotchiTraitType.CLOTHES:
      dir = 'clothes';
      break;
    case KittygotchiTraitType.EARS:
      dir = 'ears';
      break;
    case KittygotchiTraitType.EYES:
      dir = 'eyes';
      break;
    case KittygotchiTraitType.MOUTH:
      dir = 'mouth';
      break;
    case KittygotchiTraitType.NOSE:
      dir = 'nose';
      break;
  }

  if (value) {
    return IMAGE_PATHS_ICONS[`${dir}/${value?.toLowerCase()}.png`];
  }

  return '';
}
