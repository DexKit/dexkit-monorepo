

import { client } from "@dexkit/wallet-connectors/thirdweb/client";
import { defineChain, getContract, readContract } from "thirdweb";
import { approve, decimals } from "thirdweb/extensions/erc20";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "../constants";
import { NETWORK_COIN_SYMBOL } from "../constants/networks";

export const getERC20Decimals = async ({ contractAddress, chainId

}: {
  contractAddress?: string,
  chainId?: number
}) => {
  if (contractAddress === undefined || chainId === undefined) {
    return;
  }

  if (contractAddress === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return 18;
  }

  const contract = getContract({
    client,
    address: contractAddress,
    chain: defineChain(chainId),
  });

  return await decimals({ contract });;
};

export const getERC20Symbol = async ({ contractAddress, chainId

}: {
  contractAddress?: string,
  chainId?: number
}) => {
  if (contractAddress === undefined || chainId === undefined) {
    return;
  }

  if (contractAddress === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return NETWORK_COIN_SYMBOL(chainId);
  }

  const contract = getContract({
    client,
    address: contractAddress,
    chain: defineChain(chainId),
  });

  const data = await readContract({
    contract: contract,
    method: "function symbol() public view returns (string)",
    params: [],
  })




  return data
};

export const getERC20Name = async ({ contractAddress, chainId

}: {
  contractAddress?: string,
  chainId?: number
}) => {
  if (contractAddress === undefined || chainId === undefined) {
    return;
  }

  const contract = getContract({
    client,
    address: contractAddress,
    chain: defineChain(chainId),
  });

  const data = await readContract({
    contract: contract,
    method: "function name() public view returns (string)",
    params: [],
  })



  return data
};

/*export const getERC20BalanceAsync = async ({
  contractAddress,
  activeAccount,
  chainId

}: {
  contractAddress?: string,
  activeAccount?: Account,
  chainId?: number
}) => {
  if (contractAddress === undefined || activeAccount === undefined || chainId === undefined) {
    return;
  }

  if (contractAddress === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return await getWalletBalance({ address: activeAccount.address, chain: defineChain(chainId), client });
  }
  return await getWalletBalance({ address: activeAccount.address, chain: defineChain(chainId), client, tokenAddress: contractAddress });

};*/

export const approveToken = async ({
  spender,
  tokenContract,
  amount,
  chainId
}: {

  spender?: string;
  tokenContract?: string;
  amount?: bigint;
  chainId?: number
}) => {
  if (!tokenContract || !spender || !amount || !chainId) {
    return;
  }

  const contract = getContract({
    client,
    address: tokenContract,
    chain: defineChain(chainId),
  });



  return await approve({
    contract,
    spender,
    amount: amount.toString(),
  })
};
