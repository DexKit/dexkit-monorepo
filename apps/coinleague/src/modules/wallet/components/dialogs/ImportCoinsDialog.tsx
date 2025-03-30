import AppDialogTitle from '@/modules/common/components/AppDialogTitle';
import AppErrorBoundary from '@/modules/common/components/AppErrorBoundary';
import { ChainId } from '@/modules/common/constants/enums';
import { parseChainId } from '@/modules/common/utils';
import { Error, Search } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  InputAdornment,
  MenuItem,
  NoSsr,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useSnackbar } from 'notistack';
import { Suspense, useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  coinsAtom,
  importedCoinsAtom,
  swapFavoriteCoinsAtom,
} from '../../atoms';
import { BLOCKCHAIN_NETWORKS } from '../../constants';
import { useAccounts, useRecentCoins } from '../../hooks';
import { BlockchainNetwork, Coin } from '../../types';
import { coinKey } from '../../utils';
import { SearchTextField } from '../SearchTextField';
import SelectCoinList from '../SelectCoinList';
import SelectCoinListSkeleton from '../SelectCoinListSkeleton';

interface Props {
  DialogProps: DialogProps;
}

export default function ImportCoinsDialog({ DialogProps }: Props) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const [keyword, setKeyword] = useState('');

  const recentCoins = useRecentCoins();

  const { accounts } = useAccounts({});

  const [chainId, setChainId] = useState<ChainId>();

  const [favoriteCoins, setFavoriteCoins] = useAtom(swapFavoriteCoinsAtom);

  const handleChange = (value: string) => {
    setKeyword(value);
  };

  const setImportedCoins = useUpdateAtom(importedCoinsAtom);

  const setCoins = useUpdateAtom(coinsAtom);

  const handleSelect = useCallback(
    (coin: Coin) => {
      recentCoins.add(coin);

      setImportedCoins((value) => {
        let temp = [...value];

        const coinFound = temp.find((c) => coinKey(c) === coinKey(coin));

        if (!coinFound) {
          temp.push({ ...coin, isHidden: false });
          enqueueSnackbar(
            formatMessage(
              {
                id: 'coin.coinName.imported.successfully',
                defaultMessage: 'Coin "{coinName}" imported successfully',
              },
              { coinName: coin.name }
            ),
            { variant: 'success' }
          );
        } else {
          enqueueSnackbar(
            formatMessage(
              {
                id: 'coin.coinName.is.already.imported',
                defaultMessage: 'Coin "{coinName}" is already imported',
              },
              { coinName: coin.name }
            ),
            { variant: 'error' }
          );
        }

        return temp;
      });

      setCoins((value) => {
        let temp = [...value];

        const coinFound = temp.find((c) => coinKey(c) === coinKey(coin));

        if (!coinFound) {
          temp.push({ ...coin, isHidden: false });
        }

        return temp;
      });

      handleClose();
    },
    [recentCoins]
  );

  const handleChangeChainId = (e: SelectChangeEvent) => {
    if (e.target.value === '') {
      setChainId(undefined);
    } else {
      setChainId(parseChainId(e.target.value));
    }
  };

  const handleMakeFavorite = useCallback((coin: Coin) => {
    setFavoriteCoins((coins: Coin[]) => {
      const tempCoins = [...coins];

      const index = tempCoins.findIndex(
        (c) =>
          c.network.id === coin.network.id &&
          c.decimals === coin.decimals &&
          c.coingeckoId === coin.coingeckoId &&
          coin.name === coin.name
      );

      if (index > -1) {
        tempCoins.splice(index, 1);
      } else {
        tempCoins.push(coin);
      }

      return tempCoins;
    });
  }, []);

  const handleClearRecentCoins = () => {
    recentCoins.clear(chainId);
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="import.coins" defaultMessage="Import Coins" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Select
              displayEmpty
              value={chainId ? String(chainId) : ''}
              onChange={handleChangeChainId}
            >
              <MenuItem value="">
                <FormattedMessage
                  id="all.networks"
                  defaultMessage="All Networks"
                />
              </MenuItem>
              {Object.keys(BLOCKCHAIN_NETWORKS)
                .map((key) => BLOCKCHAIN_NETWORKS[key])
                .map((n: BlockchainNetwork, index: number) => (
                  <MenuItem value={n.chainId}>{n.name}</MenuItem>
                ))}
            </Select>
            <SearchTextField
              onChange={handleChange}
              TextFieldProps={{
                fullWidth: true,
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
          </Stack>
        </Box>
        <Divider />
        <Stack spacing={2}>
          <NoSsr>
            <AppErrorBoundary
              fallbackRender={() => (
                <Box>
                  <Stack
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Error fontSize="large" />
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage id="error" defaultMessage="Error" />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="text.secondary"
                      >
                        <FormattedMessage
                          id="error.while.loading.coins"
                          defaultMessage="Error while loading coins"
                        />
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
            >
              <Suspense fallback={<SelectCoinListSkeleton />}>
                <SelectCoinList
                  recentCoins={recentCoins.coins}
                  accounts={accounts}
                  onSelect={handleSelect}
                  keyword={keyword}
                  chainId={chainId}
                  favoriteCoins={favoriteCoins}
                  onMakeFavorite={handleMakeFavorite}
                  onClearRecentCoins={handleClearRecentCoins}
                  enableBalance
                />
              </Suspense>
            </AppErrorBoundary>
          </NoSsr>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
