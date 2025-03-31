import type { NextPage } from 'next';

import { currencyAtom } from '@/modules/common/atoms';
import AppPageHeader from '@/modules/common/components/AppPageHeader';
import Receive from '@/modules/common/components/icons/Receive';
import Send from '@/modules/common/components/icons/Send';
import MainLayout from '@/modules/common/components/layouts/MainLayout';
import { ChainId } from '@/modules/common/constants/enums';
import { getBlockExplorerUrl, isAddressEqual } from '@/modules/common/utils';
import EvmAccountsDialog from '@/modules/wallet/components/dialogs/EvmAccountsDialog';
import EvmAddAccountDialog from '@/modules/wallet/components/dialogs/EvmAddAccountDialog';
import EvmEditAccountDialog from '@/modules/wallet/components/dialogs/EvmEditAccountDialog';
import EvmReceiveDialog from '@/modules/wallet/components/dialogs/EvmReceiveDialog';
import EvmSendDialog from '@/modules/wallet/components/dialogs/EvmSendDialog';

import Wallet from '@/modules/common/components/icons/Wallet';
import { copyToClipboard } from '@/modules/common/utils/browser';
import { WalletAccountsMenu } from '@/modules/wallet/components/menus/WalletAccountsMenu';
import PortfolioAccountsList from '@/modules/wallet/components/PortfolioAccountsList';
import WalletRoundedButton from '@/modules/wallet/components/WalletRoundedButton';
import { AccountType, CoinTypes } from '@/modules/wallet/constants/enums';
import {
  useAccounts,
  useBalancesVisibility,
  useCoin,
  useEvmCoinPrices,
  useWalletBalances,
} from '@/modules/wallet/hooks';
import { Account, Erc20Coin, EvmCoin } from '@/modules/wallet/types';
import { walletFiatTotal } from '@/modules/wallet/utils';
import { TOKEN_ICON_URL } from '@/modules/wallet/utils/token';
import {
  Add,
  AttachMoney,
  Edit,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import Token from '@mui/icons-material/Token';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';

const CoinPage: NextPage = () => {
  const router = useRouter();

  const balancesVisibility = useBalancesVisibility();

  const { enqueueSnackbar } = useSnackbar();

  const { network, symbol } = router.query;

  const { isActive, account, provider, chainId } = useWeb3React();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [selectedAccount, setSelectedAccount] = useState<Account>();

  const [showEvmReceive, setShowEvmReceive] = useState(false);
  const [showEvmSend, setShowEvmSend] = useState(false);
  const [showAddEvmAccount, setShowAddEvmAccount] = useState(false);
  const [showEvmAccounts, setShowEvmAccounts] = useState(false);
  const [showEvmEditAccount, setShowEvmEditAccount] = useState(false);

  const currency = useAtomValue(currencyAtom);

  const coin = useCoin({
    symbol: symbol as string,
    network: network as string,
    address: symbol as string,
  });

  const isEvmCoin = useMemo(
    () =>
      coin &&
      (coin.coinType === CoinTypes.EVM_ERC20 ||
        coin.coinType === CoinTypes.EVM_NATIVE),
    [coin]
  );

  const isErc20Coin = useMemo(() => {
    return coin?.coinType === CoinTypes.EVM_ERC20;
  }, [coin]);

  const { accounts, removeAccount } = useAccounts({});

  const coinAccounts = useMemo(() => {
    if (coin) {
      return accounts.filter((account) => account.type === AccountType.EVM);
    }

    return [];
  }, [accounts, coin]);

  const walletBalances = useWalletBalances({
    coins: coin ? [coin] : [],
    accounts: coinAccounts,
  });

  const prices = useEvmCoinPrices({ coins: coin ? [coin] : [], currency });

  const totalBalance = useMemo(() => {
    if (walletBalances && walletBalances.length > 0) {
      if (coin && isEvmCoin) {
        let total = BigNumber.from(0);

        for (const balance of walletBalances) {
          const amount =
            balance.balances[
              coin?.coinType === CoinTypes.EVM_ERC20
                ? coin.contractAddress
                : ethers.constants.AddressZero
            ];

          if (amount) {
            total = total.add(amount);
          }
        }

        return ethers.utils.formatUnits(total, coin.decimals);
      }
    }

    return '0.0';
  }, [walletBalances, isEvmCoin, coin]);

  const total = useMemo(() => {
    return walletFiatTotal(
      walletBalances || [],
      prices,
      coin ? [coin] : [],
      currency
    );
  }, [walletBalances, prices, coin, currency]);

  const handleShowSend = () => {
    if (isEvmCoin) {
      setShowEvmSend(true);
    }
  };

  const handleShowReceive = () => {
    if (isEvmCoin) {
      setShowEvmReceive(true);
    }
  };

  const handleShowEvmAddAccount = () => {
    handleCloseEvmAccounts();

    if (isEvmCoin) {
      setShowAddEvmAccount(true);
    }
  };

  const handleShowAccounts = () => {
    setShowEvmAccounts(true);
  };

  const handleCloseSendEvm = () => {
    setShowEvmSend(false);
  };

  const handleCloseReceiveEvm = () => {
    setShowEvmReceive(false);
  };

  const handleCloseEvmAddAccount = () => {
    setShowAddEvmAccount(false);
  };

  const handleCloseEvmAccounts = () => {
    setShowEvmAccounts(false);
  };

  const handleCloseEvmEditAccount = () => {
    setShowEvmEditAccount(false);
  };

  const renderEvmDialogs = () => {
    if (isEvmCoin) {
      return (
        <>
          <EvmSendDialog
            dialogProps={{
              open: showEvmSend,
              fullWidth: true,
              maxWidth: 'xs',
              onClose: handleCloseSendEvm,
            }}
            account={account}
            chainId={chainId}
            provider={provider}
            defaultCoin={coin as EvmCoin}
          />
          {account && isEvmCoin && (
            <EvmReceiveDialog
              dialogProps={{
                open: showEvmReceive,
                fullWidth: true,
                maxWidth: 'xs',
                onClose: handleCloseReceiveEvm,
              }}
              receiver={account}
              chainId={chainId}
              defaultCoin={coin as EvmCoin}
            />
          )}
          <EvmAddAccountDialog
            dialogProps={{
              open: showAddEvmAccount,
              fullWidth: true,
              maxWidth: 'xs',
              onClose: handleCloseEvmAddAccount,
            }}
          />
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

          <EvmAccountsDialog
            dialogProps={{
              open: showEvmAccounts,
              fullWidth: true,
              maxWidth: 'sm',
              onClose: handleCloseEvmAccounts,
            }}
            onAddAccount={handleShowEvmAddAccount}
          />
        </>
      );
    }

    return null;
  };

  const handleMenu = (address: string, el: HTMLElement) => {
    setAnchorEl(el);
    setSelectedAddress(address);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleRemoveAddress = () => {
    const account = accounts.find((a) =>
      isAddressEqual(selectedAddress, a.address)
    );

    if (account) {
      removeAccount(account);
    }

    setAnchorEl(null);
    setSelectedAddress(undefined);
  };

  const handleEditAccount = () => {
    const account = accounts.find((a) =>
      isAddressEqual(selectedAddress, a.address)
    );

    if (account) {
      setShowEvmEditAccount(true);
      setSelectedAccount(account);
    }

    setAnchorEl(null);
    setSelectedAddress(undefined);
  };

  const { formatMessage } = useIntl();

  const handleCopyAddress = async () => {
    if (selectedAddress) {
      await copyToClipboard(selectedAddress);

      setAnchorEl(null);
      setSelectedAddress(undefined);

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
    if (selectedAddress) {
      window.open(
        `${getBlockExplorerUrl(chainId)}/address/${selectedAddress}`,
        '_blank'
      );

      setSelectedAddress(undefined);
      setAnchorEl(null);
    }
  };

  return (
    <>
      <WalletAccountsMenu
        onEdit={handleEditAccount}
        onRemove={handleRemoveAddress}
        onCopyAddress={handleCopyAddress}
        onViewBlockExplorer={handleViewOnBlockExplorer}
        MenuProps={{
          anchorEl: anchorEl,
          open: Boolean(anchorEl),
          onClose: handleCloseMenu,
        }}
      />

      {renderEvmDialogs()}
      <MainLayout>
        <Stack spacing={2}>
          <AppPageHeader
            breadcrumbs={[
              {
                caption: <FormattedMessage id="home" defaultMessage="Home" />,
                uri: '/',
              },
              {
                caption: (
                  <FormattedMessage id="portfolio" defaultMessage="Portfolio" />
                ),
                uri: '/',
              },
              {
                caption: (
                  <FormattedMessage
                    id="coin.on.network"
                    defaultMessage="{name} on {network}"
                    values={{
                      name: coin?.name,
                      network: coin?.network.name,
                    }}
                  />
                ),
                uri: `/portfolio/${coin?.network.id}/${
                  isErc20Coin
                    ? (coin as Erc20Coin).contractAddress
                    : coin?.symbol
                }`,
                active: true,
              },
            ]}
          />
          <Box>
            <Stack
              spacing={2}
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
            >
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <Card sx={{ p: 1, height: '100%', display: 'flex' }}>
                  <Stack
                    spacing={2}
                    direction="row"
                    alignItems="center"
                    alignContent="center"
                  >
                    <Avatar
                      src={
                        coin?.coinType === CoinTypes.EVM_ERC20
                          ? TOKEN_ICON_URL(
                              coin?.contractAddress,
                              coin?.network.chainId as ChainId
                            )
                          : coin?.imageUrl
                      }
                    >
                      <Token />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        <FormattedMessage
                          id="coin.on.network"
                          defaultMessage="{name} on {network}"
                          values={{
                            name: coin?.name,
                            network: coin?.network.name,
                          }}
                        />
                      </Typography>
                      <Typography variant="h5">{coin?.name}</Typography>
                    </Box>
                  </Stack>
                </Card>
                <Card
                  sx={{
                    p: 1,
                    height: '100%',
                    display: 'flex',
                  }}
                >
                  <Stack spacing={2} alignItems="center" direction="row">
                    <Avatar>
                      <AttachMoney color="action" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        <FormattedMessage
                          id="total.amount"
                          defaultMessage="Total amount"
                        />
                      </Typography>
                      <Typography variant="h5">
                        {balancesVisibility.isVisible ? (
                          <>
                            {totalBalance} {coin?.symbol?.toUpperCase()}
                          </>
                        ) : (
                          '******'
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
                <Card
                  sx={{
                    p: 1,
                    height: '100%',
                    display: 'flex',
                  }}
                >
                  <Stack spacing={2} alignItems="center" direction="row">
                    <Avatar>
                      <AttachMoney color="action" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        <FormattedMessage
                          id="total.fiat"
                          defaultMessage="Total fiat"
                        />
                      </Typography>
                      <Stack spacing={0.5} direction="row" alignItems="center">
                        <Typography variant="h5">
                          {balancesVisibility.isVisible ? (
                            <FormattedNumber
                              value={total}
                              currencyDisplay="narrowSymbol"
                              style="currency"
                              currency={currency}
                            />
                          ) : (
                            '******'
                          )}
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
                  </Stack>
                </Card>
              </Stack>
              <Stack spacing={2} direction="row">
                <Stack
                  alignItems="center"
                  alignContent="center"
                  justifyContent="center"
                >
                  <WalletRoundedButton onClick={handleShowSend}>
                    <Send />
                  </WalletRoundedButton>
                  <Typography variant="overline">
                    <FormattedMessage id="send" defaultMessage="send" />
                  </Typography>
                </Stack>
                <Stack
                  alignItems="center"
                  alignContent="center"
                  justifyContent="center"
                >
                  <WalletRoundedButton onClick={handleShowReceive}>
                    <Receive />
                  </WalletRoundedButton>
                  <Typography variant="overline">
                    <FormattedMessage id="receive" defaultMessage="receive" />
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>
          <Box>
            <Stack
              alignItems="center"
              justifyContent="space-between"
              direction="row"
              alignContent="center"
            >
              <Typography variant="subtitle1">
                <FormattedMessage id="accounts" defaultMessage="Accounts" />
              </Typography>
              <IconButton onClick={handleShowAccounts}>
                <Edit />
              </IconButton>
            </Stack>
          </Box>
          <Divider />
          {walletBalances && walletBalances.length > 0 ? (
            coin &&
            currency && (
              <PortfolioAccountsList
                balances={walletBalances || []}
                coin={coin}
                activeAccount={account}
                currency={currency}
                prices={prices}
                onMenu={handleMenu}
              />
            )
          ) : (
            <Box py={2}>
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
                  sx={{ width: { xs: '100%', sm: 'inherit' } }}
                  startIcon={<Add />}
                  onClick={handleShowEvmAddAccount}
                  variant="outlined"
                  color="inherit"
                >
                  <FormattedMessage
                    id="add.account"
                    defaultMessage="Add account"
                  />
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </MainLayout>
    </>
  );
};

export default CoinPage;
