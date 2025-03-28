import { ERC20Abi } from '@/modules/coinleague/constants/abis';
import { isBalancesVisibleAtom } from '@/modules/common/atoms';
import { ChainId } from '@/modules/common/constants/enums';
import { NETWORKS } from '@/modules/common/constants/networks';
import { isAddressEqual } from '@/modules/common/utils';
import {
  useMutation,
  useQueries,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
  accountsAtom,
  coinsAtom,
  recentCoinsAtom,
  walletsAtom,
} from '../atoms';
import { COIN_LIST, EVM_NETWORKS } from '../constants';
import {
  AccountType,
  CoinTypes,
  Networks,
  WalletConnectType,
} from '../constants/enums';
import {
  getAccountsBalanceEvmByNetwork,
  getCoinPrices,
  getPricesByChain,
} from '../services';
import { getCoinMarketData } from '../services/balances';
import {
  Account,
  Coin,
  CoinPrices,
  Erc20Coin,
  EvmCoin,
  Wallet,
} from '../types';
import { coinKey } from '../utils';

export function useCoins() {
  const coins = useAtomValue(coinsAtom);

  const sortedCoins = useMemo(() => {
    return coins.sort((a, b) => {
      if (a.isFavorite) {
        return -1;
      } else if (b.isFavorite) {
        return 1;
      }
      return 0;
    });
  }, [coins]);

  const evmCoins: EvmCoin[] = useMemo(() => {
    return sortedCoins.filter(
      (c) =>
        c.coinType === CoinTypes.EVM_ERC20 ||
        c.coinType === CoinTypes.EVM_NATIVE
    ) as EvmCoin[];
  }, [sortedCoins]);

  return { coins: sortedCoins, evmCoins };
}

export function useCoin({
  network,
  symbol,
  address,
}: {
  network?: string;
  symbol?: string;
  address?: string;
}) {
  const isEvmNetwork = network && EVM_NETWORKS.includes(network as Networks);

  return COIN_LIST.find((c) => {
    const isSameNetwork = c.network.id === network;

    if (isEvmNetwork) {
      const evmCoin: EvmCoin = c as EvmCoin;

      if (evmCoin.coinType === CoinTypes.EVM_ERC20) {
        return (
          isSameNetwork && isAddressEqual(evmCoin.contractAddress, address)
        );
      }
    }

    return isSameNetwork && c.symbol === symbol;
  });
}

export function useWallets() {
  const [wallets, setWallets] = useAtom(walletsAtom);

  const addWallet = useCallback((wallet: Wallet) => {
    setWallets((value) => [...value, wallet]);
  }, []);

  return { wallets, addWallet };
}

export function useAccounts({}) {
  const [accounts, setAccounts] = useAtom(accountsAtom);
  const { formatMessage } = useIntl();

  const addAccount = useCallback((account: Account, noThrow?: boolean) => {
    setAccounts((accounts) => {
      if (accounts.find((a) => isAddressEqual(a.address, account.address))) {
        if (!noThrow) {
          throw new Error(
            formatMessage({
              id: 'account.already.exists',
              defaultMessage: 'Account already exists',
            })
          );
        }
      }

      return [...accounts, account];
    });
  }, []);

  const updateConnector = useCallback(
    (address: string, connector: WalletConnectType) => {
      setAccounts((accounts) => {
        const newAccounts = [...accounts];

        const account = accounts.find((a) =>
          isAddressEqual(a.address, address)
        );

        if (!account) {
          throw new Error(
            formatMessage({
              id: 'account.already.exists',
              defaultMessage: 'Account does not exists',
            })
          );
        }

        account.connector = connector;

        return newAccounts;
      });
    },
    []
  );

  const updateName = useCallback((address: string, name: string) => {
    setAccounts((accounts) => {
      const newAccounts = [...accounts];

      const account = accounts.find((a) => isAddressEqual(a.address, address));

      if (!account) {
        throw new Error(
          formatMessage({
            id: 'account.already.exists',
            defaultMessage: 'Account does not exists',
          })
        );
      }

      account.name = name;

      return newAccounts;
    });
  }, []);

  const removeAccount = useCallback(
    (account: Account) => {
      const index = accounts.findIndex(
        (a) =>
          isAddressEqual(a.address, account.address) && a.type === account.type
      );

      const newAccounts = [...accounts];

      if (index > -1) {
        newAccounts.splice(index, 1);
        setAccounts(newAccounts);
      }
    },
    [accounts]
  );

  const evmAccounts = useMemo(() => {
    return accounts.filter((account) => account.type === AccountType.EVM);
  }, [accounts]);

  return {
    accounts,
    evmAccounts,
    addAccount,
    updateName,
    removeAccount,
    updateConnector,
  };
}

export function useEvmTransferMutation({
  provider,
  onSubmit,
}: {
  provider?: ethers.providers.Web3Provider;
  onSubmit?: (
    hash: string,
    params: {
      address: string;
      amount: number;
      coin: Coin;
    }
  ) => void;
}) {
  return useMutation(
    async (params: { coin: EvmCoin; amount: number; address: string }) => {
      const { coin, amount, address } = params;

      if (!provider) {
        return;
      }

      if (coin.coinType === CoinTypes.EVM_ERC20) {
        const contract = new ethers.Contract(
          coin.contractAddress,
          ERC20Abi,
          provider.getSigner()
        );

        const tx = await contract.transfer(
          address,
          ethers.utils.parseUnits(amount.toString(), coin.decimals)
        );

        if (onSubmit) {
          onSubmit(tx.hash, params);
        }

        return await tx.wait();
      }
    }
  );
}

const GET_ACCOUNTS_BALANCE_QUERY = 'GET_ACCOUNTS_BALANCE_QUERY';

export function useWalletBalances({
  accounts,
  coins,
}: {
  accounts: Account[];
  coins: Coin[];
}) {
  const queries = useMemo(() => {
    const evmAccounts = accounts
      .filter((a) => a.type === AccountType.EVM)
      .map((a) => a.address);

    const evmCoins = coins.filter((c) =>
      [CoinTypes.EVM_NATIVE, CoinTypes.EVM_ERC20].includes(c.coinType)
    );

    const evmNetworks = new Set(
      evmCoins
        .map((c) => c.network)
        .filter((n) => {
          return n && EVM_NETWORKS.includes(n.id as Networks);
        })
    ).values();

    const results: Set<any> = new Set();

    for (const network of evmNetworks) {
      let networkCoins = evmCoins.filter((c) => c.network.id === network.id);

      // BUG: verify why is creating 3 queries
      const promise = getAccountsBalanceEvmByNetwork(
        network,
        networkCoins as EvmCoin[],
        evmAccounts
      );

      results.add({
        queryKey: [GET_ACCOUNTS_BALANCE_QUERY, network, accounts, networkCoins],
        queryFn: async () => promise,
        staleTime: Infinity,
      });
    }

    return Array.from(results);
  }, [accounts, coins]);

  const resultQueries: UseQueryResult<any>[] = useQueries({ queries });

  const result = resultQueries
    .filter((query) => query.isSuccess && query.data !== undefined)
    .map((q) => q.data)
    .reduce((prev, next) => [...(prev || []), ...(next || [])], []);

  return Array.from<any>(new Set(result));
}

export const EMV_COIN_PRICES_QUERY = 'EMV_COIN_PRICES_QUERY';
export const EMV_COIN_PRICES_QUERY_NATIVE = 'EMV_COIN_PRICES_QUERY_NATIVE';

export function useEvmCoinPrices({
  currency,
  coins,
}: {
  coins: Coin[];
  currency: string;
}) {
  const queries = useMemo(() => {
    const chains = Array.from(
      new Set(
        coins
          .filter(
            (c) =>
              [CoinTypes.EVM_ERC20, CoinTypes.EVM_NATIVE].includes(
                c.coinType
              ) && c.network.chainId
          )
          .map((c) => NETWORKS[c.network.chainId || 0])
      ).keys()
    );

    const nativeCoins = coins.filter(
      (c) => c.coinType === CoinTypes.EVM_NATIVE
    );

    return [
      ...chains.map((n) => {
        const coinAddresses = coins
          .filter(
            (c) =>
              c.network.chainId === n.chainId &&
              c.coinType === CoinTypes.EVM_ERC20
          )
          .map((c) => (c as Erc20Coin).contractAddress);
        return {
          queryFn: async () =>
            await getPricesByChain(n, coinAddresses, currency),
          queryKey: [EMV_COIN_PRICES_QUERY, n, coinAddresses, currency],
          staleTime: Infinity,
          refetchInterval: 10000,
        };
      }),
      {
        queryFn: async () =>
          await getCoinPrices({
            coins: nativeCoins,
            currency,
          }),
        queryKey: [EMV_COIN_PRICES_QUERY_NATIVE, chains, nativeCoins, currency],
        staleTime: Infinity,
        refetchInterval: 10000,
      },
    ];
  }, [coins, currency]);

  const query = useQueries({ queries });

  const result = useMemo<CoinPrices>(() => {
    return query
      .filter((r) => r.isSuccess)
      .map((r) => r.data)
      .reduce((prev: any, curr: any) => {
        const cp = { ...prev };

        const keys = new Set([...Object.keys(curr), ...Object.keys(prev)]);

        let newObj: any = {};

        for (let key of keys) {
          newObj[key] = { ...cp[key], ...curr[key] };
        }

        return newObj;
      }, {});
  }, [query]);

  return result;
}

export function useBalancesVisibility() {
  const [isVisible, setIsVisible] = useAtom(isBalancesVisibleAtom);

  const handleToggle = useCallback(() => {
    setIsVisible((value) => !value);
  }, []);

  return { handleToggle, isVisible };
}

export const COIN_MARKET_DATA_QUERY = 'COIN_MARKET_DATA_QUERY';

export function useCoinsMarketData({
  coins,
  currency,
}: {
  coins: Coin[];
  currency: string;
}) {
  return useQuery([COIN_MARKET_DATA_QUERY, coins, currency], async () => {
    return getCoinMarketData({
      ids: Array.from(
        new Set(coins.map((c) => c.coingeckoId)).values()
      ) as string[],
      currency,
    });
  });
}

export function useRecentCoins() {
  const [recentCoins, setRecentCoins] = useAtom(recentCoinsAtom);

  const add = useCallback((coin: Coin) => {
    setRecentCoins((recentCoins) => {
      let copyRecentCoins = [...recentCoins];
      let recentCoin = recentCoins.find(
        (r) => coinKey(r.coin) === coinKey(coin)
      );

      if (recentCoin) {
        recentCoin.count = recentCoin.count + 1;
      } else {
        copyRecentCoins.push({ coin, count: 1 });
      }

      return copyRecentCoins;
    });
  }, []);

  const clear = useCallback((chainId?: ChainId) => {
    setRecentCoins((coins) => {
      if (chainId) {
        return [...coins.filter((c) => c.coin.network.chainId !== chainId)];
      }

      return [];
    });
  }, []);

  const coins = useMemo(() => {
    return recentCoins
      .sort((a, b) => {
        if (a.count > b.count) {
          return -1;
        } else if (a.count < b.count) {
          return 1;
        }

        return 0;
      })
      .map((c) => c.coin);
  }, [recentCoins]);

  return {
    coins,
    add,
    clear,
  };
}
