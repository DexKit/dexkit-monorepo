import { List } from '@mui/material';
import { Coin } from '../types';
import GameCoinListItem from './GameCoinListItem';

interface Props {
  coins: Coin[];
  onRemove: (coin: Coin) => void;
}

export default function GameCoinList({ coins, onRemove }: Props) {
  return (
    <List disablePadding>
      {coins.map((coin, index, arr) => (
        <GameCoinListItem
          key={index}
          coin={coin}
          onRemove={onRemove}
          divider={index < arr.length - 1}
        />
      ))}
    </List>
  );
}
