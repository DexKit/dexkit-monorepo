import { BigNumber, Contract, providers } from "ethers";

import { ERC20Abi } from "../constants/abis";

import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "../constants";
import { NETWORK_COIN_SYMBOL } from "../constants/networks";


export const getERC20Decimals = async (
  contractAddress?: string,
  provider?: providers.BaseProvider
) => {
  if (contractAddress === undefined || provider === undefined) {
    return;
  }

  if (contractAddress === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return 18;
  }

  const contract = new Contract(contractAddress, ERC20Abi, provider);

  return await contract.decimals();
};

export const getERC20Symbol = async (
  contractAddress?: string,
  provider?: providers.BaseProvider
) => {
  if (contractAddress === undefined || provider === undefined) {
    return;
  }

  if (contractAddress === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return NETWORK_COIN_SYMBOL((await provider.getNetwork()).chainId);
  }

  const contract = new Contract(contractAddress, ERC20Abi, provider);

  return await contract.symbol();
};

export const getERC20Name = async (
  contractAddress?: string,
  provider?: providers.BaseProvider
) => {
  if (contractAddress === undefined || provider === undefined) {
    return;
  }

  const contract = new Contract(contractAddress, ERC20Abi, provider);

  return await contract.name();
};

export const getERC20Balance = async (
  contractAddress?: string,
  account?: string,
  provider?: providers.BaseProvider
) => {
  if (
    contractAddress === undefined ||
    account === undefined ||
    provider === undefined
  ) {
    return;
  }

  if (contractAddress === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return await provider.getBalance(account);
  }

  const contract = new Contract(contractAddress, ERC20Abi, provider);

  return await contract.balanceOf(account);
};

export const approveToken = async ({
  signer,
  spender,
  tokenContract,
  amount,
}: {
  signer?: providers.JsonRpcSigner;
  spender?: string;
  tokenContract?: string;
  amount?: BigNumber;
}) => {
  if (!tokenContract || !signer || !spender || !amount) {
    return;
  }

  const contract = new Contract(
    tokenContract,
    ERC20Abi,
    signer
  );

  return await contract.approve(spender, amount);
};
