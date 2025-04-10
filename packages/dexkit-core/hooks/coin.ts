import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { ERC20Abi } from "../constants/abis";


import { client } from "@dexkit/wallet-connectors/thirdweb/client";
import { sendTransaction } from "thirdweb";
import { useActiveWalletChain, useWalletBalance } from "thirdweb/react";
import type { Account } from "thirdweb/wallets";
import { useReadContracts } from "wagmi";
import { getERC20TokenAllowance } from "../services";
import { approveToken } from "../services/balances";


export const ERC20_BALANCE = "ERC20_BALANCE";

export type GetWalletBalanceResult = {
  value: bigint;
  decimals: number;
  displayValue: string;
  symbol: string;
  name: string;
};

export interface Erc20BalanceParams {
  account?: string;
  contractAddress?: string;

}

export function useErc20BalanceQuery({
  account,
  contractAddress,
}: Erc20BalanceParams): UseQueryResult<GetWalletBalanceResult> {
  const activeChain = useActiveWalletChain();

  const balanceQuery = useWalletBalance({
    chain: activeChain,
    address: account,
    client,
    tokenAddress: contractAddress
  });
  //@ts-ignore
  return balanceQuery
}

export const ERC20_BALANCE_V2 = "ERC20_BALANCE_V2";

export interface Erc20BalanceParamsV2 {
  account?: string;
  contractAddress?: string;
}

export function useErc20BalanceQueryV2({
  account,
  contractAddress,
}: Erc20BalanceParamsV2): UseQueryResult<GetWalletBalanceResult> {
  const { data: balance } = useReadContracts({
    contracts: [{ address: "0x", abi: ERC20Abi, functionName: "balanceOf" }],
  });

  const activeChain = useActiveWalletChain();

  const balanceQuery = useWalletBalance({
    chain: activeChain,
    address: account,
    client,
    tokenAddress: contractAddress
  });
  //@ts-ignore
  return balanceQuery
}


export function useEvmNativeBalanceQuery({
  account,
}: {
  account?: string;

}) {
  const activeChain = useActiveWalletChain();

  const balanceQuery = useWalletBalance({
    chain: activeChain,
    address: account,
    client,
  });

  return balanceQuery.data?.value

}

export const GET_ERC20_BALANCE = "GET_ERC20_BALANCE";
//@ts-ignore
export function useErc20Balance({ contractAddress, account }: {
  contractAddress?: string,
  account?: string
}): UseQueryResult<GetWalletBalanceResult> {
  const activeChain = useActiveWalletChain();

  const balanceQuery = useWalletBalance({
    chain: activeChain,
    address: account,
    client,
    tokenAddress: contractAddress
  });
  //@ts-ignore
  return balanceQuery

}

export const TOKEN_ALLOWANCE_QUERY = "TOKEN_ALLOWANCE_QUERY";

export function useTokenAllowanceQuery({
  tokenAddress,
  account,
  spender,
  chainId,
}: {
  chainId?: number;
  account?: string;
  tokenAddress?: string | null;
  spender?: string;
  activeAccount?: Account
}) {
  return useQuery(
    [TOKEN_ALLOWANCE_QUERY, tokenAddress, account, spender],
    async () => {
      if (!tokenAddress || !account || !spender || !chainId) {
        return null;
      }

      return await getERC20TokenAllowance({
        owner: account,
        chainId,
        tokenAddress,

        spender
      });
    },
    { retry: 2 }
  );
}

export function useApproveToken() {
  return useMutation(
    async ({
      activeAccount,
      spender,
      tokenContract,
      onSubmited,
      amount,
    }: {
      activeAccount?: Account,
      amount?: bigint;
      spender?: string;
      tokenContract?: string;
      onSubmited: (hash: string) => void;
    }) => {
      if (!tokenContract || !spender || !activeAccount) {
        return;
      }

      const tx = await approveToken({
        tokenContract,
        spender,
        amount,
      });
      if (tx) {
        const { transactionHash } = await sendTransaction({
          account: activeAccount,
          transaction: tx,
        });

        onSubmited(transactionHash);
      } else {
        return true
      }

    }
  );
}
