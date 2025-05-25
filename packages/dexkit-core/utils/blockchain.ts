



import { ChainId } from '@dexkit/core/constants';

import { NETWORKS } from '@dexkit/core/constants/networks';
import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import { client } from '@dexkit/wallet-connectors/thirdweb/client';
import { ethers5Adapter } from 'thirdweb/adapters/ethers5';
import { defineChain } from 'thirdweb/chains';


export const getNetworks = ({ includeTestnet }: { includeTestnet: boolean }) => {

  if (includeTestnet) {
    return Object.values(NETWORKS);
  } else {
    return Object.values(NETWORKS).filter(n => !n.testnet);
  }

};


export const getChainIdFromSlug = (chainName?: string) => {
  if (!chainName) {
    return
  }

  const keys = Object.keys(NETWORKS).map(Number);

  let key = keys.find((key) => NETWORKS[key].slug === chainName);

  if (key !== undefined) {
    return NETWORKS[key];
  }

  return undefined;
};

export const getNetworkFromSlug = (chainName?: string) => {
  if (!chainName) {
    return
  }

  const keys = Object.keys(NETWORKS).map(Number);

  let key = keys.find((key) => NETWORKS[key].slug === chainName);

  if (key !== undefined) {
    return NETWORKS[key];
  }

  return undefined;
};

export const getNetworkFromName = (chainName: string) => {
  const keys = Object.keys(NETWORKS).map(Number);

  let key = keys.find((key) => NETWORKS[key].name.toLowerCase() === chainName?.toLowerCase());

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
    return ethers5Adapter.provider.toEthers({
      client,
      chain: defineChain(chainId),
    })
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

export function getNativeCurrencySymbol(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId]?.coinSymbol || NETWORKS[chainId]?.symbol;
  }
}

export function getNativeCurrencyName(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId]?.coinName || NETWORKS[chainId]?.name;
  }
}

export function getNativeCurrencyImage(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId]?.coinImageUrl || NETWORKS[chainId]?.imageUrl;
  }
}

export function getChainName(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId]?.name || `0x${chainId.toString(16)}`;
  }
}

export function getChainSlug(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId]?.slug;
  }
}

export function getChainSymbol(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId]?.symbol;
  }
}


export function getChainLogoImage(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId]?.imageUrl;
  }
}

