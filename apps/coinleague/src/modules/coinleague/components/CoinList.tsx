import { Box, List, TextField, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useThemeMode } from 'src/hooks/app';
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
  const theme = useTheme();
  const { mode: themeMode } = useThemeMode();
  const [coinFilter, setCoinFilter] = useState<string>();

  const filteredCoins = useMemo(() => {
    if (coinFilter) {
      const filter = coinFilter.toLowerCase();
      return coins.filter((coin) => {
        return (
          coin.base.toLowerCase().includes(filter) ||
          coin.baseName.toLowerCase().includes(filter) ||
          coin.address.toLowerCase().includes(filter)
        );
      });
    }
    return coins;
  }, [coins, coinFilter]);

  return (
    <>
      <Box
        p={1}
        position={'sticky'}
        top={0}
        zIndex={100000}
      >
        <TextField
          id="outlined-basic"
          fullWidth
          onChange={(ev) => setCoinFilter(ev.currentTarget.value)}
          label={
            <FormattedMessage
              id={'search.coin'}
              defaultMessage={'Search coin'}
            ></FormattedMessage>
          }
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: themeMode === 'dark' ? '#3c4148' : '#FAFAFA',
              '& fieldset': {
                borderColor: themeMode === 'dark' ? '#737372' : '#DCDCDC',
                borderWidth: themeMode === 'dark' ? '1px' : '1px',
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: themeMode === 'dark' ? '1px' : '1px',
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: themeMode === 'dark' ? '1px' : '1px',
              },
            },
            '& .MuiInputLabel-root': {
              color: themeMode === 'dark' ? '#737372' : '#737372',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: theme.palette.primary.main,
            },
            '& .MuiOutlinedInput-input': {
              color: themeMode === 'dark' ? '#fff' : '#0E1116',
            },
          }}
        />
      </Box>
      <List disablePadding>
        {filteredCoins.map((coin, index, arr) => (
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
    </>
  );
}
