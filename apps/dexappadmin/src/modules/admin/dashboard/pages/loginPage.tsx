import { useLoginAccountMutation } from '@dexkit/ui/hooks/auth';

import { useThemeMode } from '@dexkit/ui/hooks';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { client } from '@dexkit/wallet-connectors/thirdweb/client';
import { Box, Button, Container, useTheme } from '@mui/material';
import { useLogin } from 'react-admin';
import { FormattedMessage } from 'react-intl';
import {
  AutoConnect,
  darkTheme,
  lightTheme,
  useConnectModal,
} from 'thirdweb/react';

import { ConnectButton } from '@dexkit/ui/components/ConnectButton';
import { ThemeMode } from '@dexkit/ui/constants/enum';
import {
  appMetadata,
  wallets,
} from '@dexkit/wallet-connectors/thirdweb/client';

const MyLoginPage = () => {
  const { account } = useWeb3React();
  const login = useLogin();
  const loginMutation = useLoginAccountMutation();
  const { mode } = useThemeMode();
  const theme = useTheme();

  const handleLoginMutation = async () => {
    await loginMutation.mutateAsync();
    login({});
  };

  const colors = {
    modalBg: theme.palette.background.default,
    primaryButtonBg: theme.palette.action.active,
  };

  const { connect, isConnecting } = useConnectModal();

  async function handleConnect() {
    await connect({
      client,
      wallets,
      appMetadata,
      size: 'compact',
      showThirdwebBranding: false,
      theme:
        mode === ThemeMode.light
          ? lightTheme({
              colors,
            })
          : darkTheme({ colors }),
    }); // opens the connect modal
  }

  const handleConnectWallet = () => {
    handleConnect();
  };

  return (
    <Container maxWidth="xs">
      <AutoConnect
        wallets={wallets}
        client={client}
        appMetadata={appMetadata}
      />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {!account && <ConnectButton variant="contained" />}
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
