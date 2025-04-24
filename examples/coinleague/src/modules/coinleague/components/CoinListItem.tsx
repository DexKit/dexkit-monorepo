import CheckCircle from '@mui/icons-material/CheckCircle';
import TokenIcon from '@mui/icons-material/Token';
import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { memo } from 'react';
import { Coin } from '../types';

interface Props {
  coin: Coin;
  selectMultiple?: boolean;
  onSelect: (coins: Coin) => void;
  selected?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

function CoinListItem({
  coin,
  selectMultiple,
  onSelect,
  selected,
  disabled,
  divider,
}: Props) {
  const handleSelect = () => {
    onSelect(coin);
  };

  return (
    <ListItemButton
      disabled={disabled}
      selected={selected}
      onClick={handleSelect}
    >
      <ListItemAvatar>
        <Avatar src={coin.logo}>
          <TokenIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={coin.baseName} secondary={coin.base} />
      <ListItemSecondaryAction>
        <Box alignItems="center" alignContent="center" display="flex">
          {selected && <CheckCircle color="primary" />}
        </Box>
      </ListItemSecondaryAction>
    </ListItemButton>
  );
}

export default memo(CoinListItem);
