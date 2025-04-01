import { getContractAddressesForChainOrThrow } from "@0x/contract-addresses";
import {
  ChainId,
  MULTICALL_NATIVE_TOKEN_ADDRESS,
} from "@dexkit/core/constants";
import { ERC1155Abi, ERC20Abi } from "@dexkit/core/constants/abis";
import { BigNumber, Contract, providers, utils } from "ethers";
import { DEXKIT } from "../constants";

import { getChainIdFromSlug } from "@dexkit/core/utils/blockchain";
import { parseEther } from "@dexkit/core/utils/ethers/parseEther";

import { NETWORKS } from "@dexkit/core/constants/networks";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants/zrx";
import { Token } from "@dexkit/core/types";
import { TokenBalance } from "../modules/wallet/types";
import {
  getMulticallTokenBalances,
  getMulticallTokenBalancesAndAllowances,
} from "./multical";

export const getERC20Balances = async (
  account: string,
  tokens: Token[],
  chainId: ChainId,
  provider: providers.JsonRpcProvider,
) => {
  const tokensByChainId = tokens.filter((t) => Number(t.chainId) === chainId);

  // Add here native token address
  const tokenAddressesWithNative = [
    MULTICALL_NATIVE_TOKEN_ADDRESS,
    ...tokensByChainId
      .filter((t) => t.address.toLowerCase() !== ZEROEX_NATIVE_TOKEN_ADDRESS)
      .map((t) => t.address.toLowerCase()),
  ];

  const multicallBalanceResult = await getMulticallTokenBalances(
    tokenAddressesWithNative,
    account,
    provider,
  );

  if (multicallBalanceResult) {
    const [, tokenBalances] = multicallBalanceResult;

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

export const getERC20WithProxyUnlockedBalances = async (
  account: string,
  tokens: Token[],
  chainId: ChainId,
  provider: providers.JsonRpcProvider,
) => {
  const tokensByChainId = tokens.filter((t) => Number(t.chainId) === chainId);

  const zrxContracts = getContractAddressesForChainOrThrow(chainId as number);

  const exchangeProxy = zrxContracts.exchangeProxy;
  // Add here native token address
  const tokenAddressesWithNative = [
    MULTICALL_NATIVE_TOKEN_ADDRESS,
    ...tokensByChainId
      .filter((t) => t.address.toLowerCase() !== ZEROEX_NATIVE_TOKEN_ADDRESS)
      .map((t) => t.address.toLowerCase()),
  ];

  const multicallBalanceResult = await getMulticallTokenBalancesAndAllowances(
    tokenAddressesWithNative,
    account,
    exchangeProxy,
    provider,
  );

  const balances: TokenBalance[] = [];

  if (multicallBalanceResult) {
    const [, tokenBalances] = multicallBalanceResult;

    const balances = tokensByChainId.map((t) => {
      let addr = t.address.toLowerCase();

      if (addr === ZEROEX_NATIVE_TOKEN_ADDRESS) {
        addr = MULTICALL_NATIVE_TOKEN_ADDRESS;
      }

      return {
        token: t,
        balance: tokenBalances[addr].balance,
        //@dev We are assuming it is unlocked, if it have more than 10*10**18 unlocked
        isProxyUnlocked:
          addr === MULTICALL_NATIVE_TOKEN_ADDRESS
            ? true
            : tokenBalances[addr].allowance.gt(parseEther("10")),
      };
    }) as TokenBalance[];

    return balances;
  }

  return balances;
};

export const getERC20TokenAllowance = async (
  provider: providers.BaseProvider,
  tokenAddress: string,
  account: string,
  spender: string,
): Promise<BigNumber> => {
  const contract = new Contract(tokenAddress, ERC20Abi, provider);

  return await contract.allowance(account, spender);
};

export async function getBalanceOf(
  networkId: string,
  address: string,
  owner: string,
) {
  const network = NETWORKS[getChainIdFromSlug(networkId)?.chainId as any];
  if (!network) {
    throw new Error("network not supported");
  }
  const iface = new utils.Interface(ERC20Abi);
  const provider = new providers.JsonRpcProvider(network.providerRpcUrl);
  const contract = new Contract(address, iface, provider);
  return (await contract.balanceOf(owner)) as BigNumber;
}

export async function getBalanceOfERC1155(
  networkId: string,
  address: string,
  owner: string,
  tokenId: string,
) {
  const network = NETWORKS[getChainIdFromSlug(networkId)?.chainId as any];
  if (!network) {
    throw new Error("network not supported");
  }
  const iface = new utils.Interface(ERC1155Abi);
  const provider = new providers.JsonRpcProvider(network.providerRpcUrl);
  const contract = new Contract(address, iface, provider);
  return (await contract.balanceOf(owner, tokenId)) as BigNumber;
}

export async function getKitBalanceOfThreshold(
  owner: string,
  amountUnits: string,
) {
  const networks = Object.keys(DEXKIT);
  let hasKit = 0;
  for (const network of networks) {
    //@ts-ignore
    const balanceOf = await getBalanceOf(
      network,
      DEXKIT[network].address,
      owner,
    );
    //@ts-ignore
    const thresholdUnits = BigNumber.from(amountUnits).mul(
      BigNumber.from(10).pow(DEXKIT[network].decimals),
    );
    if (balanceOf.gte(thresholdUnits)) {
      hasKit++;
    }
  }
  return hasKit;
}
