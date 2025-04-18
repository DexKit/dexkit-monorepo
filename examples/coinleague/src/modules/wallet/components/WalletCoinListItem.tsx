import { currencyAtom } from '@/modules/common/atoms';
import Link from '@/modules/common/components/Link';
import { ChainId } from '@/modules/common/constants/enums';
import { Star, Token } from '@mui/icons-material';
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { BigNumber, ethers } from 'ethers';
import { useAtomValue } from 'jotai';
import { memo, useMemo } from 'react';
import { FormattedNumber } from 'react-intl';
import { CoinTypes } from '../constants/enums';
import { useBalancesVisibility } from '../hooks';
import {
  AccountBalance,
  Coin,
  CoinGeckoMarketsData,
  CoinPrices,
  Erc20Coin,
} from '../types';
import { truncateDecimal } from '../utils';
import { TOKEN_ICON_URL } from '../utils/token';

interface Props {
  coin: Coin;
  balances: AccountBalance[];
  prices: CoinPrices;
  marketsData: CoinGeckoMarketsData;
  divider?: boolean;
  onMakeFavorite: (coin: Coin) => void;
}

export function WalletCoinListItem({
  balances,
  coin,
  prices,
  marketsData,
  divider,
  onMakeFavorite,
}: Props) {
  const currency = useAtomValue(currencyAtom);
  const balancesVisibility = useBalancesVisibility();

  const isErc20Coin = coin.coinType === CoinTypes.EVM_ERC20;
  const isEvmNativeCoin = coin.coinType === CoinTypes.EVM_NATIVE;

  const totalBalance = useMemo(() => {
    if (isErc20Coin || isEvmNativeCoin) {
      let total = BigNumber.from(0);

      for (const coinBalance of balances.filter(
        (b) => b.network.id === coin.network.id
      )) {
        total = total.add(
          BigNumber.from(
            coinBalance.balances[
              isErc20Coin ? coin.contractAddress : ethers.constants.AddressZero
            ] || '0'
          )
        );
      }

      return ethers.utils.formatUnits(total, coin.decimals);
    }

    return '0.0';
  }, [isErc20Coin, isEvmNativeCoin, String(balances), coin]);

  const totalCurrency = useMemo(() => {
    if (isErc20Coin || isEvmNativeCoin) {
      let total = BigNumber.from(0);

      for (const coinBalance of balances.filter(
        (b) => b.network.id === coin.network.id
      )) {
        total = total.add(
          BigNumber.from(
            coinBalance.balances[
              isErc20Coin ? coin.contractAddress : ethers.constants.AddressZero
            ] || '0'
          )
        );
      }

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
  }, [isErc20Coin, isEvmNativeCoin, balances, coin, currency]);

  const priceChange = useMemo(() => {
    if (coin.coingeckoId && coin.coingeckoId in marketsData) {
      return marketsData[coin.coingeckoId].price_change_percentage_24h / 100;
    }
    return 0;
  }, [coin, marketsData]);

  return (
    <ListItem divider={divider}>
      <Box mr={2}>
        <IconButton
          sx={{
            color: (theme) =>
              coin.isFavorite
                ? theme.palette.primary.main
                : theme.palette.action.hover,
          }}
          onClick={() => onMakeFavorite(coin)}
          size="small"
        >
          <Star />
        </IconButton>
      </Box>
      <ListItemAvatar>
        <Avatar
          src={
            coin.imageUrl
              ? coin.imageUrl
              : coin.coinType === CoinTypes.EVM_ERC20
              ? TOKEN_ICON_URL(
                  coin.contractAddress,
                  coin.network.chainId as ChainId
                )
              : undefined
          }
        >
          <Token />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Link
            href={`/portfolio/${coin.network.id}/${
              isErc20Coin ? (coin as Erc20Coin).contractAddress : coin.symbol
            }`}
            color="inherit"
            variant="body1"
          >
            {coin.symbol.toUpperCase()}
          </Link>
        }
        secondary={coin.network.name}
      />
      <Stack direction="row" alignItems="center">
        <Box mr={1}>
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
                {parseFloat(truncateDecimal(totalBalance, 4))}{' '}
                {coin.symbol.toUpperCase()}
              </>
            ) : (
              '******'
            )}
          </Typography>
        </Box>
        <Box mr={1}>
          <Typography
            variant="body2"
            sx={(theme) => ({
              color:
                priceChange === 0
                  ? theme.palette.text.primary
                  : priceChange > 0
                  ? theme.palette.success.main
                  : theme.palette.error.main,
            })}
          >
            <FormattedNumber
              value={priceChange}
              style="percent"
              maximumFractionDigits={2}
              minimumFractionDigits={2}
            />
          </Typography>
        </Box>
      </Stack>
    </ListItem>
  );
}

export default memo(WalletCoinListItem);
