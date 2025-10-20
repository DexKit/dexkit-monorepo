import { ChainId } from "./enums";

import { Token } from "../types";
import { isAddressEqual } from "../utils";
import { getAddress } from '../utils/ethers/getAddress';
import { isAddress } from '../utils/ethers/isAddress';
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "./zrx";
export { ZEROEX_NATIVE_TOKEN_ADDRESS } from "./zrx";




export * from "./enums";

export const DKAPI_INVALID_ADDRESSES = [
  "0x0000000000000000000000000000000000001010",
];

export const MULTICALL_NATIVE_TOKEN_ADDRESS =
  '0x0000000000000000000000000000000000000000';

export const COINGECKO_ENDPOIT = "https://api.coingecko.com/api/v3";

export const COINGECKO_PLATFORM_ID: { [key: number]: string } = {
  [ChainId.Ethereum]: "ethereum",
  [ChainId.Polygon]: "polygon-pos",
  [ChainId.BSC]: "binance-smart-chain",
  [ChainId.Avax]: "avalanche-2",
  [ChainId.Celo]: "celo",
  [ChainId.Arbitrum]: "arbitrum-one",
  [ChainId.Optimism]: "optimistic-ethereum",
  [ChainId.Base]: "base",
  [ChainId.Linea]: "linea",
  [ChainId.Scroll]: "scroll",
  [ChainId.Mantle]: "mantle-network",
  [ChainId.Blast]: "blast",
  [ChainId.Mode]: "mode",
};




export function TOKEN_ICON_URL(addr: string, chainId?: ChainId) {
  if (!isAddress(addr)) {
    return;
  }

  const address = getAddress(addr);

  if (isAddressEqual(address, ZEROEX_NATIVE_TOKEN_ADDRESS)) {
    switch (chainId) {
      case ChainId.Ethereum:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png`;
      case ChainId.Polygon:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png`;
      case ChainId.Avax:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png`;
      case ChainId.BSC:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png`;
      case ChainId.Celo:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/info/logo.png`;
      case ChainId.Optimism:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png`;
      case ChainId.Arbitrum:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png`;
      case ChainId.Base:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png`;
      case ChainId.Linea:
      case ChainId.Scroll:
      case ChainId.Mantle:
      case ChainId.Blast:
      case ChainId.Mode:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png`;
      default:
        return "";
    }
  }

  switch (chainId) {
    case ChainId.Ethereum:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
    case ChainId.Polygon:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/${address}/logo.png`;
    case ChainId.Avax:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/assets/${address}/logo.png`;
    case ChainId.BSC:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/${address}/logo.png`;
    case ChainId.Celo:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/assets/${address}/logo.png`;
    case ChainId.Optimism:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/${address}/logo.png`;
    case ChainId.Arbitrum:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/${address}/logo.png`;
    case ChainId.Base:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/assets/${address}/logo.png`;
    // Nuevas redes compatibles con 0x API v2 2025 - usar Ethereum como fallback para iconos
    case ChainId.Linea:
    case ChainId.Scroll:
    case ChainId.Mantle:
    case ChainId.Blast:
    case ChainId.Mode:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
    default:
      return "";
  }
}

export const GOERLI_ETHEREUM_TOKEN: Token = {
  chainId: ChainId.Goerli,
  address: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "Ethereum",
  symbol: "ETH",
  coingeckoId: "",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
};

export const ETHEREUM_TOKEN: Token = {
  chainId: ChainId.Ethereum,
  address: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "Ethereum",
  symbol: "ETH",
  coingeckoId: "ethereum",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
};

export const BNB_TOKEN: Token = {
  chainId: ChainId.BSC,
  address: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "BNB",
  symbol: "BNB",
  coingeckoId: "binance-smart-chain",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png",
};

export const MATIC_TOKEN: Token = {
  chainId: ChainId.Polygon,
  address: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "Matic",
  symbol: "MATIC",
  coingeckoId: "matic-network",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
};

export const CRONOS_TOKEN: Token = {
  chainId: ChainId.Cronos,
  address: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "Cronos",
  symbol: "CRO",
  coingeckoId: "cronos",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cronos/info/logo.png",
};

export const OPTIMISM_TOKEN: Token = {
  chainId: ChainId.Optimism,
  address: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "Optimism",
  symbol: "ETH",
  coingeckoId: "optimism",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
};

export const AVALANCHE_TOKEN: Token = {
  chainId: ChainId.Avax,
  address: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "Avalanche",
  symbol: "AVAX",
  coingeckoId: "avalanche-2",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png",
};

export const NATIVE_TOKENS: { [key: number]: Token } = {
  [ChainId.Goerli]: GOERLI_ETHEREUM_TOKEN,
  [ChainId.Ethereum]: ETHEREUM_TOKEN,
  [ChainId.Polygon]: MATIC_TOKEN,
  [ChainId.BSC]: BNB_TOKEN,
  [ChainId.Optimism]: ETHEREUM_TOKEN,
  [ChainId.Arbitrum]: ETHEREUM_TOKEN,
  [ChainId.Avax]: AVALANCHE_TOKEN,
  [ChainId.Base]: ETHEREUM_TOKEN,
  // Nuevas redes compatibles con 0x API v2 2025 - todas usan ETH como token nativo
  [ChainId.Linea]: ETHEREUM_TOKEN,
  [ChainId.Scroll]: ETHEREUM_TOKEN,
  [ChainId.Mantle]: ETHEREUM_TOKEN,
  [ChainId.Blast]: ETHEREUM_TOKEN,
  [ChainId.Mode]: ETHEREUM_TOKEN,
  [ChainId.Cronos]: CRONOS_TOKEN,
};



export function GET_NATIVE_TOKEN(chainId: ChainId) {
  return NATIVE_TOKENS[chainId];
}

export const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export const MY_APPS_ENDPOINT =
  process.env.NEXT_PUBLIC_DEXKIT_DASH_ENDPOINT ?? "http://localhost:3005";
