import { useAuthUserQuery } from '@/modules/user/hooks';
import { useAuth, useLoginAccountMutation } from '@dexkit/ui/hooks/auth';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

interface Props {
  onLogin?: () => void;
  allowAlwaysConnectLogin?: boolean;
  connectWalletMsg?: React.ReactNode | string;
  signMessageMsg?: React.ReactNode | string;
}

export function LoginButton({ onLogin, allowAlwaysConnectLogin }: Props) {
  const { account } = useWeb3React();
  const userQuery = useAuthUserQuery();
  const { user } = useAuth();
  const loginMutation = useLoginAccountMutation();

  const handleLogin = async () => {
    await loginMutation.mutateAsync();
    userQuery.refetch();
    if (onLogin) {
      onLogin();
    }
  };

  const isSameUserAccount = useMemo(() => {
    if (!account?.toLowerCase()) {
      return false;
    }

    if (account?.toLowerCase() === user?.address?.toLowerCase()) {
      return true;
    }
    return false;
  }, [user, account]);

  const buttonMsg = () => {
    if (loginMutation.isLoading) {
      return (
        <FormattedMessage id={'sign.message'} defaultMessage={'sign message'} />
      );
    }
    if (allowAlwaysConnectLogin) {
      return <FormattedMessage id={'login'} defaultMessage={'Login'} />;
    }

    if (isSameUserAccount) {
      return <FormattedMessage id={'logged'} defaultMessage={'Logged'} />;
    }
    return <FormattedMessage id={'login'} defaultMessage={'Login'} />;
  };

  return (
    <Button
      variant={'contained'}
      disabled={
        loginMutation.isLoading ||
        (isSameUserAccount && !allowAlwaysConnectLogin)
      }
      startIcon={loginMutation.isLoading && <CircularProgress />}
      onClick={handleLogin}
    >
      {buttonMsg()}
    </Button>
  );
}
