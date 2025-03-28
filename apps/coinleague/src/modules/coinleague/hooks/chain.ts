import { ChainId } from '@/modules/common/constants/enums';
import { NETWORKS } from '@/modules/common/constants/networks';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { GET_LEAGUES_CHAIN_ID } from '../constants';

export const useLeaguesChainInfo = () => {
  const { chainId: walletChainId } = useWeb3React();
  const router = useRouter();
  const chainFromSearch =
    router.query?.network === NETWORKS[ChainId.Polygon].name.toLowerCase()
      ? ChainId.Polygon
      : router.query?.network === NETWORKS[ChainId.BSC].name.toLowerCase()
      ? ChainId.BSC
      : null;
  const chainId = GET_LEAGUES_CHAIN_ID(chainFromSearch || walletChainId);

  const coinSymbol = NETWORKS[chainId].symbol;

  return {
    coinSymbol,
    chainId: chainId,
    chainFromSearchName: NETWORKS[ChainId.Polygon].name,
  };
};
