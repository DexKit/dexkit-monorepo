import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export function useCoinLeagueUserAvatar() {
  const { account } = useWeb3React();
  const router = useRouter();

  const handleUserAvatarClick = useCallback(() => {
    // Si hay una cuenta conectada, redirigir al perfil de juego de Coin League
    if (account) {
      router.push(`/profile/${account}`);
    }
  }, [account, router]);

  return {
    handleUserAvatarClick,
  };
}
