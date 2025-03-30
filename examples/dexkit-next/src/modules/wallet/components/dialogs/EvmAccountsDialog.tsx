import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';
import Wallet from '@/modules/common/components/icons/Wallet';
import MagicNetworkSelect from '@/modules/common/components/MagicNetworkSelect';
import { useConnectWalletDialog } from '@/modules/common/hooks/misc';
import { getBlockExplorerUrl } from '@/modules/common/utils';
import { copyToClipboard } from '@/modules/common/utils/browser';
import { Add } from '@mui/icons-material';

import WalletIcon from '@mui/icons-material/Wallet';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAccounts } from '../../hooks';
import { Account } from '../../types';
import { WalletAccountsMenu } from '../menus/WalletAccountsMenu';
import WalletAccountsList from '../WalletAccountsList';
import EvmEditAccountDialog from './EvmEditAccountDialog';

interface Props {
  dialogProps: DialogProps;
  onAddAccount: () => void;
}

export default function EvmAccountsDialog({
  dialogProps,
  onAddAccount,
}: Props) {
  const { onClose } = dialogProps;

  const { chainId, isActive } = useWeb3React();
  const connectWalletDialog = useConnectWalletDialog();

  const { removeAccount, evmAccounts } = useAccounts({});

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const [showEvmEditAccount, setShowEvmEditAccount] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenu = useCallback((account: Account, anchorEl: HTMLElement) => {
    setAnchorEl(anchorEl);
    setSelectedAccount(account);
  }, []);

  const { account } = useWeb3React();

  const handleRemoveAccount = () => {
    setAnchorEl(null);

    if (selectedAccount) {
      removeAccount(selectedAccount);
      enqueueSnackbar(
        formatMessage({
          id: 'account.removed',
          defaultMessage: 'Account removed',
        }),
        { variant: 'success' }
      );
    }
    setSelectedAccount(undefined);
  };

  const handleEditAccount = () => {
    setShowEvmEditAccount(true);
    setAnchorEl(null);
    handleClose();
  };

  const handleCloseEvmEditAccount = () => {
    setShowEvmEditAccount(false);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleConnectWallet = () => {
    connectWalletDialog.show();
  };

  const handleCopyAddress = async () => {
    if (selectedAccount) {
      await copyToClipboard(selectedAccount.address);

      setAnchorEl(null);
      handleClose();
      enqueueSnackbar(
        formatMessage({
          id: 'address.copied',
          defaultMessage: 'Address copied',
        }),
        { variant: 'success' }
      );
    }
  };

  const handleViewOnBlockExplorer = async () => {
    if (selectedAccount) {
      window.open(
        `${getBlockExplorerUrl(chainId)}/address/${selectedAccount.address}`,
        '_blank'
      );

      setSelectedAccount(undefined);
      setAnchorEl(null);
    }
  };

  return (
    <>
      {selectedAccount && (
        <EvmEditAccountDialog
          dialogProps={{
            open: showEvmEditAccount,
            fullWidth: true,
            maxWidth: 'xs',
            onClose: handleCloseEvmEditAccount,
          }}
          account={selectedAccount}
        />
      )}

      <WalletAccountsMenu
        MenuProps={{
          open: Boolean(anchorEl),
          anchorEl: anchorEl,
          onClose: handleCloseMenu,
        }}
        onRemove={handleRemoveAccount}
        onEdit={handleEditAccount}
        onCopyAddress={handleCopyAddress}
        onViewBlockExplorer={handleViewOnBlockExplorer}
      />
      <Dialog {...dialogProps}>
        <AppDialogTitle
          title={
            isActive ? (
              <MagicNetworkSelect SelectProps={{ size: 'small' }} />
            ) : (
              <FormattedMessage id="accounts" defaultMessage="Accounts" />
            )
          }
          onClose={handleClose}
        />
        <Divider />
        <DialogContent sx={{ p: 0 }}>
          {evmAccounts.length > 0 ? (
            <Box>
              <WalletAccountsList
                activeAccount={account}
                accounts={evmAccounts}
                onMenu={handleMenu}
              />
              <Stack spacing={2} sx={{ p: 2 }}>
                <Button
                  fullWidth
                  startIcon={<Add />}
                  onClick={onAddAccount}
                  variant="outlined"
                  color="inherit"
                >
                  <FormattedMessage
                    id="add.account"
                    defaultMessage="Add account"
                  />
                </Button>
                <Button
                  fullWidth
                  startIcon={<WalletIcon />}
                  onClick={handleConnectWallet}
                  variant="outlined"
                  color="inherit"
                >
                  <FormattedMessage
                    id="connect.wallet"
                    defaultMessage="Connect wallet"
                  />
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box p={2}>
              <Stack alignItems="center" spacing={2}>
                <Wallet fontSize="large" />
                <Stack alignItems="center">
                  <Typography variant="h5">
                    <FormattedMessage
                      id="no.accounts.found"
                      defaultMessage="No accounts found"
                    />
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <FormattedMessage
                      id="add.accounts.to.your.portfolio"
                      defaultMessage="Add accounts to your portfolio"
                    />
                  </Typography>
                </Stack>
                <Button
                  fullWidth
                  startIcon={<Add />}
                  onClick={onAddAccount}
                  variant="outlined"
                  color="inherit"
                >
                  <FormattedMessage
                    id="add.account"
                    defaultMessage="Add account"
                  />
                </Button>
                <Button
                  fullWidth
                  startIcon={<WalletIcon />}
                  onClick={handleConnectWallet}
                  variant="outlined"
                  color="inherit"
                >
                  <FormattedMessage
                    id="connect.wallet"
                    defaultMessage="Connect wallet"
                  />
                </Button>
              </Stack>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
