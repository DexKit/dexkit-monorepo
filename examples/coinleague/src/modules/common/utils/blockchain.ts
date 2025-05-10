import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';

import metaMaskImage from 'public/icons/metamask-fox.svg';

import { Connector } from '@web3-react/types';
import { ethers } from 'ethers';
import { ChainId } from '../constants/enums';
import { NETWORKS } from '../constants/networks';

export const getChainIdFromName = (chainName: string) => {
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
      return new ethers.providers.JsonRpcProvider(
        NETWORKS[chainId].providerRpcUrl,
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

export function getName(connector: any) {
  if (connector instanceof MetaMask) return 'MetaMask';
  if (connector instanceof WalletConnect) return 'WalletConnect';
  return 'Unknown';
}

export function getWalletIcon(connector: any) {
  if (connector instanceof MetaMask) return metaMaskImage.src;
  return undefined;
}

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

export async function switchNetwork(connector: Connector, chainId: number) {
  if (connector instanceof MetaMask) {
    return connector.provider?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  }
}

export function hasLondonHardForkSupport(chainId: number) {
  switch (chainId) {
    case ChainId.Rinkeby:
    case ChainId.Ropsten:
    case ChainId.Ethereum:
    case ChainId.Goerli:
    case ChainId.Polygon:
    case ChainId.Mumbai:
      return true;

    default:
      return false;
  }
}
