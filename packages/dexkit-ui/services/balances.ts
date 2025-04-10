import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { ChainId, MULTICALL_NATIVE_TOKEN_ADDRESS } from '@dexkit/core/constants';

import { DEXKIT } from "../constants";

import { getChainIdFromSlug } from '@dexkit/core/utils/blockchain';
import { parseEther } from '@dexkit/core/utils/ethers/parseEther';



import { NETWORKS } from "@dexkit/core/constants/networks";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants/zrx";
import { TokenWhitelabelApp } from "@dexkit/core/types";
import { TokenBalance } from "../modules/wallet/types";

import { getTokensAllowances, getTokensBalance } from '@dexkit/core/services';
import { client } from '@dexkit/wallet-connectors/thirdweb/client';
import { defineChain, getContract } from 'thirdweb';
import { balanceOf as balanceOfErc1155 } from "thirdweb/extensions/erc1155";
import { allowance, approve, balanceOf } from 'thirdweb/extensions/erc20';
import type { Account } from 'thirdweb/wallets';



export const getERC20Balances = async ({ activeAccount, tokens, chainId }: {
  tokens: TokenWhitelabelApp[],
  chainId: ChainId,
  activeAccount: Account
}) => {
  const tokensByChainId = tokens.filter((t) => Number(t.chainId) === chainId);

  // Add here native token address
  const tokenAddressesWithNative = [
    { contractAddress: MULTICALL_NATIVE_TOKEN_ADDRESS },
    ...tokensByChainId
      .filter((t) => t.address.toLowerCase() !== ZEROEX_NATIVE_TOKEN_ADDRESS)
      .map((t) => { return { contractAddress: t.address.toLowerCase() } }),
  ];

  const multicallBalanceResult = await getTokensBalance({
    tokens: tokenAddressesWithNative,
    activeAccount: activeAccount,
    chainId
  }
  );

  if (multicallBalanceResult) {
    const tokenBalances = multicallBalanceResult;

    return tokensByChainId.map((t) => {
      let addr = t.address.toLowerCase();

      if (addr === ZEROEX_NATIVE_TOKEN_ADDRESS) {
        addr = MULTICALL_NATIVE_TOKEN_ADDRESS;
      }

      return {
        token: t,
        balance: tokenBalances[addr],
      };
    }) as TokenBalance[];
  }

  return [];
};


export const getERC20WithProxyUnlockedBalances = async ({ activeAccount, tokens, chainId }: {
  tokens: TokenWhitelabelApp[],
  chainId: ChainId,
  activeAccount: Account
}) => {
  const tokensByChainId = tokens.filter((t) => Number(t.chainId) === chainId);


  const zrxContracts = getContractAddressesForChainOrThrow(chainId as number);

  const exchangeProxy = zrxContracts.exchangeProxy;


  // Add here native token address
  const tokenAddressesWithNative = [
    { contractAddress: MULTICALL_NATIVE_TOKEN_ADDRESS },
    ...tokensByChainId
      .filter((t) => t.address.toLowerCase() !== ZEROEX_NATIVE_TOKEN_ADDRESS)
      .map((t) => { return { contractAddress: t.address.toLowerCase() } }),
  ];


  const tokenBalances = await getTokensBalance({
    tokens: tokenAddressesWithNative,
    activeAccount: activeAccount,
    chainId
  }
  );

  const tokenAllowance = await getTokensAllowances({
    tokens: tokenAddressesWithNative,
    activeAccount: activeAccount,
    chainId,
    spender: exchangeProxy
  }
  );

  const balances: TokenBalance[] = [];

  if (tokenBalances && tokenAllowance) {


    const balances = tokensByChainId.map((t) => {
      let addr = t.address.toLowerCase();

      if (addr === ZEROEX_NATIVE_TOKEN_ADDRESS) {
        addr = MULTICALL_NATIVE_TOKEN_ADDRESS;
      }

      return {
        token: t,
        balance: tokenBalances[addr],
        //@dev We are assuming it is unlocked, if it have more than 10*10**18 unlocked
        isProxyUnlocked:
          addr === MULTICALL_NATIVE_TOKEN_ADDRESS
            ? true
            : tokenAllowance[addr] >= parseEther('10'),
      };
    }) as TokenBalance[];

    return balances;
  }

  return balances;
};

export const getERC20TokenAllowance = async ({
  chainId, tokenAddress, account, spender

}: {
  chainId: number
  tokenAddress: string,
  account: string,
  spender: string
}): Promise<bigint> => {
  const contract = getContract({
    chain: defineChain(chainId),
    address: tokenAddress,
    client
  })

  return await allowance({
    contract,
    owner: account,
    spender: spender,
  });
};








export async function getBalanceOf({ networkId, address, owner }: { networkId: string, address: string, owner: string }) {
  const network = NETWORKS[getChainIdFromSlug(networkId)?.chainId as any];
  if (!network) {
    throw new Error('network not supported')
  }
  const contract = getContract({
    chain: defineChain(network.chainId),
    address: address,
    client
  })

  return await balanceOf({
    contract,
    address: owner
  });
}

export async function getBalanceOfERC1155({ networkId, address, owner, tokenId }: { networkId: string, address: string, owner: string, tokenId: string }) {
  const network = NETWORKS[getChainIdFromSlug(networkId)?.chainId as any];
  if (!network) {
    throw new Error('network not supported')
  }
  const contract = getContract({
    chain: defineChain(network.chainId),
    address: address,
    client
  })

  return await balanceOfErc1155({
    contract,
    owner: owner,
    tokenId: BigInt(tokenId)
  });
}

export async function getKitBalanceOfThreshold({ owner, amountUnits }: { owner: string, amountUnits: string }) {
  const networks = Object.keys(DEXKIT);
  let hasKit = 0;
  for (const network of networks) {
    //@ts-ignore
    const balanceOf = await getBalanceOf({ networkId: network, address: DEXKIT[network].address, owner });

    const thresholdUnits = parseEther(amountUnits)

    if (balanceOf > thresholdUnits) {
      hasKit++;
    }
  }
  return hasKit;

}

export async function getERC20Approve({ chainId, spender, amount }: { chainId: number, spender: string, amount: string }) {

  const contract = getContract({
    chain: defineChain(chainId),
    address: spender,
    client
  })

  return await approve({
    contract,
    spender,
    amount
  });
}