import { useMutation, useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { ERC20Abi } from "../constants/abis";

import type { providers } from "ethers";

import { client } from "@dexkit/wallet-connectors/thirdweb/client";
import { useActiveWalletChain, useWalletBalance } from "thirdweb/react";
import { useReadContracts } from "wagmi";
import { getERC20TokenAllowance } from "../services";
import { approveToken } from "../services/balances";

export const ERC20_BALANCE = "ERC20_BALANCE";

export interface Erc20BalanceParams {
  account?: string;
  contractAddress?: string;

}

export function useErc20BalanceQuery({
  account,
  contractAddress,
}: Erc20BalanceParams) {
  const activeChain = useActiveWalletChain();

  const balanceQuery = useWalletBalance({
    chain: activeChain,
    address: account,
    client,
    tokenAddress: contractAddress
  });

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
}: Erc20BalanceParamsV2) {
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
export function useErc20Balance(
  contractAddress?: string,
  account?: string
) {
  const activeChain = useActiveWalletChain();

  const balanceQuery = useWalletBalance({
    chain: activeChain,
    address: account,
    client,
    tokenAddress: contractAddress
  });

  return balanceQuery

}

export const TOKEN_ALLOWANCE_QUERY = "TOKEN_ALLOWANCE_QUERY";

export function useTokenAllowanceQuery({
  tokenAddress,
  account,
  spender,
  provider,
}: {
  account?: string;
  tokenAddress?: string | null;
  spender?: string;
  provider?: providers.Web3Provider;
}) {
  return useQuery(
    [TOKEN_ALLOWANCE_QUERY, tokenAddress, account, spender],
    async () => {
      if (!provider || !tokenAddress || !account || !spender) {
        return null;
      }

      return await getERC20TokenAllowance(
        provider,
        tokenAddress,
        account,
        spender
      );
    },
    { retry: 2 }
  );
}

export function useApproveToken() {
  return useMutation(
    async ({
      spender,
      tokenContract,
      provider,
      onSubmited,
      amount,
    }: {
      amount?: BigNumber;
      spender?: string;
      tokenContract?: string;
      provider?: providers.Web3Provider;
      onSubmited: (hash: string) => void;
    }) => {
      if (!tokenContract || !spender) {
        return;
      }

      const tx = await approveToken({
        tokenContract,
        spender,
        amount,
        provider,
      });

      onSubmited(tx.hash);

      return await tx.wait();
    }
  );
}
