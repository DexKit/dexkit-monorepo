import { ERC20Abi } from '@/modules/coinleague/constants/abis';
import { BigNumber, ethers } from 'ethers';
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '../constants';
import { getNativeTokenSymbol } from '../utils';

export const getERC20Decimals = async (
  contractAddress?: string,
  provider?: ethers.providers.BaseProvider
) => {
  if (contractAddress === undefined || provider === undefined) {
    return;
  }

  if (contractAddress === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return 18;
  }

  const contract = new ethers.Contract(contractAddress, ERC20Abi, provider);

  return await contract.decimals();
};

export const getERC20Symbol = async (
  contractAddress?: string,
  provider?: ethers.providers.BaseProvider
) => {
  if (contractAddress === undefined || provider === undefined) {
    return;
  }

  if (contractAddress === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return getNativeTokenSymbol((await provider.getNetwork()).chainId);
  }

  const contract = new ethers.Contract(contractAddress, ERC20Abi, provider);

  return await contract.symbol();
};

export const getERC20Name = async (
  contractAddress?: string,
  provider?: ethers.providers.BaseProvider
) => {
  if (contractAddress === undefined || provider === undefined) {
    return;
  }

  const contract = new ethers.Contract(contractAddress, ERC20Abi, provider);

  return await contract.name();
};

export const getERC20Balance = async (
  contractAddress?: string,
  account?: string,
  provider?: ethers.providers.BaseProvider
): Promise<BigNumber | undefined> => {
  if (
    contractAddress === undefined ||
    account === undefined ||
    provider === undefined
  ) {
    return BigNumber.from(0);
  }

  if (contractAddress === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return await provider.getBalance(account);
  }

  const contract = new ethers.Contract(contractAddress, ERC20Abi, provider);

  return await contract.balanceOf(account);
};

export const getERC20TokenAllowance = async (
  provider: ethers.providers.BaseProvider,
  tokenAddress: string,
  account: string,
  spender: string
): Promise<ethers.BigNumber> => {
  const contract = new ethers.Contract(tokenAddress, ERC20Abi, provider);

  return await contract.allowance(account, spender);
};
