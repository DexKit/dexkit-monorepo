

import { MetaMask } from '@web3-react/metamask';

import { ChainId } from '@dexkit/core/constants';

import { NETWORKS } from '@dexkit/core/constants/networks';
import { ethers } from 'ethers';


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
    if (NETWORKS[chainId].providerRpcUrl) {
      return new ethers.providers.JsonRpcProvider(
        NETWORKS[chainId].providerRpcUrl
      );
    }
  }
};

export const truncateAddress = (address: string | undefined) => {
  if (address !== undefined && ethers.utils.isAddress(address)) {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
  }
  return '';
};




export function isAddressEqual(address?: string, other?: string) {
  if (address === undefined || other === undefined) {
    return false;
  }

  if (!ethers.utils.isAddress(address) || !ethers.utils.isAddress(other)) {
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

export async function switchNetwork(connector: any, chainId: number) {
  if (connector instanceof MetaMask) {
    if (chainId === ChainId.Arbitrum) {
      return connector.provider?.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId:
            `0x${chainId.toString(16)}`,
          chainName: NETWORKS[ChainId.Arbitrum].name,
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: [NETWORKS[ChainId.Arbitrum].providerRpcUrl],
          blockExplorerUrls: [NETWORKS[ChainId.Arbitrum].explorerUrl],
        }],
      });
    }


    return connector.provider?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  }
}
