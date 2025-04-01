import { MULTICALL_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants";
import { ChainId } from "@dexkit/core/constants/enums";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants/zrx";
import { TokenWhitelabelApp } from "@dexkit/core/types";
import { providers } from "ethers";
import { getMulticallTokenBalances } from "../../../services/multical";
import { TokenBalance } from "../types";

export const getERC20Balances = async (
  account: string,
  tokens: TokenWhitelabelApp[],
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
