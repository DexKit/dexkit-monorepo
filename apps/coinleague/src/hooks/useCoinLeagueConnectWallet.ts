import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export function useCoinLeagueConnectWallet() {
  const { account } = useWeb3React();
  const router = useRouter();

  const handleConnectWallet = useCallback(() => {
  }, []);

  const handleUserAvatarClick = useCallback(() => {
    if (account) {
      router.push(`/profile/${account}`);
    }
  }, [account, router]);

  return {
    handleConnectWallet,
    handleUserAvatarClick,
  };
}
