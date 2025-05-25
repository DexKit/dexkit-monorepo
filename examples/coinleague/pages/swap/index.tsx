import type { NextPage } from 'next';

import MainLayout from '@/modules/common/components/layouts/MainLayout';

import { Box, Divider, NoSsr, Stack, Typography } from '@mui/material';
import { NextSeo } from 'next-seo';
import { FormattedMessage, useIntl } from 'react-intl';

import { SearchTextField } from '@/modules/wallet/components/SearchTextField';

const SelectCoinList = dynamic(
  () => import('@/modules/wallet/components/SelectCoinList')
);

import AppErrorBoundary from '@/modules/common/components/AppErrorBoundary';
import { ChainId } from '@/modules/common/constants/enums';
import { swapFavoriteCoinsAtom } from '@/modules/wallet/atoms';
import FeaturedCoinsChips from '@/modules/wallet/components/FeaturedCoinsChips';
import SelectCoinListSkeleton from '@/modules/wallet/components/SelectCoinListSkeleton';
import { useAccounts, useRecentCoins } from '@/modules/wallet/hooks';
import { Coin } from '@/modules/wallet/types';
import { Error } from '@mui/icons-material';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import { Suspense, useCallback, useState } from 'react';

const SwapPage: NextPage = () => {
  const { formatMessage } = useIntl();

  const [keyword, setKeyword] = useState('');

  const recentCoins = useRecentCoins();

  const handleChange = (value: string) => {
    setKeyword(value);
  };

  const handleSelect = useCallback(
    (coin: Coin) => {
      recentCoins.add(coin);
    },
    [recentCoins]
  );

  const { accounts } = useAccounts({});

  const [chainId, setChainId] = useState<ChainId>();

  const [favoriteCoins, setCoins] = useAtom(swapFavoriteCoinsAtom);

  const handleMakeFavorite = useCallback((coin: Coin) => {
    setCoins((coins: Coin[]) => {
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
    <>
      <NextSeo
        title={formatMessage({
          id: 'swap',
          defaultMessage: 'Swap',
        })}
      />
      <MainLayout>
        <Stack spacing={2}>
          <SearchTextField onChange={handleChange} TextFieldProps={{}} />
          {chainId && (
            <FeaturedCoinsChips chainId={chainId} onSelect={handleSelect} />
          )}
          <Divider />
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
                  enableRecent
                  enableFavorites
                />
              </Suspense>
            </AppErrorBoundary>
          </NoSsr>
        </Stack>
      </MainLayout>
    </>
  );
};

export default SwapPage;
