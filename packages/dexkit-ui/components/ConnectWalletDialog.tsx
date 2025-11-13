import {
  appMetadata,
  client,
  wallets,
} from '@dexkit/wallet-connectors/thirdweb/client';
import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  lighten,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useConnectModal } from 'thirdweb/react';
import { AppDialogTitle } from './AppDialogTitle';

// Define WalletActivateParams locally based on usage patterns
export interface WalletActivateParams {
  connectorName: string;
  loginType?: string;
  email?: string;
  icon?: string;
  name?: string;
  rdns?: string;
  connectionType?: string;
}

// Wallet icons
import { EMAIL_ICON, GOOGLE_ICON, METAMASK_ICON, TWITTER_ICON } from '@dexkit/wallet-connectors/constants/icons';

interface ConnectWalletDialogProps {
  DialogProps: DialogProps;
  activate: (params: WalletActivateParams) => Promise<void>;
  activeConnectorName?: string;
  isActivating?: boolean;
  isActive?: boolean;
}

interface WalletOption {
  icon: string;
  name: string;
  connectorName: string;
  loginType?: string;
}

export default function ConnectWalletDialog({
  DialogProps,
  activate,
  activeConnectorName,
  isActivating,
  isActive,
}: ConnectWalletDialogProps) {
  const { onClose } = DialogProps;
  const { connect, isConnecting } = useConnectModal();
  const { formatMessage } = useIntl();

  const [connectorName, setConnectorName] = useState<string | undefined>();
  const [loginType, setLoginType] = useState<string | undefined>();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => {
    onClose!({}, 'backdropClick');
    setConnectorName(undefined);
    setLoginType(undefined);
    setEmail('');
    setIsProcessing(false);
  };

  const handleActivateWallet = async (
    walletConnectorName: string,
    walletLoginType?: string,
    walletEmail?: string
  ) => {
    setConnectorName(walletConnectorName);
    setLoginType(walletLoginType);
    setIsProcessing(true);

    try {
      // Use thirdweb connect modal
      const wallet = await connect({
        client,
        wallets,
        appMetadata,
        size: 'compact',
        showThirdwebBranding: false,
      });

      if (wallet) {
        // Map wallet to WalletActivateParams format
        const walletId = wallet.id;
        let mappedConnectorName = walletConnectorName;

        // Map thirdweb wallet IDs to connector names
        if (walletId === 'io.metamask') {
          mappedConnectorName = 'metamask';
        } else if (walletId === 'com.coinbase.wallet') {
          mappedConnectorName = 'coinbase';
        } else if (walletId.includes('inApp')) {
          mappedConnectorName = 'magic';
        }

        // Prepare activation parameters
        const params: WalletActivateParams = {
          connectorName: mappedConnectorName,
          name: walletId,
        };

        if (walletLoginType) {
          params.loginType = walletLoginType;
        }

        if (walletEmail) {
          params.email = walletEmail;
        }

        // Call the activate function with mapped parameters
        await activate(params);
        handleClose();
      }
    } catch (err) {
      console.error('Wallet activation error:', err);
    } finally {
      setIsProcessing(false);
      setConnectorName(undefined);
      setLoginType(undefined);
    }
  };

  const handleConnectWithEmail = () => {
    handleActivateWallet('magic', 'email', email);
    setEmail('');
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Wallet options
  const walletOptions: WalletOption[] = [
    {
      icon: METAMASK_ICON,
      name: 'MetaMask',
      connectorName: 'metamask',
    },
    {
      icon: GOOGLE_ICON,
      name: 'Google',
      connectorName: 'magic',
      loginType: 'google',
    },
    {
      icon: TWITTER_ICON,
      name: 'Twitter',
      connectorName: 'magic',
      loginType: 'twitter',
    },
  ];

  const isLoading = isActivating || isProcessing || isConnecting;
  const isConnectingSpecific = isLoading && connectorName !== undefined;

  return (
    <Dialog {...DialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="connect.your.wallet"
            defaultMessage="Connect Your Wallet"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ padding: 0 }}>
        <Box p={2}>
          <Stack spacing={2}>
            <TextField
              disabled={isLoading && connectorName === 'magic' && loginType === 'email'}
              value={email}
              onChange={handleChangeEmail}
              type="email"
              placeholder={formatMessage({
                id: 'email',
                defaultMessage: 'Email',
              })}
              fullWidth
            />
            <ListItemButton
              disabled={isLoading && connectorName === 'magic' && loginType === 'email'}
              onClick={handleConnectWithEmail}
              sx={{
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  {isLoading && connectorName === 'magic' && loginType === 'email' ? (
                    <CircularProgress
                      color="primary"
                      size={20}
                    />
                  ) : (
                    <Avatar
                      src={EMAIL_ICON}
                      sx={(theme) => ({
                        background: lighten(theme.palette.background.default, 0.05),
                        padding: theme.spacing(1),
                        width: 'auto',
                        height: theme.spacing(5),
                      })}
                      alt="Email"
                    />
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={
                <FormattedMessage
                  id="connect.with.email"
                  defaultMessage="Connect with e-mail"
                />
              } />
            </ListItemButton>
          </Stack>
        </Box>
        <Divider />
        <List disablePadding>
          {walletOptions.map((option) => {
            const isCurrentConnector =
              isLoading &&
              connectorName === option.connectorName &&
              loginType === option.loginType;

            return (
              <ListItemButton
                key={`${option.connectorName}-${option.loginType || 'default'}`}
                divider
                disabled={isLoading && !isCurrentConnector}
                onClick={() => handleActivateWallet(option.connectorName, option.loginType)}
              >
                <ListItemAvatar>
                  <Avatar>
                    {isCurrentConnector ? (
                      <CircularProgress
                        color="primary"
                        sx={{ fontSize: (theme) => theme.spacing(4) }}
                      />
                    ) : (
                      <Avatar
                        src={option.icon}
                        sx={(theme) => ({
                          background: lighten(theme.palette.background.default, 0.05),
                          padding: theme.spacing(1),
                          width: 'auto',
                          height: theme.spacing(5),
                        })}
                        alt={option.name}
                      />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={option.name} />
              </ListItemButton>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
}
