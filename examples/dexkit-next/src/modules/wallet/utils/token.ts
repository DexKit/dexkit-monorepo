import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '@/modules/common/constants';
import { ChainId } from '@/modules/common/constants/enums';
import { ethers } from 'ethers';
import { CoinTypes } from '../constants/enums';
import { Coin } from '../types';
import { Token } from '../types/swap';

export function TOKEN_ICON_URL(addr: string, chainId?: ChainId) {
  const address = ethers.utils.getAddress(addr);

  switch (chainId) {
    case ChainId.Ethereum:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
    case ChainId.Polygon:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/${address}/logo.png`;
    case ChainId.Avax:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/assets/${address}/logo.png`;
    case ChainId.BSC:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/${address}/logo.png`;
    case ChainId.Fantom:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/assets/${address}/logo.png`;
    case ChainId.Celo:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/assets/${address}/logo.png`;
    case ChainId.Optimism:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/${address}/logo.png`;
    default:
      return '';
  }
}

export function coinsToEvmTokens(coins: Coin[]): Token[] {
  return coins.map((c) => {
    let token = {
      address: '',
      name: c.name,
      chainId: c.network.chainId,
      decimals: c.decimals,
      symbol: c.symbol,
      logoURI: '',
    } as Token;

    if (c.coinType === CoinTypes.EVM_ERC20) {
      token.address = c.contractAddress;
    } else if (c.coinType === CoinTypes.EVM_NATIVE) {
      token.address = ZEROEX_NATIVE_TOKEN_ADDRESS;
    }

    return token;
  });
}
