import MultiCall, { TokenBalances } from "@indexed-finance/multicall";
import { BigNumber, Contract, constants, providers } from "ethers";
import { COINGECKO_ENDPOIT, COINGECKO_PLATFORM_ID, ZEROEX_NATIVE_TOKEN_ADDRESS } from "../constants";
import { ERC20Abi } from "../constants/abis";
import { Token, TokenPrices } from "../types";
import { isAddressEqual } from "../utils";
export * from './balances';

import { ChainId } from "@dexkit/core/constants/enums";
import axios from "axios";

export const getERC20TokenAllowance = async (
  signer: providers.JsonRpcSigner,
  tokenAddress: string,
  account: string,
  spender: string
): Promise<BigNumber> => {
  const contract = new Contract(tokenAddress, ERC20Abi, signer);

  return await contract.allowance(account, spender);
};

export const hasSufficientAllowance = async ({
  spender,
  tokenAddress,
  amount,
  account,
  signer,
}: {
  account?: string;
  spender: string;
  tokenAddress: string;
  amount: BigNumber;
  signer?: providers.JsonRpcSigner;
}) => {
  if (!signer || !account) {
    throw new Error("no provider or account");
  }

  if (isAddressEqual(spender, constants.AddressZero)) {
    return true;
  }

  const allowance = await getERC20TokenAllowance(
    signer,
    tokenAddress,
    account,
    spender
  );

  return allowance.gte(amount);
};



export async function getTokensBalance(
  tokens?: { contractAddress: string }[],
  provider?: providers.BaseProvider,
  account?: string
): Promise<TokenBalances | undefined> {
  if (!provider || !tokens || !account) {
    return
  }

  await provider.ready;

  const multicall = new MultiCall(provider);

  const [, balances] = await multicall.getBalances(
    tokens.map((t) => {
      if (isAddressEqual(t.contractAddress, ZEROEX_NATIVE_TOKEN_ADDRESS)) {
        return constants.AddressZero;
      }

      return t.contractAddress;
    }),
    account
  );

  return balances;
}

export async function getTokenBalance(
  token?: { contractAddress: string },
  provider?: providers.BaseProvider,
  account?: string
): Promise<BigNumber | undefined> {
  if (!token || provider || account) {
    return;
  }
  const balance = (await getTokensBalance([token], provider, account));
  if (balance) {
    return balance[0]
  }
  return;

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
  const coingeckoIds = tokens.map((c) => c.coingeckoId).filter(Boolean);

  if (coingeckoIds.length === 0) {
    const results: TokenPrices = {};
    tokens.forEach(token => {
      if (token?.chainId) {
        if (!results[token.chainId]) {
          results[token.chainId] = {};
        }
        results[token.chainId][isAddressEqual(token.address, ZEROEX_NATIVE_TOKEN_ADDRESS)
          ? constants.AddressZero
          : token.address] = {};
      }
    });
    return results;
  }

  const url = `${COINGECKO_ENDPOIT}/simple/price?ids=${coingeckoIds.join(",")}&vs_currencies=${currency}`;

  try {
    const priceResponce = (
      await axios.get<{ [key: string]: { [key: string]: number } }>(url)
    ).data;

    const results: TokenPrices = {};

    for (const key of Object.keys(priceResponce)) {
      const result = priceResponce[key];
      const amount = result[currency];
      const token = tokens.find((c) => c.coingeckoId === key);

      if (token?.chainId) {
        const address = isAddressEqual(token.address, ZEROEX_NATIVE_TOKEN_ADDRESS)
          ? constants.AddressZero
          : token.address;
        if (!results[token.chainId]) {
          results[token.chainId] = {};
        }
        results[token.chainId][address] = { [currency]: amount };
      }
    }

    return results;
  } catch (error) {
    const results: TokenPrices = {};
    tokens.forEach(token => {
      if (token?.chainId) {
        if (!results[token.chainId]) {
          results[token.chainId] = {};
        }
        results[token.chainId][isAddressEqual(token.address, ZEROEX_NATIVE_TOKEN_ADDRESS)
          ? constants.AddressZero
          : token.address] = {};
      }
    });
    return results;
  }
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

export const getCoinPricesByCID = async ({
  coingeckoIds,
  currency = 'usd',
}: {
  coingeckoIds: string[];
  currency: string;
}): Promise<{ [key: string]: { [key: string]: number } }> => {
  const priceResponce = await axios.get(
    `${COINGECKO_ENDPOIT}/simple/price?ids=${coingeckoIds.concat(
      ','
    )}&vs_currencies=${currency}`
  );

  return priceResponce.data as { [key: string]: { [key: string]: number } };
};