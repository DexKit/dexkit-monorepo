import ConnectWalletDialog from '@dexkit/ui/components/ConnectWallet/ConnectWalletDialog';
import { useLoginAccountMutation } from '@dexkit/ui/hooks/auth';
import { useWalletActivate } from '@dexkit/wallet-connectors/hooks';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';

import { Box, Button, Container } from '@mui/material';
import { useLogin } from 'react-admin';
import { FormattedMessage } from 'react-intl';

import { useConnectWalletDialog } from 'src/hooks/app';
import { selectedWalletAtom } from 'src/state/atoms';

const MyLoginPage = () => {
  const { account } = useWeb3React();
  const login = useLogin();
  const loginMutation = useLoginAccountMutation();
  const connectWalletDialog = useConnectWalletDialog();
  const walletActivate = useWalletActivate({
    magicRedirectUrl:
      typeof window !== 'undefined'
        ? window.location.href
        : process.env.NEXT_PUBLIC_MAGIC_REDIRECT_URL || '',
    selectedWalletAtom,
  });
  const { isActive } = useWeb3React();

  const handleLoginMutation = async () => {
    await loginMutation.mutateAsync();
    login({});
  };

  const handleCloseConnectWalletDialog = () => {
    connectWalletDialog.setOpen(false);
  };

  const handleConnectWallet = () => {
    connectWalletDialog.setOpen(true);
  };

  return (
    <Container maxWidth="xs">
      <ConnectWalletDialog
        DialogProps={{
          open: connectWalletDialog.isOpen,
          onClose: handleCloseConnectWalletDialog,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        isActive={isActive}
        isActivating={walletActivate.mutation.isLoading}
        activeConnectorName={walletActivate.connectorName}
      />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {!account && (
          <Button variant={'contained'} onClick={handleConnectWallet}>
            <FormattedMessage
              defaultMessage={'Connect Wallet'}
              id={'connect.wallet'}
            ></FormattedMessage>
          </Button>
        )}
        {account && (
          <Button variant={'contained'} onClick={handleLoginMutation}>
            <FormattedMessage
              defaultMessage={'Login'}
              id={'login'}
            ></FormattedMessage>
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default MyLoginPage;
