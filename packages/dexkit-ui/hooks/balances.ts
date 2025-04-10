import { ChainId } from '@dexkit/core/constants';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { SwappableAssetV4 } from '@traderxyz/nft-swap-sdk';
import { useCallback } from 'react';



import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '@dexkit/core/constants';

import { Token, TokenWhitelabelApp } from '@dexkit/core/types';
import { sendTransaction } from "thirdweb";
import type { Account } from 'thirdweb/wallets';
import { useERC20BalancesQuery } from '../modules/wallet/hooks';
import { TokenBalance } from '../modules/wallet/types';
import { getERC20Approve, getERC20Balances, getERC20TokenAllowance, getERC20WithProxyUnlockedBalances } from '../services/balances';

export const GET_ERC20_BALANCES = 'GET_ERC20_BALANCES';
export const GET_ERC20_BALANCE = 'GET_ERC20_BALANCE';
export const GET_NATIVE_BALANCE = 'GET_NATIVE_BALANCES';

type SelectCalback = (data?: TokenBalance[]) => TokenBalance[] | undefined;

export const selectNativeCurrency: SelectCalback = (data?: TokenBalance[]) =>
  data?.filter((t) => t.token.address === ZEROEX_NATIVE_TOKEN_ADDRESS);



export const useERC20BalancesProxyAllowancesQuery = (
  tokens?: Token[],
  select?: SelectCalback,
  defaultChainId?: ChainId,
  useSuspense?: boolean
) => {
  const {
    activeAccount,
    chainId: walletChainId,
  } = useWeb3React();
  const chainId = defaultChainId || walletChainId;

  return useQuery(
    [GET_ERC20_BALANCES, activeAccount, chainId, tokens],
    () => {
      if (
        activeAccount === undefined ||
        chainId === undefined ||
        tokens === undefined
      ) {
        return;
      }
      if (tokens && tokens.length === 0) {
        return [];
      }


      return getERC20WithProxyUnlockedBalances({
        chainId,
        tokens: tokens as TokenWhitelabelApp[],
        activeAccount
      }

      );
    },
    { enabled: chainId !== undefined, select, suspense: useSuspense }
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
  const { activeAccount, chainId } = useWeb3React();
  return useQuery(
    [GET_NATIVE_BALANCE, activeAccount, chainId],
    async () => {
      if (
        activeAccount === undefined ||
        chainId === undefined
      ) {
        return;
      }
      const balances = await getERC20Balances({ activeAccount, tokens: [], chainId });
      return balances[0];
    },
    { enabled: activeAccount !== undefined }
  );
};

// We use this if we need only a token balance
export const useERC20BalanceQuery = (token: Token) => {
  const { activeAccount, chainId } = useWeb3React();
  return useQuery(
    [GET_ERC20_BALANCE, activeAccount, chainId, token],
    async () => {
      if (
        activeAccount === undefined ||
        chainId === undefined ||
        token === undefined
      ) {
        return;
      }
      const balances = await getERC20Balances({
        activeAccount,
        tokens: [token as TokenWhitelabelApp],
        chainId
      });
      return balances.filter((tb) => tb.token === token)[0];
    },
    { enabled: activeAccount !== undefined }
  );
};

export function useErc20ApproveMutation(
  onSuccess?: (hash: string, asset: SwappableAssetV4) => void,
  options?: Omit<UseMutationOptions, any>
) {
  const mutation = useMutation(
    async ({
      spender,
      chainId,
      amount,
      tokenAddress,
      activeAccount
    }: {
      chainId: number,
      spender: string;
      amount: bigint;
      tokenAddress?: string;
      activeAccount: Account
    }) => {
      if (tokenAddress === undefined) {
        return undefined;
      }

      const transaction = await getERC20Approve({ spender, amount: amount.toString(), chainId });
      const tx = await sendTransaction({ transaction, account: activeAccount });
      if (onSuccess) {
        onSuccess(tx.transactionHash, {
          type: 'ERC20',
          amount: amount.toString(),
          tokenAddress,
        });
      }

      return await true;
    },
    options
  );

  return mutation;
}

export function useErc20AllowanceMutation(

  options?: Omit<UseMutationOptions, any>,

) {
  const mutation = useMutation(
    async ({
      account,
      spender,
      tokenAddress,
      chainId,
    }: {
      spender: string;
      account?: string,
      tokenAddress?: string;
      chainId: number,
    }) => {
      if (tokenAddress === undefined || !account) {
        return undefined;
      }

      return await getERC20TokenAllowance({ chainId, tokenAddress, account, spender })

    },
    options
  );

  return mutation;
}

export function useErc20ApproveMutationV2(
  onSuccess?: (hash: string, asset: SwappableAssetV4) => void,
) {
  const mutation = useMutation(
    async ({
      spender,
      chainId,
      amount,
      tokenAddress,
      activeAccount
    }: {
      chainId: number,
      spender: string;
      amount: bigint;
      tokenAddress?: string;
      activeAccount: Account
    }) => {
      if (tokenAddress === undefined) {
        return undefined;
      }

      const transaction = await getERC20Approve({ spender, amount: amount.toString(), chainId });
      const tx = await sendTransaction({ transaction, account: activeAccount });
      if (onSuccess) {
        onSuccess(tx.transactionHash, {
          type: 'ERC20',
          amount: amount.toString(),
          tokenAddress,
        });
      }

      return true;
    }
  );

  return mutation;
}
