import { ChainId } from '@/modules/common/constants/enums';
import { DkApiPlatformCoin } from '@/modules/common/types/api';
import {
  getNetworkSlugFromChainId,
  isAddressEqual,
} from '@/modules/common/utils';
import Close from '@mui/icons-material/Close';
import TipsAndUpdates from '@mui/icons-material/TipsAndUpdates';
import {
  Box,
  Button,
  Divider,
  List,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material';
import { BigNumber, ethers } from 'ethers';
import { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { CoinTypes } from '../constants/enums';
import { useCoins, useWalletBalances } from '../hooks';
import { usePlatformCoinSearch } from '../hooks/swap';
import { Account, Coin, EvmCoin } from '../types';
import { getBlockchainNetworkByChainId } from '../utils';
import SelectCoinListItem from './SelectCoinListItem';

const isFavorite = (coin: Coin, favoriteCoins: Coin[]) => {
  const index = favoriteCoins.findIndex(
    (c) =>
      c.network.id === coin.network.id &&
      c.decimals === coin.decimals &&
      c.coingeckoId === coin.coingeckoId &&
      coin.name === coin.name
  );

  return index > -1;
};

interface Props {
  keyword?: string;
  chainId?: ChainId;
  accounts: Account[];
  recentCoins?: Coin[];
  onSelect: (coin: Coin) => void;
  onMakeFavorite?: (coin: Coin) => void;
  onClearRecentCoins?: () => void;
  favoriteCoins: Coin[];
  enableRecent?: boolean;
  enableFavorites?: boolean;
  enableBalance?: boolean;
}

function SelectCoinList({
  keyword,
  accounts,
  onSelect,
  onMakeFavorite,
  onClearRecentCoins,
  favoriteCoins,
  chainId,
  recentCoins,
  enableRecent,
  enableBalance,
  enableFavorites,
}: Props) {
  const { evmCoins } = useCoins();

  const network = useMemo(() => {
    return getNetworkSlugFromChainId(chainId) ?? '';
  }, [chainId]);

  const coinSearchQuery = usePlatformCoinSearch({ keyword, network });

  const coins = useMemo(() => {
    if (coinSearchQuery.data) {
      let coins = coinSearchQuery.data
        .filter((c) => Boolean(getBlockchainNetworkByChainId(c.chainId)))
        .map((c: DkApiPlatformCoin) => {
          return {
            coinType: CoinTypes.EVM_ERC20,
            decimals: c.decimals,
            contractAddress: c.address,
            name: c.coin?.name,
            network: getBlockchainNetworkByChainId(c.chainId),
            coingeckoId: c.coin?.coingeckoId,
            symbol: c.coin?.symbol,
            imageUrl: c.coin?.logoUrl,
          } as EvmCoin;
        });

      if (network) {
        coins = [...evmCoins.filter((c) => c.network.id === network), ...coins];
      }

      if (recentCoins) {
        coins = [
          ...(recentCoins.filter((c) => c.network.id === network) as EvmCoin[]),
          ...coins,
        ];
      }

      if (keyword) {
        coins = coins.filter(
          (c) =>
            c.name.toLowerCase().search(keyword?.toLowerCase()) > -1 ||
            c.symbol.toLowerCase().search(keyword?.toLowerCase()) > -1 ||
            (c.coinType === CoinTypes.EVM_ERC20 &&
              c.contractAddress.toLowerCase().search(keyword?.toLowerCase()) >
                -1)
        );
      }

      return coins.reduce<EvmCoin[]>((acc, current) => {
        if (current.coinType === CoinTypes.EVM_ERC20) {
          const found =
            acc.find(
              (c) =>
                c.coinType === CoinTypes.EVM_ERC20 &&
                isAddressEqual(c.contractAddress, current.contractAddress)
            ) !== undefined;

          if (!found) {
            acc.push(current);
          }
        }
        return acc;
      }, []);
    }

    return [];
  }, [coinSearchQuery.data, network, keyword, evmCoins]);

  const balances = useWalletBalances({
    accounts: enableBalance ? accounts : [],
    coins: enableBalance ? coins : [],
  });

  const recentCoinsBalances = useWalletBalances({
    accounts: enableBalance ? accounts : [],
    coins: enableRecent ? recentCoins ?? [] : [],
  });

  const results = useMemo(() => {
    return coins
      .map((coin: Coin) => {
        const isErc20Coin = coin.coinType === CoinTypes.EVM_ERC20;
        const isEvmNativeCoin = coin.coinType === CoinTypes.EVM_NATIVE;

        const totalBalance = (() => {
          if (isErc20Coin || isEvmNativeCoin) {
            let total = BigNumber.from(0);

            for (const coinBalance of balances.filter(
              (b) => b.network.id === coin.network.id
            )) {
              total = total.add(
                BigNumber.from(
                  coinBalance.balances[
                    isErc20Coin
                      ? coin.contractAddress
                      : ethers.constants.AddressZero
                  ] || '0'
                )
              );
            }

            return ethers.utils.formatUnits(total, coin.decimals);
          }

          return '0.0';
        })();

        return { coin, totalBalance };
      })
      .sort((a, b) => {
        const ra = parseFloat(a.totalBalance);
        const rb = parseFloat(b.totalBalance);

        if (ra > rb) {
          return -1;
        } else if (ra < rb) {
          return 1;
        }

        return 0;
      });
  }, [coins, balances, network]);

  const recentCoinsResults = useMemo(() => {
    let coins = recentCoins;

    if (chainId) {
      coins = coins?.filter((c) => c.network.chainId === chainId);
    }

    return coins?.map((coin: Coin) => {
      const isErc20Coin = coin.coinType === CoinTypes.EVM_ERC20;
      const isEvmNativeCoin = coin.coinType === CoinTypes.EVM_NATIVE;

      const totalBalance = (() => {
        if (isErc20Coin || isEvmNativeCoin) {
          let total = BigNumber.from(0);

          for (const coinBalance of recentCoinsBalances.filter(
            (b) => b.network.id === coin.network.id
          )) {
            total = total.add(
              BigNumber.from(
                coinBalance.balances[
                  isErc20Coin
                    ? coin.contractAddress
                    : ethers.constants.AddressZero
                ] || '0'
              )
            );
          }

          return ethers.utils.formatUnits(total, coin.decimals);
        }

        return '0.0';
      })();

      return { coin, totalBalance };
    });
  }, [recentCoins, recentCoinsBalances, chainId]);

  if (results.length === 0) {
    return (
      <Box py={2}>
        <Stack spacing={2} alignItems="center" justifyContent="center">
          <TipsAndUpdates fontSize="large" />
          <Box>
            <Typography align="center" variant="h5">
              <FormattedMessage id="no.coins" defaultMessage="No coins" />
            </Typography>
            <Typography color="text.secondary" align="center" variant="body1">
              <FormattedMessage
                id="no.coins.found"
                defaultMessage="No coins found"
              />
            </Typography>
          </Box>
        </Stack>
      </Box>
    );
  }

  return (
    <List disablePadding subheader={<li />}>
      {enableRecent && recentCoinsResults && recentCoinsResults?.length > 0 && (
        <>
          <ListSubheader disableSticky sx={{ display: 'block' }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <FormattedMessage id="recent" defaultMessage="Recent" />
              </Box>
              <Box>
                <Button
                  onClick={onClearRecentCoins}
                  color="inherit"
                  startIcon={<Close />}
                  size="small"
                >
                  <FormattedMessage id="clear" defaultMessage="Clear" />
                </Button>
              </Box>
            </Stack>
          </ListSubheader>
          <Divider />
          {recentCoinsResults?.map(({ coin, totalBalance }, index: number) => (
            <SelectCoinListItem
              onSelect={onSelect}
              coin={coin}
              key={index}
              balance={totalBalance}
              chainId={chainId}
              enableBalance={enableBalance}
              isFavorite={isFavorite(coin, favoriteCoins)}
            />
          ))}
          <Divider />
        </>
      )}
      {results.map(({ coin, totalBalance }, index: number) => (
        <SelectCoinListItem
          onSelect={onSelect}
          coin={coin}
          key={index}
          balance={totalBalance}
          chainId={chainId}
          enableBalance={enableBalance}
          isFavorite={isFavorite(coin, favoriteCoins)}
          onMakeFavorite={enableFavorites ? onMakeFavorite : undefined}
        />
      ))}
    </List>
  );
}

export default memo(SelectCoinList);
