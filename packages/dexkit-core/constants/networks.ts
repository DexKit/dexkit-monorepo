import {
  COINGECKO_IDS,
  EVM_CHAINS,
  WRAPPED_TOKEN_ADDRESSES,
} from "@dexkit/evm-chains/constants";
import { Network } from "../types";
import { ChainId } from "./enums";
import {
  EVM_CHAIN_IMAGES,
  GET_EVM_CHAIN_IMAGE,
  UNKNOWN_LOGO_URL,
} from "./evmChainImages";

const IS_TESTNET =
  typeof process !== "undefined"
    ? process?.env.NODE_ENV !== "development"
    : true;

export const NETWORK_NAME_OVERLAP: { [key: number]: string } = {
  [ChainId.Ethereum]: "Ethereum",
  [ChainId.Polygon]: "Polygon",
  [ChainId.BSC]: "Smart Chain",
  [ChainId.Avax]: "Avalanche",
  [ChainId.Fantom]: "Fantom",
  [ChainId.Arbitrum]: "Arbitrum",

  [ChainId.Optimism]: "Optimism",
  [ChainId.Base]: "Base",
};

export const PROVIDER_OVERLAP: { [key: number]: string } = {
  [ChainId.Ethereum]: "https://eth.llamarpc.com",
  [ChainId.Arbitrum]: "https://arb1.arbitrum.io/rpc",
  [ChainId.Optimism]: "https://mainnet.optimism.io",
  [ChainId.Avax]: "https://api.avax.network/ext/bc/C/rpc",
  [ChainId.BSC]: "https://bsc-dataseed.bnbchain.org",
  [ChainId.Fantom]: "https://rpc.ftm.tools",
  [ChainId.Polygon]: `https://polygon-rpc.com/`,
  [ChainId.Base]: "https://mainnet.base.org",
  [ChainId.Mumbai]: `https://rpc.ankr.com/polygon_mumbai`,
  [ChainId.Goerli]: "https://rpc.ankr.com/eth_goerli",
};

const NETS: { [key: number]: Network } = {};

for (let index = 0; index < EVM_CHAINS.length; index++) {
  const element = EVM_CHAINS[index];
  if (element.chainId) {
    NETS[element.chainId] = {
      chainId: element.chainId,
      symbol: element.shortName.toUpperCase(),
      explorerUrl: element.explorers[0].url,
      name: NETWORK_NAME_OVERLAP[element.chainId]
        ? NETWORK_NAME_OVERLAP[element.chainId]
        : element.name,
      slug: element?.slug ? element?.slug : element.shortName,
      coingeckoPlatformId: COINGECKO_IDS.find(
        (c) => c.chain_identifier === element.chainId
      )?.native_coin_id,
      wrappedAddress: WRAPPED_TOKEN_ADDRESSES[element.chainId],
      imageUrl:
        GET_EVM_CHAIN_IMAGE({ chainId: element.chainId }) || UNKNOWN_LOGO_URL,
      coinImageUrl: EVM_CHAIN_IMAGES[element.chainId]?.coinImageUrl,
      coinName: EVM_CHAIN_IMAGES[element.chainId]?.coinImageUrl
        ? element?.nativeCurrency?.name
        : element?.nativeCurrency?.name,
      coinSymbol: EVM_CHAIN_IMAGES[element.chainId]?.coinImageUrl
        ? element?.nativeCurrency?.symbol
        : element?.nativeCurrency?.symbol,
      providerRpcUrl: PROVIDER_OVERLAP[element.chainId]
        ? PROVIDER_OVERLAP[element.chainId]
        : element.rpc[0],
      testnet: element?.testnet,
    };
  }
}

export const NETWORKS = NETS;

/*export const NETWORKS: { [key: number]: Network } = {
  [ChainId.Ethereum]: {
    chainId: ChainId.Ethereum,
    symbol: "ETH",
    explorerUrl: "https://etherscan.io",
    name: "Ethereum",
    slug: "ethereum",
    coingeckoPlatformId: "ethereum",
    wrappedAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
    providerRpcUrl: `https://eth.llamarpc.com`,
  },
  [ChainId.Optimism]: {
    chainId: ChainId.Optimism,
    symbol: "OP",
    coinName: "Ethereum",
    coinSymbol: 'ETH',
    coinImageUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    explorerUrl: "https://optimistic.etherscan.io",
    name: "Optimism",
    slug: "optimism",
    coingeckoPlatformId: "ethereum",
    wrappedAddress: "0x4200000000000000000000000000000000000006",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
    providerRpcUrl: "https://rpc.ankr.com/optimism",
  },
  [ChainId.BSC]: {
    chainId: ChainId.BSC,
    symbol: "BNB",
    coinName: 'Binance Coin',
    explorerUrl: "https://bscscan.com",
    name: "Smart Chain",
    slug: "bsc",
    coingeckoPlatformId: "binancecoin",
    wrappedAddress: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    providerRpcUrl: "https://bsc-dataseed.bnbchain.org",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png",
  },
  [ChainId.Polygon]: {
    chainId: ChainId.Polygon,
    symbol: "MATIC",
    explorerUrl: "https://polygonscan.com",
    name: "Polygon",
    slug: "polygon",
    coingeckoPlatformId: "matic-network",
    wrappedAddress: `0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270`,
    providerRpcUrl: `https://polygon-rpc.com`,
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
  },
  [ChainId.Fantom]: {
    chainId: ChainId.Fantom,
    symbol: "FTM",
    explorerUrl: "https://ftmscan.com",
    name: "Fantom",
    slug: "fantom",
    coingeckoPlatformId: "fantom",
    wrappedAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png",
    providerRpcUrl: "https://rpc.ftm.tools",
  },
  [ChainId.Arbitrum]: {
    chainId: ChainId.Arbitrum,
    symbol: "ARB",
    coinName: "Ethereum",
    coinSymbol: 'ETH',
    coinImageUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    explorerUrl: "https://arbiscan.io",
    name: "Arbitrum",
    slug: "arbitrum",
    coingeckoPlatformId: "ethereum",
    wrappedAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
    providerRpcUrl: "https://rpc.ankr.com/arbitrum",
  },



  [ChainId.Avax]: {
    chainId: ChainId.Avax,
    symbol: "AVAX",
    explorerUrl: "https://snowtrace.io",
    name: "Avalanche",
    slug: "avalanche",
    coingeckoPlatformId: "avalanche-2",
    wrappedAddress: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    providerRpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
  },
  [ChainId.Base]: {
    chainId: ChainId.Base,
    symbol: "BASE",
    coinName: "Ethereum",
    coinSymbol: 'ETH',
    coinImageUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    explorerUrl: "https://basescan.org",
    name: "Base",
    slug: "base",
    coingeckoPlatformId: "base",
    wrappedAddress: "0x4200000000000000000000000000000000000006",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png",
    providerRpcUrl: "https://mainnet.base.org",
  },

  [ChainId.Goerli]: {
    chainId: ChainId.Goerli,
    symbol: "GoerliETH",
    explorerUrl: "https://goerli.etherscan.io/",
    name: "Goerli",
    slug: "goerli",
    coingeckoPlatformId: "ethereum",
    wrappedAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
    providerRpcUrl: "https://endpoints.omniatech.io/v1/eth/goerli/public",
    testnet: IS_TESTNET,
  },
  [ChainId.Mumbai]: {
    chainId: ChainId.Mumbai,
    symbol: "MATIC",
    explorerUrl: "https://mumbai.polygonscan.com",
    name: "Mumbai",
    slug: "mumbai",
    coingeckoPlatformId: 'matic-network',
    wrappedAddress: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
    providerRpcUrl: `https://rpc.ankr.com/polygon_mumbai`,
    testnet: IS_TESTNET,
  },
};*/

export const NETWORK_PROVIDER_URL = (chainId?: ChainId) =>
  chainId && NETWORKS[chainId] ? NETWORKS[chainId].providerRpcUrl : undefined;

export const NETWORK_NAME = (chainId?: ChainId) =>
  chainId && NETWORKS[chainId] ? NETWORKS[chainId].name : undefined;

export const NETWORK_EXPLORER = (chainId?: ChainId) =>
  chainId && NETWORKS[chainId] ? NETWORKS[chainId].explorerUrl : undefined;

export const NETWORK_SLUG = (chainId?: ChainId) =>
  chainId && NETWORKS[chainId] ? NETWORKS[chainId].slug : undefined;

export const NETWORK_IMAGE = (chainId?: ChainId) =>
  chainId && NETWORKS[chainId] ? NETWORKS[chainId].imageUrl : undefined;

export const NETWORK_SYMBOL = (chainId?: ChainId) =>
  chainId && NETWORKS[chainId] ? NETWORKS[chainId].symbol : undefined;

export const NETWORK_COIN_SYMBOL = (chainId?: ChainId) =>
  chainId && NETWORKS[chainId]
    ? NETWORKS[chainId]?.coinSymbol
      ? NETWORKS[chainId]?.coinSymbol
      : NETWORKS[chainId].symbol
    : undefined;

export const NETWORK_COIN_NAME = (chainId?: ChainId) =>
  chainId && NETWORKS[chainId]
    ? NETWORKS[chainId]?.coinName
      ? NETWORKS[chainId]?.coinName
      : NETWORKS[chainId].name
    : undefined;

export const NETWORK_COIN_IMAGE = (chainId?: ChainId) =>
  chainId && NETWORKS[chainId]
    ? NETWORKS[chainId]?.coinImageUrl
      ? NETWORKS[chainId]?.coinImageUrl
      : NETWORKS[chainId].imageUrl
    : undefined;

export const NETWORK_FROM_SLUG = (slug?: string) => {
  if (slug) {
    const network = Object.values(NETWORKS).find(
      (n) => n.slug?.toLowerCase() === slug.toLowerCase()
    );
    if (network) {
      return network;
    }
  }
};
// We are using 0x API wrapped token feature
export const WRAPPED_TOKEN_ADDRESS = (chainId?: ChainId) => undefined;
// chainId && NETWORKS[chainId] ? NETWORKS[chainId].wrappedAddress : undefined;
