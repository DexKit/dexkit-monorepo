import { ChainId } from '@/modules/common/constants/enums';
import { BlockchainNetwork, Coin } from '../types';
import { CoinTypes, Networks } from './enums';

import ethereumIcon from 'public/icons/networks/eth.png';
import polygonIcon from 'public/icons/networks/polygon.png';

export const EVM_NETWORKS = [
  Networks.ETHEREUM,
  Networks.POLYGON,
  Networks.SMART_CHAIN,
  Networks.FANTOM,
];

export const BLOCKCHAIN_NETWORKS: { [key: string]: BlockchainNetwork } = {
  // bitcoin: { id: Networks.BITCOIN, name: 'Bitcoin' },
  ethereum: {
    id: Networks.ETHEREUM,
    name: 'Ethereum',
    chainId: ChainId.Ethereum,
    icon: ethereumIcon.src,
    coingeckoPlatformId: 'ethereum',
  },
  polygon: {
    id: Networks.POLYGON,
    name: 'Polygon',
    chainId: ChainId.Polygon,
    icon: polygonIcon.src,
    coingeckoPlatformId: 'polygon-pos',
  },
  'binance-smart-chain': {
    id: Networks.SMART_CHAIN,
    name: 'Smart Chain',
    chainId: ChainId.BSC,
    coingeckoPlatformId: 'binance-smart-chain',
  },
  fantom: {
    id: Networks.FANTOM,
    name: 'Fantom',
    chainId: ChainId.Fantom,
    coingeckoPlatformId: 'fantom',
  },
  // solana: { id: Networks.SOLANA, name: 'Solana' },
};

export const POLYGON_NATIVE_COIN: Coin = {
  coinType: CoinTypes.EVM_NATIVE,
  network: BLOCKCHAIN_NETWORKS[Networks.POLYGON],
  coingeckoId: 'matic-network',
  decimals: 18,
  name: 'Matic',
  symbol: 'MATIC',
  imageUrl:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
};

export const ETHEREUM_NATIVE_COIN: Coin = {
  coinType: CoinTypes.EVM_NATIVE,
  coingeckoId: 'ethereum',
  network: BLOCKCHAIN_NETWORKS[Networks.ETHEREUM],
  decimals: 18,
  name: 'Ethereum',
  symbol: 'ETH',
  imageUrl:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
};

export const SMART_CHAIN_NATIVE_COIN: Coin = {
  coinType: CoinTypes.EVM_NATIVE,
  network: BLOCKCHAIN_NETWORKS[Networks.SMART_CHAIN],
  coingeckoId: 'bnb',
  decimals: 18,
  name: 'BSC Token',
  symbol: 'BNB',
  imageUrl:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png',
};

export const FANTOM_NATIVE_COIN: Coin = {
  coinType: CoinTypes.EVM_NATIVE,
  network: BLOCKCHAIN_NETWORKS[Networks.FANTOM],
  coingeckoId: 'fantom',
  decimals: 18,
  name: 'FTM Token',
  symbol: 'FTM',
  imageUrl:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
};

export const USDC_COIN_POLYGON: Coin = {
  coinType: CoinTypes.EVM_ERC20,
  network: BLOCKCHAIN_NETWORKS[Networks.POLYGON],
  decimals: 6,
  name: 'US Dollar Coin',
  symbol: 'USDC',
  coingeckoId: 'usd-coin',
  contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
};

export const USDC_COIN_ETHEREUM: Coin = {
  coinType: CoinTypes.EVM_ERC20,
  network: BLOCKCHAIN_NETWORKS[Networks.ETHEREUM],
  decimals: 6,
  name: 'Tether',
  symbol: 'USDT',
  coingeckoId: 'tether',
  contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
};

export const COIN_LIST: Coin[] = [
  // {
  //   network: BLOCKCHAIN_NETWORKS[Networks.BITCOIN],
  //   coinType: CoinTypes.BITCOIN_NATIVE,
  //   decimals: 8,
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   coingeckoId: 'bitcoin',
  //   imageUrl:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
  // },
  // {
  //   network: BLOCKCHAIN_NETWORKS[Networks.SOLANA],
  //   coinType: CoinTypes.SOLANA_NATIVE,
  //   decimals: 18,
  //   name: 'Solana',
  //   symbol: 'SOL',
  //   coingeckoId: 'solana',
  //   imageUrl:
  //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
  // },
  POLYGON_NATIVE_COIN,
  ETHEREUM_NATIVE_COIN,
  SMART_CHAIN_NATIVE_COIN,
  FANTOM_NATIVE_COIN,
  {
    coinType: CoinTypes.EVM_ERC20,
    coingeckoId: 'uniswap',
    network: BLOCKCHAIN_NETWORKS[Networks.ETHEREUM],
    decimals: 18,
    name: 'Uniswap',
    symbol: 'UNI',
    isHidden: true,
    contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  },
  USDC_COIN_ETHEREUM,
  {
    coinType: CoinTypes.EVM_ERC20,
    network: BLOCKCHAIN_NETWORKS[Networks.POLYGON],
    decimals: 6,
    name: 'Tether',
    symbol: 'USDT',
    coingeckoId: 'tether',
    contractAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  },
  USDC_COIN_POLYGON,
];

export const COINGECKO_ENDPOIT = 'https://api.coingecko.com/api/v3';

export const COINGECKO_PLATFORM_ID: { [key: number]: string } = {
  [ChainId.Ethereum]: 'ethereum',
  [ChainId.Polygon]: 'polygon-pos',
  [ChainId.BSC]: 'binance-smart-chain',
  [ChainId.Avax]: 'avalanche',
  [ChainId.Celo]: 'celo',
  [ChainId.Fantom]: 'fantom',
  [ChainId.Optimism]: 'optimistic-ethereum',
};

export const ZERO_EX_CHAIN_PREFIX = (chainId?: number) => {
  switch (chainId) {
    case ChainId.Polygon:
      return 'polygon.';
    case ChainId.Mumbai:
      return 'mumbai.';
    case 42220:
      return 'celo.';
    case ChainId.Ropsten:
      return 'ropsten.';
    case ChainId.BSC:
      return 'bsc.';
    case 43114:
      return 'avalanche.';
    case 250:
      return 'fantom.';
    case 10:
      return 'optimism.';
    default:
      return '';
  }
};

export const ZERO_EX_QUOTE_ENDPOINT = (chainId?: number) =>
  `https://${ZERO_EX_CHAIN_PREFIX(chainId)}api.0x.org/swap/v1/quote`;

export const ZERO_EX_TOKENS_ENDPOINT = (chainId?: number) =>
  `https://${ZERO_EX_CHAIN_PREFIX(chainId)}api.0x.org/swap/v1/tokens`;

export const FEATURED_COINS: { [key: number]: Coin[] } = {
  [ChainId.Polygon]: [POLYGON_NATIVE_COIN, USDC_COIN_POLYGON],
  [ChainId.Ethereum]: [USDC_COIN_ETHEREUM],
};
