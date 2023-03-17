import { Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { ethers } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { metaMask } from "../connectors";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "../services/zeroex/constants";
import { Token } from "../types";
import { isAddressEqual } from "../utils";
import { ChainId } from "./enum";
// import { magic, magicHooks } from '../connectors/magic';

export const CONNECTORS: { [key: string]: [Connector, Web3ReactHooks] } = {
  metamask: [metaMask.connector, metaMask.hooks],
  // magic: [magic, magicHooks],
};

export const WRAPED_TOKEN_ADDRESS: { [key: number]: string } = {
  [ChainId.Goerli]: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  [ChainId.Polygon]: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
};

export function TOKEN_ICON_URL(addr: string, chainId?: ChainId) {
  if (!isAddress(addr)) {
    return;
  }

  const address = ethers.utils.getAddress(addr);

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
      case ChainId.Fantom:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png`;
      case ChainId.Celo:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/info/logo.png`;
      case ChainId.Optimism:
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png`;
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
    case ChainId.Fantom:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/assets/${address}/logo.png`;
    case ChainId.Celo:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/assets/${address}/logo.png`;
    case ChainId.Optimism:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/${address}/logo.png`;
    default:
      return "";
  }
}

export const GOERLI_ETHEREUM_TOKEN: Token = {
  chainId: ChainId.Goerli,
  contractAddress: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "Ethereum",
  symbol: "ETH",
  coingeckoId: "",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
};

export const ETHEREUM_TOKEN: Token = {
  chainId: ChainId.Ethereum,
  contractAddress: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "Ethereum",
  symbol: "ETH",
  coingeckoId: "ethereum",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
};

export const BNB_TOKEN: Token = {
  chainId: ChainId.BSC,
  contractAddress: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "BNB",
  symbol: "BNB",
  coingeckoId: "binance-smart-chain",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png",
};

export const MATIC_TOKEN: Token = {
  chainId: ChainId.Polygon,
  contractAddress: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "Matic",
  symbol: "MATIC",
  coingeckoId: "matic-network",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
};

export const FANTOM_TOKEN: Token = {
  chainId: ChainId.Fantom,
  contractAddress: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "Fantom",
  symbol: "FTM",
  coingeckoId: "fantom",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png",
};

export const OPTIMISM_TOKEN: Token = {
  chainId: ChainId.Optimism,
  contractAddress: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "Optimism",
  symbol: "ETH",
  coingeckoId: "optimism",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
};

export const NATIVE_TOKENS: { [key: number]: Token } = {
  [ChainId.Goerli]: GOERLI_ETHEREUM_TOKEN,
  [ChainId.Ethereum]: ETHEREUM_TOKEN,
  [ChainId.Polygon]: MATIC_TOKEN,
  [ChainId.Fantom]: FANTOM_TOKEN,
  [ChainId.BSC]: BNB_TOKEN,
  [ChainId.Optimism]: OPTIMISM_TOKEN,
};

export function GET_NATIVE_TOKEN(chainId: ChainId) {
  return NATIVE_TOKENS[chainId];
}

export const COINGECKO_ENDPOIT = "https://api.coingecko.com/api/v3";

export const COINGECKO_PLATFORM_ID: { [key: number]: string } = {
  [ChainId.Ethereum]: "ethereum",
  [ChainId.Polygon]: "polygon-pos",
  [ChainId.BSC]: "binance-smart-chain",
  [ChainId.Avax]: "avalanche",
  [ChainId.Celo]: "celo",
  [ChainId.Fantom]: "fantom",
  [ChainId.Optimism]: "optimistic-ethereum",
};
