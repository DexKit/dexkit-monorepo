import { List } from '@mui/material';
import { Coin } from '../types';
import CoinListItem from './CoinListItem';

interface Props {
  coins: Coin[];
  selectMultiple?: boolean;
  selectedCoins: { [key: string]: Coin };
  onSelect: (coin: Coin) => void;
  isAllSelected: boolean;
}

export function CoinList({
  coins,
  selectMultiple,
  selectedCoins,
  isAllSelected,
  onSelect,
}: Props) {
  return (
    <List disablePadding>
      {coins.map((coin, index, arr) => (
        <CoinListItem
          key={index}
          coin={coin}
          disabled={!(coin.address in selectedCoins) && isAllSelected}
          selectMultiple={selectMultiple}
          onSelect={onSelect}
          selected={coin.address in selectedCoins}
          divider={index === arr.length - 1}
        />
      ))}
    </List>
  );
}
