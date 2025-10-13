import { ChainId } from '@/modules/common/constants/enums';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';

export interface CoinLeagueValidationState {
  isWalletConnected: boolean;
  isCorrectNetwork: boolean;
  canPlay: boolean;
  chainId?: number;
  account?: string;
  needsWallet: boolean;
  needsNetworkSwitch: boolean;
}

export function useCoinLeagueValidation(): CoinLeagueValidationState {
  const { account, chainId, isActive } = useWeb3React();

  const isWalletConnected = Boolean(account && isActive);
  const isCorrectNetwork = chainId === ChainId.Polygon;
  const canPlay = isWalletConnected && isCorrectNetwork;
  const needsWallet = !isWalletConnected;
  const needsNetworkSwitch = isWalletConnected && !isCorrectNetwork;

  return {
    isWalletConnected,
    isCorrectNetwork,
    canPlay,
    chainId,
    account,
    needsWallet,
    needsNetworkSwitch,
  };
}
