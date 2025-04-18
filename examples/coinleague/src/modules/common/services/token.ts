import { BigNumber, ContractTransaction, ethers } from 'ethers';

const ApproveAbi = [
  'function approve(address _spender, uint256 _value) public returns (bool success)',
];

export const approveToken = async (
  tokenAddress: string,
  spender: string,
  amountToSpend: BigNumber,
  provider: any
) => {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(tokenAddress, ApproveAbi, signer);

  return (await contract.approve(
    spender,
    amountToSpend
  )) as ContractTransaction;
};

export const getErc20Balance = async (
  provider: ethers.providers.Web3Provider,
  contract: string,
  address: string
) => {};
