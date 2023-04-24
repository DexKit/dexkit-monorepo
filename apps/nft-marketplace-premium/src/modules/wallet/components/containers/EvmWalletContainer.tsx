import { NavigateNext, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  NoSsr,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import transakSDK from '@transak/transak-sdk';
import React, { useEffect, useRef, useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormattedMessage, useIntl } from 'react-intl';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { useWeb3React } from '@web3-react/core';
import { useAtom } from 'jotai';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { TransferCoinButton } from '@/modules/wallet/components/TransferCoinButton';
import { copyToClipboard, truncateAddress } from '@dexkit/core/utils';
import CopyIconButton from '@dexkit/ui/components/CopyIconButton';
import FileCopy from '@mui/icons-material/FileCopy';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import dynamic from 'next/dynamic';

import Link from 'src/components/Link';
import { NetworkSelectButton } from 'src/components/NetworkSelectButton';
import ImportTokenDialog from 'src/components/dialogs/ImportTokenDialog';
import CloseCircle from 'src/components/icons/CloseCircle';
import Wallet from 'src/components/icons/Wallet';
import { useAppConfig, useConnectWalletDialog } from 'src/hooks/app';
import { useEvmCoins } from 'src/hooks/blockchain';
import { useCurrency } from 'src/hooks/currency';
import { isBalancesVisibleAtom } from 'src/state/atoms';
import {
  TransactionsTable,
  TransactionsTableFilter,
} from '../TransactionsTable';
import WalletActionButton from '../WalletActionButton';
import WalletBalances from '../WalletBalancesTable';
import { WalletTotalBalanceCointainer } from '../WalletTotalBalanceContainer';

const EvmReceiveDialog = dynamic(
  () => import('@dexkit/ui/components/dialogs/EvmReceiveDialog')
);

enum WalletTabs {
  Transactions,
  Trades,
}

const EvmWalletContainer = () => {
  const appConfig = useAppConfig();

  const { account, isActive, chainId: walletChainId, ENSName } = useWeb3React();
  const [chainId, setChainId] = useState(walletChainId);

  const { formatMessage } = useIntl();
  const evmCoins = useEvmCoins({ defaultChainId: chainId });

  const theme = useTheme();
  const connectWalletDialog = useConnectWalletDialog();

  const handleConnectWallet = () => {
    connectWalletDialog.setOpen(true);
  };
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

  const [selectedTab, setSelectedTab] = useState(WalletTabs.Transactions);
  const [isTableOpen, setIsTableOpen] = useState(isDesktop);
  const [search, setSearch] = useState('');

  const [isBalancesVisible, setIsBalancesVisible] = useAtom(
    isBalancesVisibleAtom
  );

  const handleChangeTab = (
    event: React.SyntheticEvent<Element, Event>,
    value: WalletTabs
  ) => {
    setSelectedTab(value);
  };

  const handleToggleBalances = () => {
    setIsTableOpen((value) => !value);
  };

  const handleToggleVisibility = () => {
    setIsBalancesVisible((value) => !value);
  };

  const handleOpenReceive = () => {
    setIsReceiveOpen(true);
  };

  const handleCloseReceive = () => {
    setIsReceiveOpen(false);
  };

  const currency = useCurrency();

  const transak = useRef<any>();

  useEffect(() => {
    if (appConfig.transak?.enabled) {
      if (account !== undefined) {
        transak.current = new transakSDK({
          apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY, // Your API Key
          environment:
            process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'PRODUCTION', // STAGING/PRODUCTION
          hostURL: window.location.origin,
          widgetHeight:
            window.innerHeight > 840 ? '770px' : `${window.innerHeight - 70}px`,
          widgetWidth:
            window.innerWidth > 500 ? '500px' : `${window.innerWidth - 10}px`,
          walletAddress: account, // Your customer's wallet address
          fiatCurrency: currency.toUpperCase(), // If you want to limit fiat selection eg 'USD'
        });
      }
    }
  }, [account, currency]);

  const handleBuy = () => {
    transak.current?.init();
  };

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const handleCloseImportTokenDialog = () => {
    setIsImportDialogOpen(false);
  };

  const handleOpenImportTokenDialog = () => {
    setIsImportDialogOpen(true);
  };
  const handleCopy = () => {
    if (account) {
      if (ENSName) {
        copyToClipboard(ENSName);
      } else {
        copyToClipboard(account);
      }
    }
  };

  useEffect(() => {
    // we are not allowing to change chainId when user sets defaultChainId
    if (walletChainId) {
      setChainId(walletChainId);
    }
  }, [walletChainId]);

  return (
    <>
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
      <ImportTokenDialog
        dialogProps={{
          open: isImportDialogOpen,
          onClose: handleCloseImportTokenDialog,
          maxWidth: 'xs',
          fullWidth: true,
        }}
      />
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                alignContent="center"
                spacing={2}
              >
                {isActive && (
                  <Grid item xs={12}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignContent="center"
                    >
                      <Box>
                        <Typography color="textSecondary" variant="caption">
                          {isBalancesVisible
                            ? ENSName
                              ? ENSName
                              : truncateAddress(account)
                            : '*****'}
                          <CopyIconButton
                            iconButtonProps={{
                              onClick: handleCopy,
                              size: 'small',
                              color: 'inherit',
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

                        <Stack
                          direction="row"
                          alignItems="center"
                          alignContent="center"
                          spacing={1}
                        >
                          <Typography variant="h5">
                            <NoSsr>
                              <WalletTotalBalanceCointainer chainId={chainId} />
                            </NoSsr>
                          </Typography>
                          <IconButton onClick={handleToggleVisibility}>
                            {isBalancesVisible ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </Stack>
                      </Box>
                      <NetworkSelectButton
                        chainId={chainId}
                        onChange={(newChainId) => setChainId(newChainId)}
                      />
                    </Stack>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems="center">
                    {appConfig.transak?.enabled && (
                      <Grid item>
                        <Button
                          onClick={handleBuy}
                          disabled={!isActive}
                          variant="contained"
                          color="primary"
                        >
                          <FormattedMessage id="buy" defaultMessage="Buy" />
                        </Button>
                      </Grid>
                    )}

                    <Grid item>
                      <Button
                        onClick={handleOpenReceive}
                        variant="outlined"
                        disabled={!isActive}
                        color="primary"
                      >
                        <FormattedMessage
                          id="receive"
                          defaultMessage="Receive"
                        />
                      </Button>
                    </Grid>
                    <Grid item>
                      <TransferCoinButton />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid
                  item
                  xs={isDesktop ? undefined : 12}
                  sm={isDesktop ? true : undefined}
                >
                  <TextField
                    size="small"
                    type="search"
                    onChange={(ev) => setSearch(ev.currentTarget.value)}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Search color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={isDesktop ? undefined : 12}>
                  <Button
                    onClick={handleOpenImportTokenDialog}
                    variant="outlined"
                    disabled={!isActive}
                    startIcon={<ImportExportIcon />}
                    fullWidth
                  >
                    <FormattedMessage
                      id="import.token"
                      defaultMessage="Import token"
                    />
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              {!isActive && (
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  alignContent="center"
                  spacing={2}
                >
                  <CloseCircle color="error" />
                  <Box>
                    <Typography
                      align="center"
                      variant="subtitle1"
                      sx={{ fontWeight: 600 }}
                    >
                      <FormattedMessage
                        id="wallet.is.not.connected"
                        defaultMessage="Wallet is not connected"
                      />
                    </Typography>
                    <Typography
                      align="center"
                      variant="body2"
                      color="textSecondary"
                    >
                      <FormattedMessage
                        id="please.connect.your.wallet.to.see.balance"
                        defaultMessage="Please, connect your wallet to see your balance"
                      />
                    </Typography>
                  </Box>
                  <Button
                    onClick={() => handleConnectWallet()}
                    variant="contained"
                    startIcon={<Wallet />}
                  >
                    <FormattedMessage
                      id="connect.wallet"
                      defaultMessage="Connect Wallet"
                    />
                  </Button>
                </Stack>
              )}
            </Grid>

            {isActive && (
              <Grid item xs={12}>
                <NoSsr>
                  <Collapse in={isTableOpen}>
                    <WalletBalances chainId={chainId} filter={search} />
                  </Collapse>
                </NoSsr>
              </Grid>
            )}

            {isActive && (
              <Grid item xs={12}>
                <Button
                  onClick={handleToggleBalances}
                  fullWidth
                  sx={(theme) => ({
                    backgroundColor: theme.vars.palette.background.paper,
                    py: 2,
                  })}
                  startIcon={
                    isTableOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />
                  }
                >
                  {isTableOpen ? (
                    <FormattedMessage id="close" defaultMessage="Close" />
                  ) : (
                    <FormattedMessage id="open" defaultMessage="Open" />
                  )}
                </Button>
              </Grid>
            )}

            <>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <WalletActionButton
                      disabled={!isActive}
                      LinkComponent={Link}
                      href="/wallet/nfts"
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        alignContent="center"
                      >
                        <Typography variant="h5">
                          <FormattedMessage id="nfts" defaultMessage="NFTs" />
                        </Typography>
                        {/*Object.keys(favorites.assets).length > 0 && (
                            <Chip
                              label={Object.keys(favorites.assets).length}
                              color="secondary"
                            />
                          )*/}
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        alignContent="center"
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                          color="primary"
                          variant="body1"
                        >
                          <FormattedMessage id="open" defaultMessage="Open" />
                        </Typography>
                        <NavigateNext color="primary" />
                      </Stack>
                    </WalletActionButton>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <WalletActionButton
                      disabled={!isActive}
                      LinkComponent={Link}
                      href="/wallet/orders"
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        alignContent="center"
                      >
                        <Typography variant="h5">
                          <FormattedMessage
                            id="orders"
                            defaultMessage="Orders"
                          />
                        </Typography>
                        {/* <Chip label="302" color="secondary" /> */}
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        alignContent="center"
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                          color="primary"
                          variant="body1"
                        >
                          <FormattedMessage id="open" defaultMessage="Open" />
                        </Typography>
                        <NavigateNext color="primary" />
                      </Stack>
                    </WalletActionButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Tabs value={selectedTab} onChange={handleChangeTab}>
                  <Tab
                    value={WalletTabs.Transactions}
                    label={
                      <FormattedMessage
                        id="transactions"
                        defaultMessage="Transactions"
                      />
                    }
                  />
                  <Tab
                    value={WalletTabs.Trades}
                    label={
                      <FormattedMessage id="trades" defaultMessage="Trades" />
                    }
                  />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <NoSsr>
                  <TransactionsTable
                    filter={
                      selectedTab === WalletTabs.Transactions
                        ? TransactionsTableFilter.Transactions
                        : TransactionsTableFilter.Trades
                    }
                  />
                </NoSsr>
              </Grid>
            </>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default EvmWalletContainer;
