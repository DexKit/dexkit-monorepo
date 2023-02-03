import { ChainId } from "../../src/constants/enum";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "../../src/services/zeroex/constants";
import { Token } from "../../src/types";

export const GOERLI_UNI_TOKEN: Token = {
  chainId: ChainId.Goerli,
  contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  name: "Uniswap",
  symbol: "UNI",
  coingeckoId: "",
  decimals: 18,
};

export const GOERLI_WETH_TOKEN: Token = {
  chainId: ChainId.Goerli,
  contractAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  name: "Wrapped Ether",
  symbol: "WETH",
  coingeckoId: "",
  decimals: 18,
  isWrapped: true,
};

export const GOERLI_ETHEREUM_TOKEN: Token = {
  chainId: ChainId.Goerli,
  contractAddress: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "Ethereum",
  symbol: "ETH",
  coingeckoId: "",
  decimals: 18,
};

export const TEST_TOKENS = [
  GOERLI_ETHEREUM_TOKEN,
  GOERLI_WETH_TOKEN,
  GOERLI_UNI_TOKEN,
];
