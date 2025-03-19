import { ChainId } from '@/modules/common/constants/enums';
import { build, BuildInput } from 'eth-url-parser';
import { BigNumber, ethers } from 'ethers';
import { BLOCKCHAIN_NETWORKS } from '../constants';
import { CoinTypes } from '../constants/enums';
import { AccountBalance, Coin, CoinPrices } from '../types';

export function buildEtherReceiveAddress({
  receiver,
  chainId,
  contractAddress,
}: {
  receiver: string;
  chainId?: number;
  contractAddress?: string;
}) {
  if (receiver && chainId) {
    if (contractAddress) {
      let params: BuildInput = {
        chain_id: `${chainId}` as `${number}`,
        target_address: contractAddress,
      };
      params.function_name = 'transfer';

      params.parameters = {};

      params.parameters['address'] = receiver;
      params.parameters['uint256'] = '1000000';

      return build(params);
    } else {
      let params: BuildInput = {
        chain_id: `${chainId}` as `${number}`,
        target_address: receiver,
      };

      return build(params);
    }
  }

  return '';
}

export function walletFiatTotal(
  balances: AccountBalance[],
  prices: CoinPrices,
  coins: Coin[],
  currency: string
) {
  let totalSum = 0;

  for (const coin of coins) {
    const isErc20Coin = coin.coinType === CoinTypes.EVM_ERC20;
    const isEvmNativeCoin = coin.coinType === CoinTypes.EVM_NATIVE;

    const totalCurrency = (() => {
      if (isErc20Coin || isEvmNativeCoin) {
        let total = BigNumber.from(0);

        for (const coinBalance of balances.filter(
          (b) => b.network.id === coin.network.id
        )) {
          total = total.add(
            BigNumber.from(
              coinBalance.balances[
                isErc20Coin
                  ? coin.contractAddress
                  : ethers.constants.AddressZero
              ]
            )
          );
        }

        if (coin.network.chainId) {
          const chainPrices = prices[coin.network.chainId] || {};

          const coinPrice =
            chainPrices[
              isErc20Coin ? coin.contractAddress : ethers.constants.AddressZero
            ] || {};

          const ratio = coinPrice[currency];

          if (ratio > 0) {
            const amount = parseFloat(
              ethers.utils.formatUnits(total, coin.decimals)
            );

            return ratio * amount;
          }
        }
      }

      return 0;
    })();

    totalSum = totalSum + totalCurrency;
  }

  return totalSum;
}

export function coinKey(coin: Coin): string {
  return `${coin.network.id}-${coin.decimals}-${coin.coingeckoId}-${coin.name}`;
}

export function truncateDecimal(str: string, maxDecimalDigits: number) {
  if (str.includes('.')) {
    const parts = str.split('.');
    return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
  }
  return str;
}

export function getBlockchainNetworkByChainId(chainId: ChainId) {
  return Object.keys(BLOCKCHAIN_NETWORKS)
    .map((key) => BLOCKCHAIN_NETWORKS[key])
    .flat()
    .find((b) => b.chainId === chainId);
}
