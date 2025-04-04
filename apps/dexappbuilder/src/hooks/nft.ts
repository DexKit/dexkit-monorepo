import {
  useMutation
} from '@tanstack/react-query';
import { useMemo } from 'react';

import { WETHAbi } from '../constants/abis';

import { WRAPPED_ETHER_CONTRACT } from '../constants';


import { useAtomValue } from 'jotai';

import {
  accountAssetsAtom
} from '../state/atoms';


import { client } from '@dexkit/wallet-connectors/thirdweb/client';

import { getContract } from 'thirdweb';
import { useActiveWalletChain, useWalletBalance } from "thirdweb/react";







export const GET_ERC20_BALANCE = 'GET_ERC20_BALANCE';

export function useErc20Balance(
  contractAddress?: string,
  account?: string,
) {

  const activeChain = useActiveWalletChain();
  const { data, isLoading, isError } = useWalletBalance({
    chain: activeChain,
    address: account,
    client,
    tokenAddress: contractAddress
  });

  return data?.value


}

export function useWrapEtherMutation(
  chainId?: number,
) {
  const activeChain = useActiveWalletChain();


  return useMutation(async ({ amount }: { amount: BigInt }) => {
    if (chainId === undefined) {
      return;
    }


    const contractAddress = WRAPPED_ETHER_CONTRACT[chainId];

    if (contractAddress === undefined) {
      return;
    }


    const contract = getContract({
      client,
      chain: activeChain,
      address: contractAddress,
      // optional ABI
      abi: WETHAbi,
    });


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





