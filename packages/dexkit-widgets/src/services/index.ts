import type { TokenBalances } from "@indexed-finance/multicall";
import MultiCall from "@indexed-finance/multicall";
import type { providers } from "ethers";
import { BigNumber, Contract, constants } from "ethers";

import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import { ERC20Abi } from "../constants/abis";
import { TokenPrices } from "../types";
import { isAddressEqual } from "../utils";

import {
  COINGECKO_ENDPOIT,
  COINGECKO_PLATFORM_ID,
} from "@dexkit/core/constants";
import { ChainId } from "@dexkit/core/constants/enums";
import { Token } from "@dexkit/core/types";
import axios from "axios";

export const getERC20TokenAllowance = async (
  provider: providers.BaseProvider,
  tokenAddress: string,
  account: string,
  spender: string
): Promise<BigNumber> => {
  const contract = new Contract(tokenAddress, ERC20Abi, provider);

  return await contract.allowance(account, spender);
};

export const hasSufficientAllowance = async ({
  spender,
  tokenAddress,
  amount,
  account,
  provider,
}: {
  account?: string;
  spender: string;
  tokenAddress: string;
  amount: BigNumber;
  provider?: providers.BaseProvider;
}) => {
  debugger;
  if (!provider || !account) {
    throw new Error("no provider or account");
  }

  if (isAddressEqual(spender, constants.AddressZero)) {
    return true;
  }

  const allowance = await getERC20TokenAllowance(
    provider,
    tokenAddress,
    account,
    spender
  );

  return allowance.gte(amount);
};

export async function getTokensBalance(
  tokens: Token[],
  provider: providers.BaseProvider,
  account: string
): Promise<TokenBalances> {
  // await provider.ready;

  const multicall = new MultiCall(provider);

  const [, balances] = await multicall.getBalances(
    tokens.map((t) => {
      if (
        t.address &&
        ZEROEX_NATIVE_TOKEN_ADDRESS &&
        t.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS.toLowerCase()
      ) {
        return constants.AddressZero;
      }

      return t.address;
    }),
    account
  );

  return balances;
}

export const getTokenPrices = async ({
  chainId,
  addresses,
  currency = "usd",
}: {
  chainId: ChainId;
  addresses: string[];
  currency: string;
}): Promise<{ [key: string]: { [key: string]: number } }> => {
  const platformId = COINGECKO_PLATFORM_ID[chainId];
  if (!platformId) {
    return {};
  }

  const priceResponce = await axios.get(
    `${COINGECKO_ENDPOIT}/simple/token_price/${platformId}?contract_addresses=${addresses.join(
      ","
    )}&vs_currencies=${currency}`
  );

  return priceResponce.data as { [key: string]: { [key: string]: number } };
};

export const getCoinPrices = async ({
  tokens,
  currency = "usd",
}: {
  tokens: Token[];
  currency: string;
}): Promise<TokenPrices> => {
  const priceResponce = (
    await axios.get<{ [key: string]: { [key: string]: number } }>(
      `${COINGECKO_ENDPOIT}/simple/price?ids=${tokens
        .map((c) => c.coingeckoId)
        .join(",")}&vs_currencies=${currency}`
    )
  ).data;

  const results: TokenPrices = {};

  for (const key of Object.keys(priceResponce)) {
    const result = priceResponce[key];
    const amount = result[currency];
    const token = tokens.find((c) => c.coingeckoId === key);

    if (token?.chainId) {
      results[token.chainId] = {
        [isAddressEqual(token.address, ZEROEX_NATIVE_TOKEN_ADDRESS)
          ? constants.AddressZero
          : token.address]: { [currency]: amount },
      };
    }
  }

  return results;
};

export async function getPricesByChain(
  chainId: ChainId,
  tokens: Token[],
  currency: string
): Promise<TokenPrices> {
  return await getCoinPrices({
    tokens,
    currency,
  });
}
