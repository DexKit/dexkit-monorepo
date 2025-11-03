
import { ChainId } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/ui/modules/swap/constants";

export const GOERLI_UNI_TOKEN: Token = {
  chainId: ChainId.Goerli,
  address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  name: "Uniswap",
  symbol: "UNI",
  coingeckoId: "",
  decimals: 18,
};

export const GOERLI_WETH_TOKEN: Token = {
  chainId: ChainId.Goerli,
  address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  name: "Wrapped Ether",
  symbol: "WETH",
  coingeckoId: "",
  decimals: 18,
  isWrapped: true,
};

export const GOERLI_ETHEREUM_TOKEN: Token = {
  chainId: ChainId.Goerli,
  address: ZEROEX_NATIVE_TOKEN_ADDRESS,
  name: "Ethereum",
  symbol: "ETH",
  coingeckoId: "",
  decimals: 18,
};

export const POLYGON_USDT_TOKEN: Token = {
  chainId: ChainId.Polygon,
  address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
};

export const TEST_TOKENS = [
  GOERLI_ETHEREUM_TOKEN,
  GOERLI_WETH_TOKEN,
  GOERLI_UNI_TOKEN,
  POLYGON_USDT_TOKEN,
];
