import { ChainId } from '@dexkit/core/constants';
import { getProviderByChainId } from '@dexkit/core/utils/blockchain';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { type SwappableAssetV4 } from '@traderxyz/nft-swap-sdk';
import { BigNumber, Contract, providers } from 'ethers';
import { useCallback } from 'react';



import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '@dexkit/core/constants';

import { ERC20Abi } from '@dexkit/core/constants/abis';
import { Token } from '@dexkit/core/types';
import { useERC20BalancesQuery } from '../modules/wallet/hooks';
import { TokenBalance } from '../modules/wallet/types';
import { getERC20Balances, getERC20WithProxyUnlockedBalances } from '../services/balances';

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
    provider: walletProvider,
    account,
    chainId: walletChainId,
  } = useWeb3React();
  const chainId = defaultChainId || walletChainId;

  return useQuery(
    [GET_ERC20_BALANCES, account, chainId, tokens],
    () => {
      if (
        account === undefined ||
        chainId === undefined ||
        tokens === undefined
      ) {
        return;
      }
      if (tokens && tokens.length === 0) {
        return [];
      }
      const provider =
        defaultChainId === walletChainId
          ? walletProvider
          : getProviderByChainId(chainId);
      if (!provider) {
        return;
      }

      return getERC20WithProxyUnlockedBalances(
        account,
        tokens,
        chainId,
        provider
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
      const balances = await getERC20Balances(account, [], chainId, provider);
      return balances[0];
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
  signer?: providers.JsonRpcSigner,
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
      amount: BigNumber;
      tokenAddress?: string;
    }) => {
      if (!signer || tokenAddress === undefined) {
        return undefined;
      }

      const contract = new Contract(
        tokenAddress,
        ERC20Abi,
        signer
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

export function useErc20AllowanceMutation(
  provider?: providers.Web3Provider,
  options?: Omit<UseMutationOptions, any>,

) {
  const mutation = useMutation(
    async ({
      account,
      spender,
      tokenAddress,
    }: {
      spender: string;
      account?: string,
      tokenAddress?: string;
    }) => {
      if (!provider || tokenAddress === undefined || !account) {
        return undefined;
      }

      const contract = new Contract(
        tokenAddress,
        ERC20Abi,
        provider
      );

      const allowance = await contract.allowance(account, spender);



      return allowance as BigNumber;
    },
    options
  );

  return mutation;
}

export function useErc20ApproveMutationV2(
  signer?: providers.Web3Provider,
  onSuccess?: (hash: string, asset: SwappableAssetV4) => void,
) {
  const mutation = useMutation(
    async ({
      spender,
      amount,
      tokenAddress,
    }: {
      spender: string;
      amount: BigNumber;
      tokenAddress?: string;
    }) => {
      if (!signer || tokenAddress === undefined) {
        return undefined;
      }

      const contract = new Contract(
        tokenAddress,
        ERC20Abi,
        signer
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
    }
  );

  return mutation;
}
