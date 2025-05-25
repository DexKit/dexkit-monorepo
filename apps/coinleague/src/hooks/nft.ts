import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import { useMemo } from 'react';

import { BigNumber, Contract, providers } from 'ethers';
import { WETHAbi } from '../constants/abis';

import { WRAPPED_ETHER_CONTRACT } from '../constants';


import { useAtomValue } from 'jotai';

import {
  accountAssetsAtom
} from '../state/atoms';


import { getERC20Balance } from '@dexkit/core/services/balances';









export const GET_ERC20_BALANCE = 'GET_ERC20_BALANCE';

export function useErc20Balance(
  provider?: providers.BaseProvider,
  contractAddress?: string,
  account?: string,
) {
  return useQuery<BigNumber | undefined>(
    [GET_ERC20_BALANCE, contractAddress, account],
    async () => {
      if (!contractAddress || !account || !provider) {
        return undefined;
      }

      return getERC20Balance(contractAddress, account, provider);
    },
    {
      enabled: contractAddress !== undefined && account !== undefined,
    },
  );
}

export function useWrapEtherMutation(
  provider?: providers.BaseProvider,
  chainId?: number,
) {
  return useMutation(async ({ amount }: { amount: BigNumber }) => {
    if (chainId === undefined) {
      return;
    }

    const contractAddress = WRAPPED_ETHER_CONTRACT[chainId];

    if (contractAddress === undefined) {
      return;
    }

    const contract = new Contract(contractAddress, WETHAbi, provider);

    return await contract.deposit({ value: amount });
  });
}







export function useTotalAssetsBalance(accounts: string[], networks: string[]) {
  const accountAssets = useAtomValue(accountAssetsAtom);

  const totalAccountAssets = useMemo(() => {
    if (accounts && accountAssets && accountAssets.data) {
      return accountAssets.data
        .filter((a) => accounts.includes(a?.account || ''))
        .filter((a) =>
          networks.length ? networks.includes(a.network || '') : true,
        )
        .map((a) => a.assets?.length)
        .reduce((c, p) => (c || 0) + (p || 0));
    }
    return undefined;
  }, [accounts, networks]);

  return { totalAccountAssets };
}





