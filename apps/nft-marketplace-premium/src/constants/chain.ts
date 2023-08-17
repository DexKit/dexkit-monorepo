import { Network } from '../types/chains';

import { ChainId } from '@dexkit/core/constants/enums';
import arbitrumIcon from '../../public/assets/images/icons/arbitrum.png';
import avaxIcon from '../../public/assets/images/icons/avax.png';
import bscIcon from '../../public/assets/images/icons/bnb.svg';
import ethIcon from '../../public/assets/images/icons/eth.png';
import fantomIcon from '../../public/assets/images/icons/fantom.svg';
import optimismIcon from '../../public/assets/images/icons/optimism.svg';
import polygonIcon from '../../public/assets/images/icons/polygon.png';

const alchemyKey =
  process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || process.env.ALCHEMY_API_KEY;

export const NETWORKS: { [key: number]: Network } = {
  [ChainId.Ethereum]: {
    chainId: ChainId.Ethereum,
    symbol: 'ETH',
    explorerUrl: 'https://etherscan.io',
    name: 'Ethereum',
    slug: 'ethereum',
    coingeckoId: 'ethereum',
    wrappedAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    imageUrl: ethIcon.src,
    providerRpcUrl: `https://rpc.ankr.com/eth`,
  },
  [ChainId.Goerli]: {
    chainId: ChainId.Goerli,
    symbol: 'ETH',
    explorerUrl: 'https://goerli.etherscan.io/',
    name: 'Goerli',
    slug: 'goerli',
    coingeckoId: 'ethereum',
    wrappedAddress: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    imageUrl: ethIcon.src,
    providerRpcUrl: `https://eth-goerli.alchemyapi.io/v2/${alchemyKey}`,
    testnet: true,
  },
  [ChainId.Mumbai]: {
    chainId: ChainId.Mumbai,
    symbol: 'MATIC',
    explorerUrl: 'https://mumbai.polygonscan.com',
    name: 'Mumbai',
    slug: 'mumbai',
    wrappedAddress: '0x9c3c9283d3e44854697cd22d3faa240cfb032889',
    imageUrl: polygonIcon.src,
    providerRpcUrl: `https://rpc.ankr.com/polygon_mumbai`,
    testnet: true,
  },
  [ChainId.Polygon]: {
    chainId: ChainId.Polygon,
    symbol: 'Poly',
    explorerUrl: 'https://polygonscan.com',
    name: 'Polygon',
    slug: 'polygon',
    coingeckoId: 'matic-network',
    wrappedAddress: `0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270`,
    providerRpcUrl: `https://polygon-rpc.com/`,
    imageUrl: polygonIcon.src,
    nativeCurrency: {
      name: 'Matic',
      decimals: 18,
      symbol: 'MATIC',
    },
  },
  [ChainId.BSC]: {
    chainId: ChainId.BSC,
    symbol: 'BSC',
    explorerUrl: 'https://bscscan.com',
    name: 'Smart Chain',
    slug: 'bsc',
    coingeckoId: 'binancecoin',
    wrappedAddress: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    providerRpcUrl: 'https://bscrpc.com',
    imageUrl: bscIcon.src,
    nativeCurrency: {
      name: 'Binance coin',
      decimals: 18,
      symbol: 'BNB',
    },
  },
  [ChainId.Avax]: {
    chainId: ChainId.Avax,
    symbol: 'AVAX',
    explorerUrl: 'https://snowtrace.io',
    name: 'Avalanche',
    slug: 'avalanche',
    coingeckoId: 'avalanche-2',
    wrappedAddress: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    imageUrl: avaxIcon.src,
    providerRpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
  },
  [ChainId.Fantom]: {
    chainId: ChainId.Fantom,
    symbol: 'FTM',
    explorerUrl: 'https://ftmscan.com',
    name: 'Fantom',
    slug: 'fantom',
    coingeckoId: 'fantom',
    wrappedAddress: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    imageUrl: fantomIcon.src,
    providerRpcUrl: 'https://rpc.ftm.tools',
  },
  [ChainId.Optimism]: {
    chainId: ChainId.Optimism,
    nativeCurrencyUrl: ethIcon.src,
    symbol: 'OP',
    explorerUrl: 'https://optimistic.etherscan.io',
    name: 'Optimism',
    slug: 'optimism',
    coingeckoId: 'ethereum',
    wrappedAddress: '0x4200000000000000000000000000000000000006',
    imageUrl: optimismIcon.src,
    providerRpcUrl: 'https://mainnet.optimism.io',
    nativeCurrency: {
      name: 'Ethereum',
      decimals: 18,
      symbol: 'ETH',
    },
  },
  [ChainId.Arbitrum]: {
    chainId: ChainId.Arbitrum,
    symbol: 'ARB',
    explorerUrl: 'https://arbiscan.io/',
    name: 'Arbitrum',
    slug: 'arbitrum',
    coingeckoId: 'ethereum',
    wrappedAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    nativeCurrencyUrl: ethIcon.src,
    imageUrl: arbitrumIcon.src,
    providerRpcUrl: 'https://arb1.arbitrum.io/rpc',
    nativeCurrency: {
      name: 'Ethereum',
      decimals: 18,
      symbol: 'ETH',
    },
  },
  [ChainId.Base]: {
    chainId: ChainId.Base,
    symbol: 'BASE',
    explorerUrl: 'https://basescan.org',
    name: 'Base',
    slug: 'base',
    coingeckoId: 'ethereum',
    wrappedAddress: '0x4200000000000000000000000000000000000006',
    nativeCurrencyUrl: ethIcon.src,
    imageUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png",
    providerRpcUrl: "https://mainnet.base.org",
    nativeCurrency: {
      name: 'Ethereum',
      decimals: 18,
      symbol: 'ETH',
    },
  }
};

