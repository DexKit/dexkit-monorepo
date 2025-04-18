import { ChainId } from '@/modules/common/constants/enums';
import { NETWORKS } from '@/modules/common/constants/networks';
import { Network } from '@/modules/common/types/networks';
import MultiCall from '@indexed-finance/multicall';
import axios from 'axios';
import { ethers } from 'ethers';
import { COINGECKO_ENDPOIT, COINGECKO_PLATFORM_ID } from '../constants';
import { CoinTypes } from '../constants/enums';
import {
  AccountBalance,
  BlockchainNetwork,
  Coin,
  CoinPrices,
  EvmCoin,
} from '../types';

export async function getEvmAccountBalances(
  network: BlockchainNetwork,
  multicall: MultiCall,
  coinAddresses: string[],
  address: string
): Promise<AccountBalance> {
  const [, balances] = await multicall.getBalances(coinAddresses, address);

  return { address, balances, network };
}

export async function getAccountsBalanceEvmByNetwork(
  network: BlockchainNetwork,
  coins: EvmCoin[],
  addresses: string[]
): Promise<AccountBalance[]> {
  if (!network.chainId) {
    return [];
  }

  const providerRpcUrl = NETWORKS[network.chainId].providerRpcUrl;

  if (!providerRpcUrl) {
    return [];
  }

  const provider = new ethers.providers.JsonRpcProvider(providerRpcUrl);

  await provider.ready;

  const coinAddresses = coins.map((c) => {
    if (c.coinType === CoinTypes.EVM_ERC20) {
      return c.contractAddress;
    }

    return ethers.constants.AddressZero;
  });

  const multicall = new MultiCall(provider);

  const results: Promise<AccountBalance>[] = [];

  for (const address of addresses) {
    results.push(
      getEvmAccountBalances(network, multicall, coinAddresses, address)
    );
  }

  return Promise.all(results);
}

export const getTokenPrices = async ({
  chainId,
  addresses,
  currency = 'usd',
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
      ','
    )}&vs_currencies=${currency}`
  );

  return priceResponce.data as { [key: string]: { [key: string]: number } };
};

export const getCoinPrices = async ({
  coins,
  currency = 'usd',
}: {
  coins: Coin[];
  currency: string;
}): Promise<CoinPrices> => {
  const priceResponce = (
    await axios.get<{ [key: string]: { [key: string]: number } }>(
      `${COINGECKO_ENDPOIT}/simple/price?ids=${coins
        .map((c) => c.coingeckoId)
        .join(',')}&vs_currencies=${currency}`
    )
  ).data;

  const results: CoinPrices = {};

  for (const key of Object.keys(priceResponce)) {
    const result = priceResponce[key];
    const amount = result[currency];
    const coin = coins.find((c) => c.coingeckoId === key);

    if (coin?.network?.chainId) {
      results[coin?.network?.chainId] = {
        [ethers.constants.AddressZero]: { [currency]: amount },
      };
    }
  }

  return results;
};

export async function getPricesByChain(
  chain: Network,
  coinAddresses: string[],
  currency: string
): Promise<CoinPrices> {
  const prices: CoinPrices = {};

  const result = await getTokenPrices({
    chainId: chain.chainId,
    addresses: coinAddresses,
    currency,
  });

  prices[chain.chainId] = result;

  return prices;
}
