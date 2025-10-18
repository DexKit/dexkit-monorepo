import { useAuthUserQuery } from '@dexkit/ui/hooks';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Avatar, ButtonBase } from '@mui/material';
import { useRouter } from 'next/router';

interface CoinLeagueUserAvatarProps {
  sx?: any;
  onClick?: () => void;
}

export function CoinLeagueUserAvatar({ sx, onClick }: CoinLeagueUserAvatarProps) {
  const { account } = useWeb3React();
  const router = useRouter();
  const userQuery = useAuthUserQuery();
  const user = userQuery.data;

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    // Si hay una cuenta conectada, redirigir al perfil de juego
    if (account) {
      router.push(`/profile/${account}`);
    }
  };

  return (
    <ButtonBase
      onClick={handleClick}
      sx={{
        borderRadius: "50%",
        ...sx,
      }}
    >
      <Avatar
        sx={{ height: "1.5rem", width: "1.5rem" }}
        src={user?.profileImageURL}
      />
    </ButtonBase>
  );
}
