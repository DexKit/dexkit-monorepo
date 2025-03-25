import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';

import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  List,
} from '@mui/material';
import { ethers } from 'ethers';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CoinTypes } from '../../constants/enums';
import { useCoins } from '../../hooks';
import { AccountBalance, Coin, CoinPrices } from '../../types';
import { SearchTextField } from '../SearchTextField';
import SelectCoinDialogListItem from './SelectCoinDialogListItem';

interface Props {
  dialogProps: DialogProps;
  onSelect: (coin: Coin) => void;
  removeZeroBalance?: boolean;
  balances?: AccountBalance[];
  prices: CoinPrices;
}

export default function SelectCoinDialog({
  dialogProps,
  removeZeroBalance,
  balances,
  onSelect,
  prices,
}: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const { coins } = useCoins();

  const [query, setQuery] = useState('');

  const filteredCoins = useMemo(() => {
    let newCoins = coins;

    if (query) {
      newCoins = coins.filter(
        (c) =>
          c.name.toLowerCase().search(query.toLowerCase()) > -1 ||
          c.network.name.toLowerCase().search(query.toLowerCase()) > -1
      );
    }

    if (removeZeroBalance && balances) {
      newCoins = newCoins.filter((coin) => {
        for (let balance of balances) {
          if (coin.coinType === CoinTypes.EVM_ERC20) {
            const value = balance.balances[coin.contractAddress];
            if (value && !value.isZero()) {
              return coin;
            }
          } else if (coin.coinType === CoinTypes.EVM_NATIVE) {
            const value = balance.balances[ethers.constants.AddressZero];

            if (value && !value.isZero()) {
              return coin;
            }
          }
        }
      });
    }

    return newCoins;
  }, [coins, removeZeroBalance, balances, query]);

  const handleChange = (value: string) => {
    setQuery(value);
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="select.coin" defaultMessage="Select coin" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <Box p={2}>
          <SearchTextField
            TextFieldProps={{
              label: (
                <FormattedMessage
                  id="search.for.coins"
                  defaultMessage="Search for coins"
                />
              ),
              fullWidth: true,
              size: 'small',
            }}
            onChange={handleChange}
          />
        </Box>
        <Divider />
        <List disablePadding>
          {filteredCoins.map((coin, index: number) => (
            <SelectCoinDialogListItem
              key={index}
              onClick={onSelect}
              coin={coin}
              balances={balances || []}
              prices={prices}
            />
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
