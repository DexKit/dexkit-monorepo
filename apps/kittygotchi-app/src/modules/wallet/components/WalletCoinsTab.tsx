import { currencyAtom } from '@/modules/common/atoms';
import Receive from '@/modules/common/components/icons/Receive';
import Send from '@/modules/common/components/icons/Send';
import Wallet from '@/modules/common/components/icons/Wallet';
import { Add, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useAtomValue } from 'jotai';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import {
  useAccounts,
  useBalancesVisibility,
  useCoins,
  useCoinsMarketData,
  useEvmCoinPrices,
  useWalletBalances,
} from '../hooks';
import { Coin, CoinGeckoMarketsData, CoinPrices, EvmCoin } from '../types';
import { walletFiatTotal } from '../utils';

const EvmReceiveDialog = dynamic(() => import('./dialogs/EvmReceiveDialog'));
const EvmAccountsDialog = dynamic(() => import('./dialogs/EvmAccountsDialog'));

const EvmSendDialog = dynamic(() => import('./dialogs/EvmSendDialog'));

const SelectCoinDialog = dynamic(() => import('./dialogs/SelectCoinDialog'));

const VisibleCoinsDialog = dynamic(
  () => import('./dialogs/VisibleCoinsDialog')
);

const EvmAddAccountDialog = dynamic(
  () => import('./dialogs/EvmAddAccountDialog')
);

const ImportCoinsDialog = dynamic(() => import('./dialogs/ImportCoinsDialog'));

import { SearchTextField } from './SearchTextField';
import WalletActionButton from './WalletActionButton';
import WalletCoinList from './WalletCoinList';

import { useConnectWalletDialog } from '@/modules/common/hooks/misc';
import TipsAndUpdates from '@mui/icons-material/TipsAndUpdates';
import transakSDK from '@transak/transak-sdk';
import { ethers } from 'ethers';
import { useUpdateAtom } from 'jotai/utils';
import dynamic from 'next/dynamic';
import { coinsAtom } from '../atoms';
import { CoinTypes } from '../constants/enums';

interface Props {}

export default function WalletCoinsTab({}: Props) {
  const { formatMessage } = useIntl();
  const currency = useAtomValue(currencyAtom);
  const balancesVisibility = useBalancesVisibility();

  const transakRef = useRef(
    new transakSDK({
      apiKey: '4cf44cc4-69d7-4f4d-8237-05cc9076aa41',
      environment: 'STAGING',
      themeColor: '000000',
    })
  );

  const { chainId, account, provider, connector } = useWeb3React();

  const { accounts } = useAccounts({});
  const { coins } = useCoins();

  const balances = useWalletBalances({ accounts, coins });

  const prices: CoinPrices = useEvmCoinPrices({ currency, coins });

  const marketData = useCoinsMarketData({ currency, coins });

  const total = useMemo(() => {
    return walletFiatTotal(balances || [], prices, coins, currency);
  }, [balances, prices, coins, currency]);

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin>();
  const [showSend, setShowSend] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [showVisibleCoins, setShowVisibleCoins] = useState(false);
  const [showImportCoins, setShowImportCoins] = useState(false);
  const [showAddEvmAccount, setShowAddEvmAccount] = useState(false);

  const [selectFor, setSelectFor] = useState<string>();

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleShowTransak = () => {
    transakRef.current.init();
  };

  const handleSelectCoin = useCallback(
    (coin: Coin) => {
      setSelectedCoin(coin);

      if (selectFor === 'send') {
        setShowSend(true);
      }

      if (selectFor === 'receive') {
        setShowReceive(true);
      }

      setOpen(false);
    },
    [selectFor]
  );

  const handleSend = () => {
    setSelectFor('send');
    setOpen(true);
  };

  const handleReceive = () => {
    setSelectFor('receive');
    setOpen(true);
  };

  const handleCloseSend = () => {
    setShowSend(false);
    setSelectedCoin(undefined);
    setSelectFor(undefined);
  };

  const handleCloseReceive = () => {
    setShowReceive(false);
    setSelectedCoin(undefined);
    setSelectFor(undefined);
  };

  const handleShowAccounts = () => {
    setShowAccounts(true);
  };

  const handleCloseAccounts = () => {
    setShowAccounts(false);
  };

  const handleToggleVisibleCoins = () => {
    setShowVisibleCoins((value) => !value);
  };

  const handleToggleImportCoins = () => {
    setShowImportCoins((value) => !value);
  };

  const usdTotalPercentage = useMemo(() => {
    const market = marketData.data as CoinGeckoMarketsData;

    const ratios = coins.map((c) => {
      const isErc20Coin = c.coinType === CoinTypes.EVM_ERC20;

      if (c.coingeckoId && c.network.chainId && marketData.data) {
        if (balances) {
          const coinTotal = walletFiatTotal(
            balances.filter(
              (b: any) =>
                b.network.id === c.network.id &&
                b.balances[
                  isErc20Coin ? c.contractAddress : ethers.constants.AddressZero
                ]
            ),
            prices,
            [c],
            currency
          );

          const res =
            ((coinTotal / total) *
              (market[c.coingeckoId]?.price_change_percentage_24h || 0)) /
            100;

          return res;
        }
      }

      return 0;
    });

    return ratios.reduce((acc, curr) => acc + curr, 0) || 0;
  }, [coins, prices, total, marketData.data]);

  const handleCloseEvmAddAccount = () => {
    setShowAddEvmAccount(false);
  };

  const handleShowEvmAddAccount = () => {
    handleCloseAccounts();
    setShowAddEvmAccount(true);
  };

  const connectWalletDialog = useConnectWalletDialog();

  const handleConnectWallet = () => {
    connectWalletDialog.show();
  };

  const setCoins = useUpdateAtom(coinsAtom);

  const handleMakeFavorite = (coin: Coin) => {
    setCoins((coins: Coin[]) => {
      const tempCoins = [...coins];

      const index = tempCoins.findIndex(
        (c) =>
          c.network.id === coin.network.id &&
          c.decimals === coin.decimals &&
          c.coingeckoId === coin.coingeckoId &&
          coin.name === coin.name
      );

      if (index > -1) {
        if (tempCoins[index].isFavorite) {
          tempCoins[index].isFavorite = false;
        } else {
          tempCoins[index].isFavorite = true;
        }
      }

      return tempCoins;
    });
  };

  const handleShowImport = () => {
    handleToggleVisibleCoins();
    handleToggleImportCoins();
  };

  return (
    <>
      {showVisibleCoins && (
        <VisibleCoinsDialog
          DialogProps={{
            open: showVisibleCoins,
            onClose: handleToggleVisibleCoins,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          onImport={handleShowImport}
        />
      )}

      {showImportCoins && (
        <ImportCoinsDialog
          DialogProps={{
            open: showImportCoins,
            onClose: handleToggleImportCoins,
            fullWidth: true,
            maxWidth: 'sm',
          }}
        />
      )}

      {open && (
        <SelectCoinDialog
          dialogProps={{
            open,
            onClose: handleClose,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          removeZeroBalance={selectFor === 'send'}
          balances={balances}
          prices={prices}
          onSelect={handleSelectCoin}
        />
      )}

      {showAccounts && (
        <EvmAccountsDialog
          dialogProps={{
            open: showAccounts,
            onClose: handleCloseAccounts,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          onAddAccount={handleShowEvmAddAccount}
        />
      )}

      {showSend && (
        <EvmSendDialog
          defaultCoin={selectedCoin as EvmCoin}
          dialogProps={{
            open: showSend,
            onClose: handleCloseSend,

            fullWidth: true,
            maxWidth: 'sm',
          }}
          account={account}
          chainId={chainId}
          provider={provider}
          connector={connector}
        />
      )}

      {showAddEvmAccount && (
        <EvmAddAccountDialog
          dialogProps={{
            open: showAddEvmAccount,
            fullWidth: true,
            maxWidth: 'xs',
            onClose: handleCloseEvmAddAccount,
          }}
        />
      )}

      {account && showReceive && (
        <EvmReceiveDialog
          dialogProps={{
            open: showReceive,
            onClose: handleCloseReceive,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          chainId={chainId}
          receiver={account}
          defaultCoin={selectedCoin as EvmCoin}
        />
      )}

      <Stack spacing={2}>
        <Box>
          <Stack
            spacing={2}
            direction={{ sm: 'row', xs: 'column' }}
            justifyContent={{ sm: 'space-between' }}
          >
            <Card>
              <Box sx={{ p: 2 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    <FormattedMessage
                      defaultMessage="Total balance"
                      id="total.balance "
                    />
                  </Typography>
                  <Stack alignItems="center" direction="row" spacing={0.5}>
                    <Typography variant="h5">
                      {balancesVisibility.isVisible ? (
                        <FormattedNumber
                          value={total}
                          currencyDisplay="narrowSymbol"
                          style="currency"
                          currency={currency}
                        />
                      ) : (
                        '****,**'
                      )}{' '}
                    </Typography>
                    <Typography
                      sx={(theme) => ({
                        color:
                          usdTotalPercentage === 0
                            ? theme.palette.text.primary
                            : usdTotalPercentage > 0
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                      })}
                      variant="caption"
                    >
                      <FormattedNumber
                        value={usdTotalPercentage}
                        style="percent"
                        maximumFractionDigits={2}
                        minimumFractionDigits={2}
                      />
                    </Typography>
                    <IconButton
                      onClick={balancesVisibility.handleToggle}
                      size="small"
                    >
                      {balancesVisibility.isVisible ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            </Card>
            <Box>
              <Stack spacing={2} direction="row">
                <WalletActionButton
                  icon={<Send />}
                  title={<FormattedMessage id="send" defaultMessage="send" />}
                  onClick={handleSend}
                />

                <WalletActionButton
                  icon={<Receive />}
                  title={
                    <FormattedMessage id="receive" defaultMessage="receive" />
                  }
                  onClick={handleReceive}
                />

                <WalletActionButton
                  icon={<Wallet />}
                  title={
                    <FormattedMessage id="accounts" defaultMessage="Accounts" />
                  }
                  onClick={handleShowAccounts}
                />

                <WalletActionButton
                  icon={<Wallet />}
                  title={<FormattedMessage id="buy" defaultMessage="Buy" />}
                  onClick={handleShowTransak}
                />
              </Stack>
            </Box>
          </Stack>
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SearchTextField
                onChange={handleSearchChange}
                TextFieldProps={{
                  size: 'small',
                  fullWidth: true,
                  placeholder: formatMessage({
                    id: 'search',
                    defaultMessage: 'Search',
                  }),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {accounts.length === 0 && (
          <Alert
            severity="warning"
            action={
              <Button
                startIcon={<Add />}
                onClick={handleShowAccounts}
                variant="outlined"
                color="inherit"
              >
                <FormattedMessage
                  id="add.account"
                  defaultMessage="Add account"
                />
              </Button>
            }
          >
            <FormattedMessage
              id="no.accounts.found.add.accounts.to.your.portfolio"
              defaultMessage="No accounts found, add accounts to your portfolio"
            />
          </Alert>
        )}

        {coins.length > 0 ? (
          <Card>
            <WalletCoinList
              coins={coins}
              balances={balances || []}
              prices={prices}
              search={search}
              marketsData={marketData.data || {}}
              onMakeFavorite={handleMakeFavorite}
            />
          </Card>
        ) : (
          <Box>
            <Stack spacing={2} alignItems="center" alignContent="center">
              <TipsAndUpdates fontSize="large" />
              <Box>
                <Typography align="center" variant="h5">
                  <FormattedMessage
                    id="no.coins.visible"
                    defaultMessage="No coins visible"
                  />
                </Typography>
                <Typography
                  color="text.secondary"
                  align="center"
                  variant="body1"
                >
                  <FormattedMessage
                    id="make.some.coins.visible.to.see.your.balance"
                    defaultMessage="Make some coins visible to see your balance"
                  />
                </Typography>
              </Box>
              {coins.length === 0 && (
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<Add />}
                  onClick={handleToggleVisibleCoins}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  <FormattedMessage
                    id="visible.coins"
                    defaultMessage="Visible coins"
                  />
                </Button>
              )}
            </Stack>
          </Box>
        )}

        {coins.length > 0 && (
          <Box>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Add />}
              onClick={handleToggleVisibleCoins}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <FormattedMessage
                id="visible.coins"
                defaultMessage="Visible coins"
              />
            </Button>
          </Box>
        )}
      </Stack>
    </>
  );
}
