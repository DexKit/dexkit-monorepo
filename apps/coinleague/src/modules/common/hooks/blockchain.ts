import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { getERC20Balance, getERC20TokenAllowance } from '../services/balances';
import { approveToken } from '../services/token';

export function useBlockNumber() {
  const { provider } = useWeb3React();

  const [blockNumber, setBlockNumber] = useState(0);

  useEffect(() => {
    if (provider) {
      const handleBlockNumber = (blockNumber: any) => {
        setBlockNumber(blockNumber);
      };

      provider?.on('block', handleBlockNumber);

      return () => {
        provider?.removeListener('block', handleBlockNumber);
      };
    }
  }, [provider]);

  return blockNumber;
}

export const TOKEN_ALLOWANCE_QUERY = 'TOKEN_ALLOWANCE_QUERY';

export function useTokenAllowanceQuery({
  tokenAddress,
  account,
  spender,
  provider,
}: {
  account?: string;
  tokenAddress?: string;
  spender?: string;
  provider?: ethers.providers.Web3Provider;
}) {
  return useQuery(
    [TOKEN_ALLOWANCE_QUERY, tokenAddress, account, spender],
    async () => {
      if (!provider || !tokenAddress || !account || !spender) {
        return;
      }

      return await getERC20TokenAllowance(
        provider,
        tokenAddress,
        account,
        spender
      );
    }
  );
}

export function useApproveToken({
  spender,
  tokenContract,
  provider,
  options,
  onSubmited,
}: {
  spender?: string;
  tokenContract?: string;
  provider?: ethers.providers.Web3Provider;
  onSubmited: (hash: string) => void;
  options?: Omit<
    UseMutationOptions<
      ethers.ContractReceipt | undefined,
      unknown,
      void,
      unknown
    >,
    'mutationFn'
  >;
}) {
  return useMutation(async () => {
    if (!tokenContract || !spender) {
      return;
    }

    const tx = await approveToken(
      tokenContract,
      spender,
      BigNumber.from('1000000').mul(BigNumber.from('10').pow(18)),
      provider
    );

    onSubmited(tx.hash);

    return await tx.wait();
  }, options);
}

export const ERC20_BALANCE = 'ERC20_BALANCE';

export function useErc20BalanceQuery({
  provider,
  tokenAddress,
  account,
}: {
  tokenAddress?: string;
  account?: string;
  provider?: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
}) {
  return useQuery([ERC20_BALANCE, tokenAddress, account], async () => {
    return (
      (await getERC20Balance(tokenAddress, account, provider)) ||
      BigNumber.from(0)
    );
  });
}

const EVM_NATIVE_BALANCE_QUERY = 'EVM_NATIVE_BALANCE_QUERY';

export function useEvmNativeBalance({
  provider,
  account,
}: {
  account?: string;
  provider?: ethers.providers.Web3Provider;
}) {
  return useQuery([EVM_NATIVE_BALANCE_QUERY, account], async () => {
    if (!account || !provider) {
      return BigNumber.from(0);
    }

    return (await provider.getBalance(account)) || BigNumber.from(0);
  });
}
