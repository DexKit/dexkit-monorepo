import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';
import { ChainId } from '@/modules/common/constants/enums';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { PriceFeeds } from '../../constants';
import { Coin } from '../../types';
import { CoinList } from '../CoinList';

interface Props {
  chainId?: ChainId;
  dialogProps: DialogProps;
  selectMultiple?: boolean;
  maxCoins: number;
  selectedCoins: { [key: string]: Coin };
  excludeTokens: { [key: string]: Coin };
  onSave: (cois: { [key: string]: Coin }) => void;
}

export default function SelectCoinDialog({
  dialogProps,
  selectMultiple,
  selectedCoins,
  excludeTokens,
  maxCoins,
  chainId,
  onSave,
}: Props) {
  const { onClose } = dialogProps;
  const coins: Coin[] = chainId ? PriceFeeds[chainId] : [];

  const [coinList, setCoinList] = useState<{ [key: string]: Coin }>(
    selectedCoins
  );

  const selectCount = useMemo(() => {
    return Object.keys(coinList).length;
  }, [coinList]);

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  };

  const handleSelectCoin = (coin: Coin) => {
    setCoinList((coins) => {
      let newCoins: { [key: string]: Coin } = selectMultiple
        ? { ...coins }
        : {};

      if (coin.address in coins) {
        delete newCoins[coin.address];
      } else {
        newCoins[coin.address] = coin;
      }

      return newCoins;
    });
  };

  const handleSave = () => {
    onSave(coinList);
  };

  const filteredCoins = useMemo(() => {
    return coins.filter((c) => {
      return !(c.address in excludeTokens);
    });
  }, [excludeTokens]);

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          selectMultiple ? (
            <FormattedMessage id="select.coins" defaultMessage="Select coins" />
          ) : (
            <FormattedMessage id="select.coin" defaultMessage="Select coin" />
          )
        }
        onClose={handleClose}
      />
      <DialogContent dividers sx={{ p: 0 }}>
        <CoinList
          coins={filteredCoins}
          selectMultiple={selectMultiple}
          selectedCoins={coinList}
          onSelect={handleSelectCoin}
          isAllSelected={selectCount === maxCoins}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Typography variant="body1">
          <FormattedMessage
            id="you.selected.number.of.number"
            defaultMessage="You selected {selectCount} of {maxCoins}"
            values={{ selectCount, maxCoins }}
          />
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            disabled={selectCount < maxCoins}
            onClick={handleSave}
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>
          <Button onClick={handleClose}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
