import { ChainId } from "@dexkit/core";
import { Token } from "@dexkit/core/types";

const USDC_LOGO_URL =
  "https://github.com/trustwallet/assets/blob/master/blockchains/binance/assets/USDC-CD2/logo.png?raw=true";

const DAI_LOGO_URL =
  "https://github.com/trustwallet/assets/blob/master/blockchains/binance/assets/DAI-D75/logo.png?raw=true";

const USDT_LOGO_URL =
  "https://github.com/trustwallet/assets/blob/master/blockchains/binance/assets/USDT-6D8/logo.png?raw=true";

const WRAPPED_ETH_LOGO_URL =
  "https://raw.githubusercontent.com/dexkit/icons/master/token/weth.jpg";

const WRAPPED_BNB_LOGO_URL =
  "https://github.com/trustwallet/assets/blob/master/blockchains/binance/info/logo.png?raw=true";

const WRAPPED_BTC_LOGO_URL =
  "https://raw.githubusercontent.com/dexkit/icons/master/token/wbtc.jpg";

const AVAX_LOGO_URL =
  "https://raw.githubusercontent.com/dexkit/icons/master/token/avax.jpg";

export const DAI_TOKEN: Token = {
  address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
  chainId: ChainId.Polygon,
  decimals: 18,
  name: "DAI",
  symbol: "DAI",
  logoURI: DAI_LOGO_URL,
};

export const USDT_TOKEN: Token = {
  address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Polygon,
  logoURI: USDT_LOGO_URL,
};

export const USDT_TOKEN_ETH: Token = {
  address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Ethereum,
  logoURI: USDT_LOGO_URL,
};

export const USDT_TOKEN_AVAX: Token = {
  address: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Avax,
  logoURI: USDT_LOGO_URL,
};

export const USDT_TOKEN_BSC: Token = {
  address: "0x55d398326f99059ff775485246999027b3197955",
  decimals: 18,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.BSC,
  logoURI: USDT_LOGO_URL,
};

export const USDT_TOKEN_ARB: Token = {
  address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Arbitrum,
  logoURI: USDT_LOGO_URL,
};

export const USDT_TOKEN_OPT: Token = {
  address: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Optimism,
  logoURI: USDT_LOGO_URL,
};

export const USDT_TOKEN_POLYGON: Token = {
  address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Polygon,
  logoURI: USDT_LOGO_URL,
};

export const DAI_TOKEN_BSC: Token = {
  address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
  decimals: 18,
  name: "DAI",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.BSC,
  logoURI: DAI_LOGO_URL,
};

export const DAI_TOKEN_OPT: Token = {
  address: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
  decimals: 18,
  name: "DAI",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Optimism,
  logoURI: DAI_LOGO_URL,
};

export const DAI_TOKEN_POLYGON: Token = {
  address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  decimals: 18,
  name: "DAI",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Polygon,
  logoURI: DAI_LOGO_URL,
};

export const DAI_TOKEN_FANTOM: Token = {
  address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
  decimals: 18,
  name: "DAI",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Fantom,
  logoURI: DAI_LOGO_URL,
};

export const DAI_TOKEN_AVAX: Token = {
  address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
  decimals: 18,
  name: "DAI",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Avax,
  logoURI: DAI_LOGO_URL,
};

export const DAI_TOKEN_ETH: Token = {
  address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  decimals: 18,
  name: "DAI",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Ethereum,
  logoURI: DAI_LOGO_URL,
};

export const DAI_TOKEN_BASE: Token = {
  address: "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
  decimals: 18,
  name: "DAI",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Base,
  logoURI: DAI_LOGO_URL,
};

export const USDC_TOKEN_ETH: Token = {
  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC",
  coingeckoId: "usdc",
  chainId: ChainId.Ethereum,
  logoURI: USDC_LOGO_URL,
};

export const USDC_TOKEN_OPT: Token = {
  address: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC",
  coingeckoId: "usdc",
  chainId: ChainId.Optimism,
  logoURI: USDC_LOGO_URL,
};

export const USDC_TOKEN_BSC: Token = {
  address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC",
  coingeckoId: "usdc",
  chainId: ChainId.BSC,
  logoURI: USDC_LOGO_URL,
};

export const USDC_TOKEN_FANTOM: Token = {
  address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC",
  coingeckoId: "usdc",
  chainId: ChainId.Fantom,
  logoURI: USDC_LOGO_URL,
};

export const USDC_TOKEN_POLYGON: Token = {
  address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC",
  coingeckoId: "usdc",
  chainId: ChainId.Polygon,
  logoURI: USDC_LOGO_URL,
};

export const USDC_TOKEN_AVAX: Token = {
  address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC",
  coingeckoId: "usdc",
  chainId: ChainId.Avax,
  logoURI: USDC_LOGO_URL,
};

export const USDC_TOKEN_BASE: Token = {
  address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC",
  coingeckoId: "usdc",
  chainId: ChainId.Base,
  logoURI: USDC_LOGO_URL,
};

export const KIT_TOKEN: Token = {
  address: "0x4d0def42cf57d6f27cd4983042a55dce1c9f853c",
  decimals: 18,
  name: "DexKit",
  symbol: "KIT",
  coingeckoId: "dexkit",
  chainId: ChainId.Polygon,
};

export const WMATIC_TOKEN: Token = {
  chainId: ChainId.Mumbai,
  name: "Wrapped Matic",
  symbol: "WMATIC",
  address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
  decimals: 18,
};

export const DUMMY_TOKEN: Token = {
  chainId: ChainId.Mumbai,
  address: "0xfe4f5145f6e09952a5ba9e956ed0c25e3fa4c7f1",
  name: "DERC20",
  symbol: "DERC20",
  decimals: 18,
};

export const DEFAULT_BASE_TOKENS = {
  [ChainId.Polygon]: [DAI_TOKEN, USDT_TOKEN],
};

export const DEFAULT_QUOTE_TOKENS = {
  [ChainId.Polygon]: [KIT_TOKEN],
};

export const QUOTE_TOKENS_SUGGESTION = [
  USDT_TOKEN_ETH,
  USDT_TOKEN_ARB,
  USDT_TOKEN_AVAX,
  USDT_TOKEN_OPT,
  USDT_TOKEN_BSC,
  USDT_TOKEN_POLYGON,

  DAI_TOKEN_ETH,
  DAI_TOKEN_AVAX,
  DAI_TOKEN_FANTOM,
  DAI_TOKEN_OPT,
  DAI_TOKEN_POLYGON,
  DAI_TOKEN_BSC,

  USDC_TOKEN_ETH,
  USDC_TOKEN_POLYGON,
  USDC_TOKEN_FANTOM,
  USDC_TOKEN_BSC,
  USDC_TOKEN_AVAX,
  USDC_TOKEN_OPT,
  USDC_TOKEN_BASE,
];

export const WRAPPED_ETH_ETH: Token = {
  chainId: ChainId.Ethereum,
  name: "Wrapped Ether",
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  decimals: 18,
  symbol: "WETH",
  coingeckoId: "ethereum",
  logoURI: WRAPPED_ETH_LOGO_URL,
};

export const WRAPPED_ETH_POLYGON: Token = {
  chainId: ChainId.Polygon,
  name: "Wrapped Ether",
  address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
  decimals: 18,
  symbol: "WETH",
  coingeckoId: "ethereum",

  logoURI: WRAPPED_ETH_LOGO_URL,
};

export const WRAPPED_ETH_FANTOM: Token = {
  chainId: ChainId.Fantom,
  name: "Wrapped Ether",
  address: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
  decimals: 18,
  symbol: "WETH",
  coingeckoId: "ethereum",

  logoURI: WRAPPED_ETH_LOGO_URL,
};

export const WRAPPED_ETH_ARB: Token = {
  chainId: ChainId.Arbitrum,
  name: "Wrapped Ether",
  address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  decimals: 18,
  symbol: "WETH",
  coingeckoId: "ethereum",

  logoURI: WRAPPED_ETH_LOGO_URL,
};

export const WRAPPED_ETH_AVAX: Token = {
  chainId: ChainId.Avax,
  name: "Wrapped Ether",
  address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
  decimals: 18,
  symbol: "WETH",
  coingeckoId: "ethereum",
  logoURI: WRAPPED_ETH_LOGO_URL,
};

export const WRAPPED_ETH_OPT: Token = {
  chainId: ChainId.Optimism,
  address: "0x4200000000000000000000000000000000000006",
  decimals: 18,
  name: "Wrapped Ether",
  symbol: "WETH",
  coingeckoId: "ethereum",

  logoURI: WRAPPED_ETH_LOGO_URL,
};

export const WRAPPED_BTC_ETH: Token = {
  chainId: ChainId.Ethereum,
  name: "Wrapped Bitcoin",
  address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  decimals: 18,
  symbol: "WBTC",
  coingeckoId: "btc",
  logoURI: WRAPPED_BTC_LOGO_URL,
};

export const WRAPPED_BTC_POLYGON: Token = {
  chainId: ChainId.Polygon,
  name: "Wrapped Bitcoin",
  address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
  decimals: 18,
  symbol: "WBTC",
  coingeckoId: "btc",

  logoURI: WRAPPED_BTC_LOGO_URL,
};

export const WRAPPED_BTC_OPT: Token = {
  chainId: ChainId.Optimism,
  name: "Wrapped Bitcoin",
  address: "0x408d4cd0adb7cebd1f1a1c33a0ba2098e1295bab",
  decimals: 18,
  symbol: "WBTC",
  coingeckoId: "btc",

  logoURI: WRAPPED_BTC_LOGO_URL,
};

export const WRAPPED_BTC_ARB: Token = {
  chainId: ChainId.Arbitrum,
  name: "Wrapped Bitcoin",
  address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
  decimals: 18,
  symbol: "WBTC",
  coingeckoId: "btc",

  logoURI: WRAPPED_BTC_LOGO_URL,
};

export const WRAPPED_BTC_FANTOM: Token = {
  chainId: ChainId.Fantom,
  name: "Wrapped Bitcoin",
  address: "0x321162Cd933E2Be498Cd2267a90534A804051b11",
  decimals: 18,
  symbol: "WBTC",
  coingeckoId: "btc",

  logoURI: WRAPPED_BTC_LOGO_URL,
};

export const WRAPPED_BTC_AVAX: Token = {
  chainId: ChainId.Avax,
  name: "Wrapped Bitcoin",
  address: "0x408d4cd0adb7cebd1f1a1c33a0ba2098e1295bab",
  decimals: 18,
  symbol: "WBTC",
  coingeckoId: "btc",

  logoURI: WRAPPED_BTC_LOGO_URL,
};

export const WRAPPED_AVAX: Token = {
  chainId: ChainId.Avax,
  name: "Wrapped Avax",
  address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
  decimals: 18,
  symbol: "WAVAX",
  coingeckoId: "avax",
  logoURI: AVAX_LOGO_URL,
};

export const WRAPPED_BNB: Token = {
  chainId: ChainId.BSC,
  name: "Wrapped BNB",
  address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  decimals: 18,
  symbol: "WBNB",
  coingeckoId: "bnb",
  logoURI: WRAPPED_BNB_LOGO_URL,
};

export const COINBASE_WRAPPED_STAKED: Token = {
  chainId: ChainId.Base,
  address: "0x4200000000000000000000000000000000000006",
  name: "Wrapped Ether",
  symbol: "WETH",
  decimals: 18,
  logoURI: WRAPPED_ETH_LOGO_URL,
};

export const BASE_TOKENS_SUGGESTION = [
  WRAPPED_ETH_ARB,
  WRAPPED_ETH_AVAX,
  WRAPPED_ETH_ETH,
  WRAPPED_ETH_FANTOM,
  WRAPPED_ETH_POLYGON,
  WRAPPED_ETH_OPT,

  WRAPPED_BTC_ARB,
  WRAPPED_BTC_AVAX,
  WRAPPED_BTC_ETH,
  WRAPPED_BTC_FANTOM,
  WRAPPED_BTC_OPT,
  WRAPPED_BTC_POLYGON,
  COINBASE_WRAPPED_STAKED,
];

export const DEFAULT_TOKENS: {
  [key: number]: { baseToken: Token; quoteToken: Token };
} = {
  [ChainId.Ethereum]: {
    baseToken: WRAPPED_ETH_ETH,
    quoteToken: USDT_TOKEN_ETH,
  },
  [ChainId.Polygon]: {
    baseToken: WRAPPED_ETH_POLYGON,
    quoteToken: USDT_TOKEN_POLYGON,
  },
  [ChainId.BSC]: { baseToken: WRAPPED_BNB, quoteToken: USDT_TOKEN_BSC },
  [ChainId.Avax]: { baseToken: WRAPPED_ETH_AVAX, quoteToken: USDC_TOKEN_AVAX },
  [ChainId.Fantom]: {
    baseToken: WRAPPED_ETH_FANTOM,
    quoteToken: USDC_TOKEN_FANTOM,
  },
  [ChainId.Optimism]: {
    baseToken: WRAPPED_ETH_OPT,
    quoteToken: USDC_TOKEN_FANTOM,
  },
  [ChainId.Arbitrum]: {
    baseToken: WRAPPED_ETH_ARB,
    quoteToken: USDT_TOKEN_ARB,
  },
  [ChainId.Base]: {
    baseToken: COINBASE_WRAPPED_STAKED,
    quoteToken: USDC_TOKEN_BASE,
  },
  [ChainId.Mumbai]: { baseToken: WMATIC_TOKEN, quoteToken: DUMMY_TOKEN },
  [ChainId.Goerli]: {
    baseToken: {
      chainId: ChainId.Goerli,
      address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
      name: "Uniswap Token",
      symbol: "UNI",
      decimals: 18,
    },
    quoteToken: {
      address: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
      chainId: ChainId.Goerli,
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      coingeckoId: "ethereum",
    },
  },
};
