import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '@/modules/common/constants';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { SwappableAssetV4 } from '@traderxyz/nft-swap-sdk';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useCallback } from 'react';

import {
  getERC20Balances,
  getERC20WithProxyUnlockedBalances,
} from '@/modules/wallet/services/balances';

import { ERC20Abi } from '@/modules/coinleague/constants/abis';
import { useCoins } from '.';
import { Token, TokenBalance } from '../types/swap';
import { coinsToEvmTokens } from '../utils/token';
import { useCoinList } from './blockchain';

export const GET_ERC20_BALANCES = 'GET_ERC20_BALANCES';
export const GET_ERC20_BALANCE = 'GET_ERC20_BALANCE';
export const GET_NATIVE_BALANCE = 'GET_NATIVE_BALANCES';

type SelectCalback = (data?: TokenBalance[]) => TokenBalance[] | undefined;

export const selectNativeCurrency: SelectCalback = (data?: TokenBalance[]) =>
  data?.filter((t) => t.token.address === ZEROEX_NATIVE_TOKEN_ADDRESS);

export const useERC20BalancesQuery = (select?: SelectCalback) => {
  const { provider, account, chainId } = useWeb3React();

  const tokens = useCoinList({ chainId, includeNative: true });

  return useQuery(
    [GET_ERC20_BALANCES, account, chainId, tokens],
    () => {
      if (
        provider === undefined ||
        account === undefined ||
        chainId === undefined ||
        tokens === undefined
      ) {
        return;
      }
      if (tokens.length === 0) {
        return [];
      }
      return getERC20Balances(account, tokens, chainId, provider);
    },
    { enabled: provider !== undefined, select, suspense: true }
  );
};

export const useERC20BalancesProxyAllowancesQuery = (
  select?: SelectCalback
) => {
  const { provider, account, chainId } = useWeb3React();

  const { evmCoins } = useCoins();

  return useQuery(
    [GET_ERC20_BALANCES, account, chainId, evmCoins],
    async () => {
      if (
        provider === undefined ||
        account === undefined ||
        chainId === undefined ||
        evmCoins === undefined
      ) {
        return;
      }

      if (evmCoins.length === 0) {
        return [];
      }

      const tokens = coinsToEvmTokens(evmCoins);

      const res = getERC20WithProxyUnlockedBalances(
        account,
        tokens,
        chainId,
        provider
      );

      return res;
    },
    { enabled: provider !== undefined, select, suspense: false }
  );
};

export const useSelectNativeBalancesQuery = () => {
  return useERC20BalancesQuery(selectNativeCurrency);
};

export const useSelectERC20BalancesQuery = (tokens: Token[]) => {
  const filterTokensCallback = useCallback(
    (data?: TokenBalance[]) => data?.filter((t) => tokens.includes(t.token)),
    [tokens]
  );

  return useERC20BalancesQuery(filterTokensCallback);
};

// We use this if we need only to return the native balance
export const useNativeBalanceQuery = () => {
  const { provider, account, chainId } = useWeb3React();
  return useQuery(
    [GET_NATIVE_BALANCE, account, chainId],
    async () => {
      if (
        provider === undefined ||
        account === undefined ||
        chainId === undefined
      ) {
        return;
      }

      return await provider.getBalance(account);
    },
    { enabled: provider !== undefined }
  );
};

// We use this if we need only a token balance
export const useERC20BalanceQuery = (token: Token) => {
  const { provider, account, chainId } = useWeb3React();
  return useQuery(
    [GET_ERC20_BALANCE, account, chainId],
    async () => {
      if (
        provider === undefined ||
        account === undefined ||
        chainId === undefined
      ) {
        return;
      }
      const balances = await getERC20Balances(
        account,
        [token],
        chainId,
        provider
      );
      return balances.filter((tb) => tb.token === token)[0];
    },
    { enabled: provider !== undefined }
  );
};

export function useErc20ApproveMutation(
  provider?: ethers.providers.Web3Provider,
  onSuccess?: (hash: string, asset: SwappableAssetV4) => void,
  options?: Omit<UseMutationOptions, any>
) {
  const mutation = useMutation(
    async ({
      spender,
      amount,
      tokenAddress,
    }: {
      spender: string;
      amount: ethers.BigNumber;
      tokenAddress?: string;
    }) => {
      if (!provider || tokenAddress === undefined) {
        return undefined;
      }

      const contract = new ethers.Contract(
        tokenAddress,
        ERC20Abi,
        provider.getSigner()
      );

      const tx = await contract.approve(spender, amount);

      if (onSuccess) {
        onSuccess(tx.hash, {
          type: 'ERC20',
          amount: amount.toString(),
          tokenAddress,
        });
      }

      return await tx.wait();
    },
    options
  );

  return mutation;
}
