import { zeroAddress } from "viem";
import { COINGECKO_ENDPOIT, COINGECKO_PLATFORM_ID, ZEROEX_NATIVE_TOKEN_ADDRESS } from "../constants";
import { Token, TokenPrices } from "../types";
import { isAddressEqual } from "../utils";
export * from './balances';

import { defineChain } from "thirdweb/chains";

import { ChainId } from "@dexkit/core/constants/enums";
import { client } from "@dexkit/wallet-connectors/thirdweb/client";
import axios from "axios";
import { encode, getContract, prepareContractCall, readContract, resolveMethod } from "thirdweb";
import { allowance } from "thirdweb/extensions/erc20";
import type { Account } from "thirdweb/wallets";


export const getERC20TokenAllowance = async ({ chainId,
  tokenAddress, owner, spender



}: {
  chainId: number
  tokenAddress: string,
  owner: string,
  spender: string
}

): Promise<bigint> => {
  const contract = getContract({
    chain: defineChain(chainId),
    address: tokenAddress,
    client
  })

  return await allowance({
    contract,
    owner: owner,
    spender: spender
  });
};

export const hasSufficientAllowance = async ({
  spender,
  tokenAddress,
  amount,
  chainId,
  owner,
}: {

  spender: string;
  tokenAddress: string;
  amount: bigint;
  chainId?: number
  owner: string

}) => {
  if (!owner || !chainId) {
    throw new Error("no provider or account");
  }

  if (isAddressEqual(spender, zeroAddress)) {
    return true;
  }

  const contract = getContract({
    chain: defineChain(chainId),
    address: tokenAddress,
    client
  })

  const allowanceResult = await allowance({
    contract,
    owner: owner,
    spender: spender
  });


  return allowanceResult >= amount;
};



export async function getTokensBalance({
  tokens, activeAccount, chainId
}: {
  tokens?: { contractAddress: string }[],
  activeAccount?: Account,
  chainId?: number
}

): Promise<{ [key: string]: bigint } | undefined> {
  if (!tokens || !activeAccount || !chainId) {
    return
  }

  const rawTxs = tokens.map((t) => {
    const contract = getContract({
      chain: defineChain(chainId),
      address: t.contractAddress,
      client
    });

    return {
      address: t.contractAddress, tx: prepareContractCall({
        contract: contract,
        method: "function balanceOf(address owner) view returns (uint256)",
        params: [t.contractAddress],
      })
    }
  });

  const contract = getContract({
    chain: defineChain(chainId),
    address: tokens[0].contractAddress,
    client
  })

  const encodedTxs = await Promise.all(rawTxs.map(async (tx) => { return { target: tx.address, callData: await encode(tx.tx) } }));
  //const multiCallTransaction = await aggregate({ contract, calls: encodedTxs });

  const data = await readContract({ contract, method: resolveMethod('aggregate'), params: [encodedTxs] })

  /*const tx = await sendAndConfirmTransaction({
    transaction: multiCallTransaction,
    account: activeAccount,
  });
  const data = await multiCallTransaction.data
  console.log('multicall');
  console.log(data);
  console.log(tx);*/

  return data as unknown as { [key: string]: bigint }


}

export async function getTokensAllowances({
  tokens, activeAccount, chainId, spender
}: {
  tokens?: { contractAddress: string }[],
  activeAccount?: Account,
  chainId?: number
  spender?: string
}

): Promise<{ [key: string]: bigint } | undefined> {
  if (!tokens || !activeAccount || !chainId || !spender) {
    return
  }

  const rawTxs = tokens.map((t) => {
    const contract = getContract({
      chain: defineChain(chainId),
      address: t.contractAddress,
      client
    });

    return {
      address: t.contractAddress, tx: prepareContractCall({
        contract: contract,
        method: "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
        params: [activeAccount.address, spender],
      })
    }
  });

  const contract = getContract({
    chain: defineChain(chainId),
    address: tokens[0].contractAddress,
    client
  })

  const encodedTxs = await Promise.all(rawTxs.map(async (tx) => { return { target: tx.address, callData: await encode(tx.tx) } }));
  /* const multiCallTransaction = await aggregate({ contract, calls: encodedTxs });
   const tx = await sendAndConfirmTransaction({
     transaction: multiCallTransaction,
     account: activeAccount,
   });
   const data = await multiCallTransaction.data*/

  const data = await readContract({ contract, method: resolveMethod('aggregate'), params: [encodedTxs] })

  return data as unknown as { [key: string]: bigint }


}

export async function getTokenBalance({
  token, activeAccount, chainId
}: {
  token?: { contractAddress: string },
  activeAccount?: Account,
  chainId?: number
}
): Promise<BigInt | undefined> {
  if (!token || chainId || activeAccount) {
    return;
  }
  const balance = (await getTokensBalance({ tokens: [token], chainId, activeAccount }));
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
          ? zeroAddress
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