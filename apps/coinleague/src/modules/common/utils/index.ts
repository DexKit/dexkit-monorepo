import { ChainId } from '@/modules/common/constants/enums';
import { NETWORKS } from '@/modules/common/constants/networks';
import { providers } from 'ethers';

import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import { IPFS_GATEWAY } from '../constants';
import { Network } from '../types/networks';

export const getChainIdFromName = (chainName: string): Network | undefined => {
  const keys = Object.keys(NETWORKS).map(Number);

  let key = keys.find((key) => NETWORKS[key].slug === chainName);

  if (key !== undefined) {
    return NETWORKS[key];
  }

  return undefined;
};

export const getNetworkSlugFromChainId = (chainId?: ChainId) => {
  if (chainId) {
    return NETWORKS[chainId].slug;
  }
};

export const getProviderByChainId = (chainId?: ChainId) => {
  if (chainId) {
    if (NETWORKS[chainId].providerRpcUrl) {
      return new providers.JsonRpcProvider(
        NETWORKS[chainId].providerRpcUrl,
        chainId
      );
    }
  }
};

export const truncateAddress = (address: string | undefined) => {
  if (address !== undefined && isAddress(address)) {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
  }
  return '';
};



export function isAddressEqual(address?: string, other?: string) {
  if (address === undefined || other === undefined) {
    return false;
  }

  if (!isAddress(address) || !isAddress(other)) {
    return false;
  }

  return address.toLowerCase() === other.toLowerCase();
}

export function getBlockExplorerUrl(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId].explorerUrl;
  }
}

export function getNativeTokenSymbol(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId]?.symbol;
  }
}

export function getChainName(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId]?.name || `0x${chainId.toString(16)}`;
  }
}

export function getChainLogoImage(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId]?.imageUrl;
  }
}


export function isIpfsUrl(url: string) {
  return url.startsWith('ipfs://');
}

export function getNormalizedUrl(url: string) {
  let fetchUrl = url;

  if (isIpfsUrl(url)) {
    let path = url.substring('ipfs://'.length, url.length);
    fetchUrl = `${IPFS_GATEWAY}${path}`;
  }

  return fetchUrl;
}

export function parseChainId(chainId: string | number) {
  return typeof chainId === 'number'
    ? chainId
    : Number.parseInt(chainId, chainId.startsWith('0x') ? 16 : 10);
}
