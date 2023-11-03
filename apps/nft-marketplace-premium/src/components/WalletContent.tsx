import { GET_WALLET_ICON, useEvmNativeBalanceQuery } from '@dexkit/core';
import {
  copyToClipboard,
  formatBigNumber,
  getChainName,
  truncateAddress,
} from '@dexkit/core/utils';
import {
  useAuthUserQuery,
  useConnectWalletDialog,
  useEvmCoins,
  useLogoutAccountMutation,
} from '@dexkit/ui';
import CopyIconButton from '@dexkit/ui/components/CopyIconButton';
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isBalancesVisibleAtom } from 'src/state/atoms';

import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import dynamic from 'next/dynamic';

import FileCopy from '@mui/icons-material/FileCopy';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Logout from '@mui/icons-material/Logout';
import Send from '@mui/icons-material/Send';
import SwitchAccount from '@mui/icons-material/SwitchAccount';
import { getChainLogoImage, getChainSymbol } from 'src/utils/blockchain';

const EvmReceiveDialog = dynamic(
  () => import('@dexkit/ui/components/dialogs/EvmReceiveDialog'),
);

const EvmTransferCoinDialog = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog'
    ),
);

const SelectNetworkDialog = dynamic(
  () => import('./dialogs/SelectNetworkDialog'),
);

export default function WalletContent() {
  const router = useRouter();
  const { connector, account, ENSName, provider, chainId } = useWeb3React();
  const logoutMutation = useLogoutAccountMutation();
  const userQuery = useAuthUserQuery();
  const user = userQuery.data;
  const connectWalletDialog = useConnectWalletDialog();
  const handleSwitchWallet = () => {
    connectWalletDialog.setOpen(true);
  };

  const isBalancesVisible = useAtomValue(isBalancesVisibleAtom);

  const handleLogoutWallet = useCallback(() => {
    logoutMutation.mutate();
    if (connector?.deactivate) {
      connector.deactivate();
    } else {
      if (connector?.resetState) {
        connector?.resetState();
      }
    }
  }, [connector]);

  const { data: balance } = useEvmNativeBalanceQuery({ provider, account });

  const formattedBalance = useMemo(() => {
    if (balance) {
      return formatBigNumber(balance);
    }

    return '0.00';
  }, [balance]);

  const handleCopy = () => {
    if (account) {
      copyToClipboard(account);
    }
  };

  const { formatMessage } = useIntl();

  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

  const evmCoins = useEvmCoins({ defaultChainId: chainId });

  const handleOpenReceive = () => {
    setIsReceiveOpen(true);
  };

  const handleCloseReceive = () => {
    setIsReceiveOpen(false);
  };

  const [isSendOpen, setIsSendOpen] = useState(false);

  const handleOpenSend = () => {
    setIsSendOpen(true);
  };

  const handleCloseSend = () => {
    setIsSendOpen(false);
  };

  const [isOpen, setOpen] = useState(false);

  const handleSwitchNetwork = () => {
    setOpen(true);
  };

  const handleSwitchNetworkClose = () => {
    setOpen(false);
  };

  return (
    <>
      {isOpen && (
        <SelectNetworkDialog
          dialogProps={{
            maxWidth: 'sm',
            open: isOpen,
            fullWidth: true,
            onClose: handleSwitchNetworkClose,
          }}
        />
      )}

      {isSendOpen && (
        <EvmTransferCoinDialog
          dialogProps={{
            open: isSendOpen,
            onClose: handleCloseSend,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          params={{
            ENSName,
            account: account,
            chainId: chainId,
            provider: provider,
            coins: evmCoins,
          }}
        />
      )}

      {isReceiveOpen && (
        <EvmReceiveDialog
          dialogProps={{
            open: isReceiveOpen,
            onClose: handleCloseReceive,
            maxWidth: 'sm',
            fullWidth: true,
          }}
          receiver={account}
          chainId={chainId}
          coins={evmCoins}
        />
      )}

      <Box sx={{ px: 1, py: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                src={GET_WALLET_ICON(connector)}
                sx={(theme) => ({
                  width: theme.spacing(4),
                  height: theme.spacing(4),
                  background: theme.palette.action.hover,
                })}
                variant="rounded"
              />
              <Box>
                <Typography variant="caption" align="left" component="div">
                  {isBalancesVisible
                    ? ENSName
                      ? ENSName
                      : truncateAddress(account)
                    : '**********'}{' '}
                  <CopyIconButton
                    iconButtonProps={{
                      onClick: handleCopy,
                      size: 'small',
                    }}
                    tooltip={formatMessage({
                      id: 'copy',
                      defaultMessage: 'Copy',
                      description: 'Copy text',
                    })}
                    activeTooltip={formatMessage({
                      id: 'copied',
                      defaultMessage: 'Copied!',
                      description: 'Copied text',
                    })}
                  >
                    <FileCopy fontSize="inherit" color="inherit" />
                  </CopyIconButton>
                </Typography>
                <div>
                  <Typography
                    color="text.secondary"
                    variant="caption"
                    align="left"
                    component="div"
                  >
                    {isBalancesVisible ? formattedBalance : '*.**'}{' '}
                    {getChainSymbol(chainId)}
                  </Typography>
                </div>
              </Box>
            </Stack>
            <IconButton onClick={handleLogoutWallet}>
              <Logout fontSize="small" />
            </IconButton>
          </Stack>
          <ButtonBase
            sx={{
              display: 'block',
              px: 1,
              py: 1,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: (theme) => theme.spacing(1),
            }}
            onClick={handleSwitchNetwork}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar
                  src={getChainLogoImage(chainId)}
                  sx={{ width: '1rem', height: '1rem' }}
                />
                <Typography>{getChainName(chainId)}</Typography>
              </Stack>
              <KeyboardArrowRightIcon />
            </Stack>
          </ButtonBase>
          <Divider />
          <Stack spacing={2} direction="row">
            <Button
              fullWidth
              startIcon={<Send />}
              color="inherit"
              variant="outlined"
              onClick={handleOpenSend}
            >
              <FormattedMessage id="send" defaultMessage="Send" />
            </Button>
            <Button
              startIcon={<VerticalAlignBottomIcon />}
              color="inherit"
              variant="outlined"
              fullWidth
              onClick={handleOpenReceive}
            >
              <FormattedMessage id="receive" defaultMessage="Receive" />
            </Button>
          </Stack>
          <Button
            onClick={handleSwitchWallet}
            startIcon={<SwitchAccount fontSize="small" />}
            variant="outlined"
            color="inherit"
          >
            <FormattedMessage
              id="switch.wallet"
              defaultMessage="Switch wallet"
            />
          </Button>
        </Stack>
      </Box>
    </>
  );
}
