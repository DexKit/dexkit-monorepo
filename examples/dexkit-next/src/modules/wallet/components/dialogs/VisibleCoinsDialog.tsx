import AppDialogTitle from '@/modules/common/components/AppDialogTitle';
import { ImportExport, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { coinsAtom } from '../../atoms';
import { BLOCKCHAIN_NETWORKS } from '../../constants';
import { Coin, Coins } from '../../types';
import { coinKey } from '../../utils';
import { SearchTextField } from '../SearchTextField';
import VisibleCoinsList from '../VisibleCoinsList';

interface Props {
  DialogProps: DialogProps;
  onImport?: () => void;
}

export default function VisibleCoinsDialog({ DialogProps, onImport }: Props) {
  const { onClose, open } = DialogProps;

  const [usedCoins, setUsedCoins] = useAtom(coinsAtom);

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }

    setSelectedCoins({});
    setSelectedNetwork('');
    setQuery(undefined);
  };

  const [query, setQuery] = useState<string>();

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const { formatMessage } = useIntl();
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');

  const [selectedCoins, setSelectedCoins] = useState<Coins>({});

  const handleSelectNetwork = (event: SelectChangeEvent) => {
    if (selectedNetwork === event.target.value) {
      setSelectedNetwork('');
    } else {
      setSelectedNetwork(event.target.value);
    }
  };

  const handleSelectCoin = (coin: Coin) => {
    const key = coinKey(coin);

    if (key in selectedCoins) {
      let selectedCoinsCopy = { ...selectedCoins };

      delete selectedCoinsCopy[key];

      setSelectedCoins(selectedCoinsCopy);
    } else {
      setSelectedCoins((value) => ({ ...value, [key]: coin }));
    }
  };

  const handleConfirm = () => {
    const c = Object.values(selectedCoins);

    setUsedCoins(c);
    handleClose();
  };

  useEffect(() => {
    if (open) {
      let obj: { [key: string]: Coin } = {};

      for (const c of usedCoins) {
        obj[coinKey(c)] = c;
      }

      setSelectedCoins(obj);
    }
  }, [open]);

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="visible.coins" defaultMessage="Visible coins" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            <SearchTextField
              onChange={handleChange}
              TextFieldProps={{
                fullWidth: true,
                size: 'small',
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                },
                placeholder: formatMessage({
                  id: 'search.for.a.coin',
                  defaultMessage: 'Search for a coin',
                }),
              }}
            />
            <Select
              displayEmpty
              value={selectedNetwork}
              onChange={handleSelectNetwork}
            >
              <MenuItem value="">
                <FormattedMessage id="all" defaultMessage="All" />
              </MenuItem>
              {Object.keys(BLOCKCHAIN_NETWORKS).map((key) => (
                <MenuItem
                  key={BLOCKCHAIN_NETWORKS[key].id}
                  value={BLOCKCHAIN_NETWORKS[key].id}
                >
                  {BLOCKCHAIN_NETWORKS[key].name}
                </MenuItem>
              ))}
            </Select>
            <Box>
              <Button
                onClick={onImport}
                startIcon={<ImportExport />}
                size="small"
                variant="outlined"
              >
                <FormattedMessage id="import" defaultMessage="Import" />
              </Button>
            </Box>
          </Stack>
        </Box>
        <Divider />
        <VisibleCoinsList
          onSelect={handleSelectCoin}
          query={query}
          network={selectedNetwork}
          selectedCoins={selectedCoins}
        />
      </DialogContent>

      <Divider />
      <DialogActions>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
