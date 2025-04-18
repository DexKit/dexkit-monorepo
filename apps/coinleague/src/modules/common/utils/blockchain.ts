

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
