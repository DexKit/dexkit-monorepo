import {
  Avatar,
  Box,
  Button,
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

import googleIcon from 'public/icons/google-logo.svg';
import metamaskIcon from 'public/icons/metamask-fox.svg';
import twitterIcon from 'public/icons/twitter-logo.svg';

import { FormattedMessage, useIntl } from 'react-intl';

import { useWalletActivate } from '@/modules/common/hooks/misc';
import { useWeb3React } from '@web3-react/core';
import { useSnackbar } from 'notistack';
import { MagicLoginType } from '../../connectors/magic';
import AppDialogTitle from '../AppDialogTitle';

interface Props {
  dialogProps: DialogProps;
}

interface WalletOption {
  icon: string;
  name: string;
  connectorName?: string;
}

export default function AppConnectWalletDialog({ dialogProps }: Props) {
  const { onClose } = dialogProps;

  const { connector } = useWeb3React();
  const walletActivate = useWalletActivate();

  const { formatMessage } = useIntl();

  const [connectorName, setConnectorName] = useState<string>();
  const [loginType, setLoginType] = useState<MagicLoginType>();

  const handelClose = () => {
    onClose!({}, 'backdropClick');
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleActivateWallet = async (
    connectorName: string,
    loginType?: MagicLoginType,
    email?: string
  ) => {
    setConnectorName(connectorName);
    setLoginType(loginType);

    try {
      await walletActivate.mutateAsync({ connectorName, loginType, email });
    } catch (err) {
      enqueueSnackbar(String(err), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
    }
    handelClose();
    setConnectorName(undefined);
  };

  const [email, setEmail] = useState('');

  const handleConnectWithEmail = () => {
    handleActivateWallet('magic', 'email', email);
    setEmail('');
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <Dialog {...dialogProps} onClose={handelClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="connect.your.wallet"
            defaultMessage="Connect Your Wallet"
          />
        }
        onClose={handelClose}
      />
      <Divider />
      <DialogContent sx={{ padding: 0 }}>
        <Box p={2}>
          <Stack spacing={2}>
            <TextField
              disabled={
                walletActivate.isLoading &&
                connectorName === 'magic' &&
                loginType === 'email'
              }
              value={email}
              onChange={handleChangeEmail}
              type="email"
              placeholder={formatMessage({
                id: 'email',
                defaultMessage: 'Email',
              })}
            />
            <Button
              disabled={
                walletActivate.isLoading &&
                connectorName === 'magic' &&
                loginType === 'email'
              }
              startIcon={
                walletActivate.isLoading &&
                connectorName === 'magic' &&
                loginType === 'email'
              }
              onClick={handleConnectWithEmail}
              variant="contained"
            >
              <FormattedMessage
                id="connect.with.email"
                defaultMessage="Connect with e-mail"
              />
            </Button>
          </Stack>
        </Box>
        <Divider />
        <List disablePadding>
          <ListItemButton
            divider
            disabled={walletActivate.isLoading && connectorName === 'metamask'}
            onClick={() => handleActivateWallet('metamask')}
          >
            <ListItemAvatar>
              <Avatar>
                {walletActivate.isLoading && connectorName === 'metamask' ? (
                  <CircularProgress
                    color="primary"
                    sx={{ fontSize: (theme) => theme.spacing(4) }}
                  />
                ) : (
                  <Avatar
                    src={metamaskIcon.src}
                    sx={(theme) => ({
                      background: lighten(
                        theme.palette.background.default,
                        0.05
                      ),
                      padding: theme.spacing(1),
                      width: 'auto',
                      height: theme.spacing(5),
                    })}
                    alt="Metamask"
                  />
                )}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="MetaMask" />
          </ListItemButton>
          <ListItemButton
            divider
            disabled={
              walletActivate.isLoading &&
              connectorName === 'magic' &&
              loginType === 'google'
            }
            onClick={() => handleActivateWallet('magic', 'google')}
          >
            <ListItemAvatar>
              <Avatar>
                {walletActivate.isLoading &&
                connectorName === 'magic' &&
                loginType === 'google' ? (
                  <CircularProgress
                    color="primary"
                    sx={{ fontSize: (theme) => theme.spacing(4) }}
                  />
                ) : (
                  <Avatar
                    src={googleIcon.src}
                    sx={(theme) => ({
                      background: lighten(
                        theme.palette.background.default,
                        0.05
                      ),
                      padding: theme.spacing(1),
                      width: 'auto',
                      height: theme.spacing(5),
                    })}
                    alt="Google"
                  />
                )}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Google" />
          </ListItemButton>
          <ListItemButton
            disabled={
              walletActivate.isLoading &&
              connectorName === 'magic' &&
              loginType === 'twitter'
            }
            onClick={() => handleActivateWallet('magic', 'twitter')}
          >
            <ListItemAvatar>
              <Avatar>
                {walletActivate.isLoading &&
                connectorName === 'magic' &&
                loginType === 'twitter' ? (
                  <CircularProgress
                    color="primary"
                    sx={{ fontSize: (theme) => theme.spacing(4) }}
                  />
                ) : (
                  <Avatar
                    src={twitterIcon.src}
                    sx={(theme) => ({
                      background: lighten(
                        theme.palette.background.default,
                        0.05
                      ),
                      padding: theme.spacing(1),
                      width: 'auto',
                      height: theme.spacing(5),
                    })}
                    alt="Twitter"
                  />
                )}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Twitter" />
          </ListItemButton>
        </List>
      </DialogContent>
    </Dialog>
  );
}
