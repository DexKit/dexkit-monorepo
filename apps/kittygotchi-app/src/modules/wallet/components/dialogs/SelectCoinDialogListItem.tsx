import { currencyAtom } from '@/modules/common/atoms';
import { ChainId } from '@/modules/common/constants/enums';
import { Token } from '@mui/icons-material';
import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { BigNumber, ethers } from 'ethers';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { CoinTypes } from '../../constants/enums';
import { useBalancesVisibility } from '../../hooks';
import { AccountBalance, Coin, CoinPrices } from '../../types';
import { TOKEN_ICON_URL } from '../../utils/token';

interface Props {
  onClick: (coin: Coin) => void;
  coin: Coin;
  balances: AccountBalance[];
  prices: CoinPrices;
}

export default function SelectCoinDialogListItem({
  onClick,
  coin,
  balances,
  prices,
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
            ]
          )
        );
      }

      return ethers.utils.formatUnits(total, coin.decimals);
    }

    return '0.0';
  }, [isErc20Coin, isEvmNativeCoin, balances, coin]);

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
            ]
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

  return (
    <ListItemButton onClick={() => onClick(coin)}>
      <ListItemAvatar>
        <Avatar
          src={
            coin.coinType === CoinTypes.EVM_ERC20
              ? TOKEN_ICON_URL(
                  coin.contractAddress,
                  coin.network.chainId as ChainId
                )
              : coin.imageUrl
          }
        >
          <Token />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={coin.name}
        secondary={
          <FormattedMessage
            id="coin.on.network"
            defaultMessage="{name} on {network}"
            values={{ name: coin.name, network: coin.network.name }}
          />
        }
      />
      <Box>
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
              {totalBalance} {coin.symbol.toUpperCase()}
            </>
          ) : (
            '******'
          )}
        </Typography>
      </Box>
    </ListItemButton>
  );
}
