import { MultiCall } from '@indexed-finance/multicall';
import { ethers } from 'ethers';

export const getMulticall = async (
  provider: ethers.providers.JsonRpcProvider
) => {
  return new MultiCall(provider);
};

export const getTokenBalance = async (
  address: string,
  tokenAddress: string,
  provider: ethers.providers.JsonRpcProvider
) => {
  const contract = new ethers.Contract(
    tokenAddress,
    [
      'function balanceOf(address _owner) public view returns (uint256 balance)',
    ],
    provider
  );

  return await contract.balanceOf(address);
};

export const getTokenBalances = async (
  tokens: string[],
  account: string,
  provider: ethers.providers.JsonRpcProvider
) => {
  const multicall = await getMulticall(provider);
  const tokensBal = await multicall.getBalances(tokens, account);
  return tokensBal;
};

export const getTokenBalancesAndAllowances = async (
  tokens: string[],
  account: string,
  spender: string,
  provider: ethers.providers.JsonRpcProvider
) => {
  const multicall = await getMulticall(provider);
  const tokensBal = await multicall.getBalancesAndAllowances(
    tokens,
    account,
    spender
  );
  return tokensBal;
};

export const getTokenBalanceAndAllowance = async (
  token: string,
  account: string,
  spender: string,
  provider: ethers.providers.JsonRpcProvider
) => {
  const tokensBal = await getTokenBalancesAndAllowances(
    [token],
    account,
    spender,
    provider
  );
  return tokensBal;
};
