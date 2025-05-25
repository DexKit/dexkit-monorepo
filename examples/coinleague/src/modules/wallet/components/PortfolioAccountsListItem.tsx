import { isAddressEqual, truncateAddress } from '@/modules/common/utils';
import { MoreVert } from '@mui/icons-material';
import {
  alpha,
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { ethers } from 'ethers';
import Image from 'next/future/image';
import { memo, MouseEvent, useMemo } from 'react';
import { FormattedNumber } from 'react-intl';
import { CoinTypes, WalletConnectType } from '../constants/enums';
import { useAccounts, useBalancesVisibility } from '../hooks';
import { AccountBalance, Coin, CoinPrices } from '../types';

import metaMaskFoxImg from 'public/icons/metamask-fox.svg';

import magicImg from 'public/icons/magic.svg';

interface Props {
  account: string;
  coin: Coin;
  currency: string;
  isActive?: boolean;
  balance: AccountBalance;
  prices: CoinPrices;
  onMenu: (account: string, anchor: HTMLElement) => void;
}

function PortfolioAccountsListItem({
  account,
  coin,
  currency,
  isActive,
  balance,
  prices,
  onMenu,
}: Props) {
  const { accounts } = useAccounts({});

  const balancesVisibility = useBalancesVisibility();

  const handleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    onMenu(account, event.currentTarget);
  };

  const isErc20Coin = coin.coinType === CoinTypes.EVM_ERC20;
  const isEvmNativeCoin = coin.coinType === CoinTypes.EVM_NATIVE;

  const formattedBalance = useMemo(() => {
    if (balance) {
      const amount =
        balance.balances[
          coin.coinType === CoinTypes.EVM_ERC20
            ? coin.contractAddress
            : ethers.constants.AddressZero
        ];

      if (amount) {
        return ethers.utils.formatUnits(amount, coin.decimals);
      }
    }

    return '0.0';
  }, [balance, coin]);

  const totalCurrency = useMemo(() => {
    if (isErc20Coin || isEvmNativeCoin) {
      const total =
        balance.balances[
          coin.coinType === CoinTypes.EVM_ERC20
            ? coin.contractAddress
            : ethers.constants.AddressZero
        ];

      if (coin.network.chainId) {
        const chainPrices = prices[coin.network.chainId] || {};

        const coinPrice =
          chainPrices[
            isErc20Coin ? coin.contractAddress : ethers.constants.AddressZero
          ] || {};

        const ratio = coinPrice[currency];

        if (ratio > 0) {
          const amount = parseFloat(
            ethers.utils.formatUnits(total, coin.decimals)
          );

          return ratio * amount;
        }
      }
    }

    return 0;
  }, [isErc20Coin, isEvmNativeCoin, balance, coin, currency]);

  const resultAccount = useMemo(() => {
    return accounts.find((a) => isAddressEqual(a.address, account));
  }, [accounts, account]);

  const renderConnectorIcon = () => {
    if (resultAccount?.connector === WalletConnectType.MetaMask) {
      return (
        <Box sx={{ position: 'relative', height: 14, width: 14, mr: 1 }}>
          <Image
            alt="MetaMask"
            src={metaMaskFoxImg.src}
            style={{ width: '1rem', height: '1rem' }}
            width={14}
            height={14}
          />
        </Box>
      );
    } else if (resultAccount?.connector === WalletConnectType.Magic) {
      return (
        <Box sx={{ position: 'relative', height: 14, width: 14, mr: 1 }}>
          <Image
            alt="Magic"
            src={magicImg.src}
            style={{ width: '1rem', height: '1rem' }}
            width={14}
            height={14}
          />
        </Box>
      );
    }
  };

  return (
    <ListItem
      sx={
        isActive
          ? (theme) => ({
              backgroundColor: alpha(theme.palette.success.main, 0.2),
            })
          : undefined
      }
    >
      <ListItemText
        primary={resultAccount?.name || truncateAddress(account)}
        secondaryTypographyProps={{ component: 'div' }}
        secondary={
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            spacing={1}
          >
            {renderConnectorIcon()} {truncateAddress(account)}
          </Stack>
        }
      />
      <Box mr={2}>
        <Typography variant="body1" align="right">
          {balancesVisibility.isVisible ? (
            <FormattedNumber
              currencyDisplay="narrowSymbol"
              style="currency"
              currency={currency}
              value={totalCurrency}
            />
          ) : (
            '******'
          )}
        </Typography>
        <Typography variant="body2" color="textSecondary" align="right">
          {balancesVisibility.isVisible ? (
            <>
              {formattedBalance} {coin.symbol}
            </>
          ) : (
            '******'
          )}
        </Typography>
      </Box>
      <Box>
        <IconButton onClick={handleMenu}>
          <MoreVert />
        </IconButton>
      </Box>
    </ListItem>
  );
}

export default memo(PortfolioAccountsListItem);
