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

  const isDarkMode = themeMode === 'dark';

  const inputBackgroundColor = isDarkMode
    ? theme.colorSchemes?.dark?.palette?.background?.paper || theme.palette.background.paper
    : theme.colorSchemes?.light?.palette?.background?.paper || theme.palette.background.paper;

  const borderColor = isDarkMode
    ? theme.colorSchemes?.dark?.palette?.divider || theme.palette.divider
    : theme.colorSchemes?.light?.palette?.divider || theme.palette.divider;

  const labelColor = isDarkMode
    ? theme.colorSchemes?.dark?.palette?.text?.secondary || theme.palette.text.secondary
    : theme.colorSchemes?.light?.palette?.text?.secondary || theme.palette.text.secondary;

  const inputTextColor = isDarkMode
    ? theme.colorSchemes?.dark?.palette?.text?.primary || theme.palette.text.primary
    : theme.colorSchemes?.light?.palette?.text?.primary || theme.palette.text.primary;

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
              backgroundColor: inputBackgroundColor,
              '& fieldset': {
                borderColor: borderColor,
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '1px',
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '1px',
              },
            },
            '& .MuiInputLabel-root': {
              color: labelColor,
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: theme.palette.primary.main,
            },
            '& .MuiOutlinedInput-input': {
              color: inputTextColor,
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
