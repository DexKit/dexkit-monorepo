import { List } from '@mui/material';
import { useMemo } from 'react';
import {
  AccountBalance,
  Coin,
  CoinGeckoMarketsData,
  CoinPrices,
} from '../types';
import WalletCoinListItem from './WalletCoinListItem';

interface Props {
  coins: Coin[];
  balances: AccountBalance[];
  prices: CoinPrices;
  marketsData: CoinGeckoMarketsData;
  search: string;
  onMakeFavorite: (coin: Coin) => void;
}

export default function WalletCoinList({
  balances,
  coins,
  prices,
  search,
  marketsData,
  onMakeFavorite,
}: Props) {
  const filteredCoins = useMemo(() => {
    if (!search) {
      return coins;
    }
    return coins.filter(
      (c) =>
        c.name.toLowerCase().search(search.toLowerCase()) > -1 ||
        c.network.name.toLowerCase().search(search.toLowerCase()) > -1
    );
  }, [search, coins]);

  return (
    <List disablePadding>
      {filteredCoins.map((coin, index: number, arr) => (
        <WalletCoinListItem
          key={index}
          coin={coin}
          balances={balances}
          prices={prices}
          marketsData={marketsData}
          onMakeFavorite={onMakeFavorite}
          divider={index < arr.length - 1}
        />
      ))}
    </List>
  );
}
