import { ChainId } from '@/modules/common/constants/enums';
import { Token } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { useMemo } from 'react';
import { CoinTypes } from '../constants/enums';
import { Coin, Coins } from '../types';
import { coinKey } from '../utils';
import { TOKEN_ICON_URL } from '../utils/token';

interface Props {
  coin: Coin;
  divider?: boolean;
  selectedCoins: Coins;
  onSelect: (coin: Coin) => void;
}

export default function VisibleCoinsListItem({
  coin,
  divider,
  selectedCoins,
  onSelect,
}: Props) {
  const key = useMemo(() => {
    return coinKey(coin);
  }, [coin]);

  const handleClickSelect = () => {
    onSelect(coin);
  };

  return (
    <ListItem divider={divider}>
      <ListItemAvatar>
        <Avatar
          src={
            coin.imageUrl ??
            (coin.coinType === CoinTypes.EVM_ERC20
              ? TOKEN_ICON_URL(
                  coin.contractAddress,
                  coin.network.chainId as ChainId
                )
              : coin.imageUrl)
          }
        >
          <Token />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={coin.symbol.toUpperCase()}
        secondary={coin.network.name}
      />
      <Box>
        <Checkbox
          onClick={handleClickSelect}
          checked={Boolean(selectedCoins[key])}
        />
      </Box>
    </ListItem>
  );
}
