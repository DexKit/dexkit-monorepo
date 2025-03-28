import { ChainId } from '@/modules/common/constants/enums';
import { getChainName } from '@/modules/common/utils';
import { Coin } from '@/modules/wallet/types';
import { Star } from '@mui/icons-material';
import {
  Avatar,
  Box,
  IconButton,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { memo } from 'react';
import { CoinTypes } from '../constants/enums';
import { useBalancesVisibility } from '../hooks';
import { TOKEN_ICON_URL } from '../utils/token';

interface Props {
  coin: Coin;
  balance: string;
  onSelect: (coin: Coin) => void;
  onMakeFavorite?: (coin: Coin) => void;
  enableBalance?: boolean;
  isFavorite?: boolean;
  chainId?: ChainId;
}

function SelectCoinListItem({
  coin,
  balance,
  onSelect,
  chainId,
  isFavorite,
  onMakeFavorite,
  enableBalance,
}: Props) {
  const { isVisible } = useBalancesVisibility();

  const renderItem = () => {
    return (
      <>
        {onMakeFavorite && (
          <Box mr={2}>
            <IconButton
              sx={{
                color: (theme) =>
                  isFavorite
                    ? theme.palette.primary.main
                    : theme.palette.action.hover,
              }}
              onClick={() => onMakeFavorite(coin)}
              size="small"
            >
              <Star />
            </IconButton>
          </Box>
        )}

        <ListItemAvatar>
          <Link color="inherit" href="#" onClick={() => onSelect(coin)}>
            <Avatar
              src={
                coin.coinType === CoinTypes.EVM_ERC20 && !coin.imageUrl
                  ? TOKEN_ICON_URL(coin.contractAddress, coin.network.chainId)
                  : coin.imageUrl
              }
            />
          </Link>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Link color="inherit" href="#" onClick={() => onSelect(coin)}>
              {coin.symbol.toUpperCase()}
            </Link>
          }
          secondary={getChainName(coin.network.chainId)}
        />
        {enableBalance && (
          <Box ml={2} title={balance}>
            <Box
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: (theme) => theme.spacing(8),
              }}
            >
              {isVisible ? balance : '****'}
            </Box>
          </Box>
        )}
      </>
    );
  };

  if (onMakeFavorite) {
    return <ListItem>{renderItem()}</ListItem>;
  }

  return (
    <ListItemButton onClick={() => onSelect(coin)}>
      {renderItem()}
    </ListItemButton>
  );
}

export default memo(SelectCoinListItem);
