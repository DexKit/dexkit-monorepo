import { Delete } from '@mui/icons-material';
import TokenIcon from '@mui/icons-material/Token';
import {
  Avatar,
  IconButton,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { memo } from 'react';
import { Coin } from '../types';

interface Props {
  coin: Coin;
  onRemove: (coins: Coin) => void;
  disabled?: boolean;
  divider?: boolean;
}

function GameCoinListItem({ coin, onRemove, disabled, divider }: Props) {
  const handleRemove = () => {
    onRemove(coin);
  };

  return (
    <ListItemButton divider={divider} disabled={disabled}>
      <ListItemAvatar>
        <Avatar src={coin.logo}>
          <TokenIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={coin.baseName} secondary={coin.base} />
      <ListItemSecondaryAction>
        <IconButton onClick={handleRemove}>
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItemButton>
  );
}

export default memo(GameCoinListItem);
