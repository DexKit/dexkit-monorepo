import { ChainId } from '@/modules/common/constants/enums';
import { getMulticall } from '@/modules/common/services/multicall';
import { CallInput } from '@indexed-finance/multicall';
import { BigNumber, ContractTransaction, ethers, providers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import kittygotchiAbi from '../constants/ABI/kittygotchi.json';
import { getKittygotchiApi } from '../utils';

export const getKittyGotchiContractSigner = async (
  address: string,
  provider: providers.Web3Provider
) => {
  const pr = provider.getSigner();
  return new ethers.Contract(address, kittygotchiAbi, pr);
};

export const getKittyGotchiContractNetwork = async (
  address: string,
  provider: providers.JsonRpcProvider
) => {
  return new ethers.Contract(address, kittygotchiAbi, provider);
};

export const feed = async (
  id: string,
  kittyAddress: string,
  provider: providers.Web3Provider
) => {
  return (await getKittyGotchiContractSigner(kittyAddress, provider)).feed(
    id
  ) as Promise<ContractTransaction>;
};

export const mint = async (
  kittyAddress: string,
  provider: providers.Web3Provider,
  price: BigNumber
) => {
  return (await getKittyGotchiContractSigner(kittyAddress, provider)).safeMint({
    value: price,
  }) as Promise<ContractTransaction>;
};

export const getOnchainAttritbutes = async (
  id: string,
  kittyAddress: string,
  provider: ethers.providers.JsonRpcProvider
) => {
  const iface = new Interface(kittygotchiAbi);
  const multicall = await getMulticall(provider);
  const calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: kittyAddress,
    args: [id],
    function: 'getAttackOf',
  });
  calls.push({
    interface: iface,
    target: kittyAddress,
    args: [id],
    function: 'getRunOf',
  });
  calls.push({
    interface: iface,
    target: kittyAddress,
    args: [id],
    function: 'getDefenseOf',
  });
  calls.push({
    interface: iface,
    target: kittyAddress,
    args: [id],
    function: 'getLastUpdateOf',
  });
  const response = await multicall.multiCall(calls);
  const [, results] = response;
  return {
    attack: results[0],
    run: results[1],
    defense: results[2],
    lastUpdated: results[3],
  };
};

export const update = (
  sig: string,
  message: string,
  attributes: any,
  id: string,
  account: string,
  chainId: number
) => {
  const api = getKittygotchiApi(chainId);
  const data = {
    owner: account,
    message: message,
    signature: sig,
    attributes: attributes,
  };
  if (api) {
    return api.post(`${id}`, data);
  }
};

export function refetchKittygotchiMetadata(tokenId: string, chainId?: ChainId) {
  const api = getKittygotchiApi(chainId);
  if (api) {
    return api.get(`${tokenId}`);
  }
}
