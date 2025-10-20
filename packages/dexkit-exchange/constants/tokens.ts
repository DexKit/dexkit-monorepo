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

export const USDT_TOKEN_BASE: Token = {
  address: "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2",
  decimals: 6,
  name: "Tether USD",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Base,
  logoURI: USDT_LOGO_URL,
};

export const COINBASE_WRAPPED_STAKED: Token = {
  chainId: ChainId.Base,
  address: "0x4200000000000000000000000000000000000006",
  name: "Wrapped Ether",
  symbol: "WETH",
  decimals: 18,
  logoURI: WRAPPED_ETH_LOGO_URL,
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
  [ChainId.Base]: [COINBASE_WRAPPED_STAKED, DAI_TOKEN_BASE, USDT_TOKEN_BASE],
};

export const DEFAULT_QUOTE_TOKENS = {
  [ChainId.Polygon]: [KIT_TOKEN],
  [ChainId.Base]: [USDC_TOKEN_BASE],
};

export const QUOTE_TOKENS_SUGGESTION = [
  USDT_TOKEN_ETH,
  USDT_TOKEN_ARB,
  USDT_TOKEN_AVAX,
  USDT_TOKEN_OPT,
  USDT_TOKEN_BSC,
  USDT_TOKEN_POLYGON,
  USDT_TOKEN_BASE,

  DAI_TOKEN_ETH,
  DAI_TOKEN_AVAX,
  DAI_TOKEN_OPT,
  DAI_TOKEN_POLYGON,
  DAI_TOKEN_BSC,
  DAI_TOKEN_BASE,

  USDC_TOKEN_ETH,
  USDC_TOKEN_POLYGON,
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

export const WRAPPED_ETH_MODE: Token = {
  chainId: ChainId.Mode,
  address: "0x4200000000000000000000000000000000000006",
  name: "Wrapped Ether",
  symbol: "WETH",
  decimals: 18,
  coingeckoId: "ethereum",
  logoURI: WRAPPED_ETH_LOGO_URL,
};

export const USDC_TOKEN_MODE: Token = {
  chainId: ChainId.Mode,
  address: "0xd988097fb8612cc24eeC14542bC03424c656005f",
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  coingeckoId: "usdc",
  logoURI: USDC_LOGO_URL,
};

export const WRAPPED_ETH_BLAST: Token = {
  chainId: ChainId.Blast,
  address: "0x4300000000000000000000000000000000000004",
  name: "Wrapped Ether",
  symbol: "WETH",
  decimals: 18,
  coingeckoId: "ethereum",
  logoURI: WRAPPED_ETH_LOGO_URL,
};

export const USDB_TOKEN_BLAST: Token = {
  chainId: ChainId.Blast,
  address: "0x4300000000000000000000000000000000000003",
  name: "USD Blast",
  symbol: "USDB",
  decimals: 18,
  logoURI: "https://raw.githubusercontent.com/dexkit/icons/master/token/usdb.jpg",
};

export const WRAPPED_ETH_SCROLL: Token = {
  chainId: ChainId.Scroll,
  address: "0x5300000000000000000000000000000000000004",
  name: "Wrapped Ether",
  symbol: "WETH",
  decimals: 18,
  coingeckoId: "ethereum",
  logoURI: WRAPPED_ETH_LOGO_URL,
};

export const USDC_TOKEN_SCROLL: Token = {
  chainId: ChainId.Scroll,
  address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  coingeckoId: "usdc",
  logoURI: USDC_LOGO_URL,
};

export const WRAPPED_ETH_LINEA: Token = {
  chainId: ChainId.Linea,
  address: "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f",
  name: "Wrapped Ether",
  symbol: "WETH",
  decimals: 18,
  coingeckoId: "ethereum",
  logoURI: WRAPPED_ETH_LOGO_URL,
};

export const USDC_TOKEN_LINEA: Token = {
  chainId: ChainId.Linea,
  address: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  coingeckoId: "usdc",
  logoURI: USDC_LOGO_URL,
};

export const WRAPPED_ETH_MANTLE: Token = {
  chainId: ChainId.Mantle,
  address: "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111",
  name: "Wrapped Ether",
  symbol: "WETH",
  decimals: 18,
  coingeckoId: "ethereum",
  logoURI: WRAPPED_ETH_LOGO_URL,
};

export const USDC_TOKEN_MANTLE: Token = {
  chainId: ChainId.Mantle,
  address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  coingeckoId: "usdc",
  logoURI: USDC_LOGO_URL,
};

// **TOKENS DAI PARA NUEVAS REDES** 
export const DAI_TOKEN_LINEA: Token = {
  address: "0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5",
  decimals: 18,
  name: "Dai Stablecoin",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Linea,
  logoURI: DAI_LOGO_URL,
};

export const DAI_TOKEN_SCROLL: Token = {
  address: "0xcA77eB3fEFe3725Dc33bccB54eDEFc3D9f764f97",
  decimals: 18,
  name: "Dai Stablecoin",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Scroll,
  logoURI: DAI_LOGO_URL,
};

export const DAI_TOKEN_MANTLE: Token = {
  address: "0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5",
  decimals: 18,
  name: "Dai Stablecoin",
  symbol: "DAI",
  coingeckoId: "dai",
  chainId: ChainId.Mantle,
  logoURI: DAI_LOGO_URL,
};

export const USDT_TOKEN_LINEA: Token = {
  address: "0xA219439258ca9da29E9Cc4cE5596924745e12B93",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Linea,
  logoURI: USDT_LOGO_URL,
};

export const USDT_TOKEN_SCROLL: Token = {
  address: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Scroll,
  logoURI: USDT_LOGO_URL,
};

export const USDT_TOKEN_MANTLE: Token = {
  address: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Mantle,
  logoURI: USDT_LOGO_URL,
};

export const SCROLL_TOKEN: Token = {
  address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
  decimals: 18,
  name: "Scroll",
  symbol: "SCR",
  coingeckoId: "scroll",
  chainId: ChainId.Scroll,
  logoURI: "https://raw.githubusercontent.com/scroll-tech/frontends/sepolia/public/imgs/logo/scroll.svg",
};

export const BLAST_TOKEN: Token = {
  address: "0xb1a5700fA2358173Fe465e6eA4Ff52E36e88E2ad",
  decimals: 18,
  name: "Blast",
  symbol: "BLAST",
  coingeckoId: "blast",
  chainId: ChainId.Blast,
  logoURI: "https://assets.coingecko.com/coins/images/35494/large/blast.png",
};

export const MODE_TOKEN: Token = {
  address: "0xDfc7C877a950e49D2610114102175A06C2e3167a",
  decimals: 18,
  name: "Mode",
  symbol: "MODE",
  coingeckoId: "mode",
  chainId: ChainId.Mode,
  logoURI: "https://assets.coingecko.com/coins/images/31016/large/mode.png",
};

export const MANTLE_TOKEN: Token = {
  address: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
  decimals: 18,
  name: "Mantle",
  symbol: "MNT",
  coingeckoId: "mantle",
  chainId: ChainId.Mantle,
  logoURI: "https://assets.coingecko.com/coins/images/30980/large/token-logo.png",
};

export const UNI_TOKEN_LINEA: Token = {
  address: "0x636B22bC471c955A8DB60f28D4795066a8201fa3",
  decimals: 18,
  name: "Uniswap",
  symbol: "UNI",
  coingeckoId: "uniswap",
  chainId: ChainId.Linea,
  logoURI: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
};

export const LINK_TOKEN_LINEA: Token = {
  address: "0x7823E8DCC8bfc23EA3AC899EB86921f90e178233",
  decimals: 18,
  name: "Chainlink",
  symbol: "LINK",
  coingeckoId: "chainlink",
  chainId: ChainId.Linea,
  logoURI: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
};

export const UNI_TOKEN_SCROLL: Token = {
  address: "0x434cdA25E8a2CA5D9c1C449a8Cb6bCbF719233E8",
  decimals: 18,
  name: "Uniswap",
  symbol: "UNI",
  coingeckoId: "uniswap",
  chainId: ChainId.Scroll,
  logoURI: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
};

export const WBTC_TOKEN_SCROLL: Token = {
  address: "0x3C1BCa5a656e69edCD0D4E36BEbb3FcDAcA60Cf1",
  decimals: 8,
  name: "Wrapped BTC",
  symbol: "WBTC",
  coingeckoId: "wrapped-bitcoin",
  chainId: ChainId.Scroll,
  logoURI: "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png",
};

export const AAVE_TOKEN_SCROLL: Token = {
  address: "0xf301805bE1Df81102C957f6d4Ce29d2B8c056B2a",
  decimals: 18,
  name: "Aave",
  symbol: "AAVE",
  coingeckoId: "aave",
  chainId: ChainId.Scroll,
  logoURI: "https://assets.coingecko.com/coins/images/12645/large/AAVE.png",
};

export const LINK_TOKEN_SCROLL: Token = {
  address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
  decimals: 18,
  name: "Chainlink",
  symbol: "LINK",
  coingeckoId: "chainlink",
  chainId: ChainId.Scroll,
  logoURI: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
};

export const WBTC_TOKEN_MODE: Token = {
  address: "0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF",
  decimals: 8,
  name: "Wrapped BTC",
  symbol: "WBTC",
  coingeckoId: "wrapped-bitcoin",
  chainId: ChainId.Mode,
  logoURI: "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png",
};

export const USDT_TOKEN_MODE: Token = {
  address: "0xf0F161fDA2712DB8b566946122a5af183995e2eD",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Mode,
  logoURI: USDT_LOGO_URL,
};

export const UNI_TOKEN_MODE: Token = {
  address: "0x3e7eF8f50246f725885102E8238CBba33F276747",
  decimals: 18,
  name: "Uniswap",
  symbol: "UNI",
  coingeckoId: "uniswap",
  chainId: ChainId.Mode,
  logoURI: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
};

export const EZETH_TOKEN_MODE: Token = {
  address: "0x2416092f143378750bb29b79eD961ab195CcEea5E",
  decimals: 18,
  name: "Renzo Restaked ETH",
  symbol: "ezETH",
  coingeckoId: "renzo-restaked-eth",
  chainId: ChainId.Mode,
  logoURI: "https://assets.coingecko.com/coins/images/34753/large/Ezeth_logo_circle.png",
};

export const WBTC_TOKEN_BLAST: Token = {
  address: "0xF7bc58b8D8f97ADC129cfC4c9f45Ce3C0E1D2692",
  decimals: 8,
  name: "Wrapped BTC",
  symbol: "WBTC",
  coingeckoId: "wrapped-bitcoin",
  chainId: ChainId.Blast,
  logoURI: "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png",
};

export const USDT_TOKEN_BLAST: Token = {
  address: "0x4300000000000000000000000000000000000003",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Blast,
  logoURI: USDT_LOGO_URL,
};

export const JUICE_TOKEN_BLAST: Token = {
  address: "0x818a92bc81Aad0053d72ba753fb5Bc3d0C5C0923",
  decimals: 18,
  name: "Juice Finance",
  symbol: "JUICE",
  coingeckoId: "juice-finance",
  chainId: ChainId.Blast,
  logoURI: "https://assets.coingecko.com/coins/images/35987/large/juice.png",
};

export const YES_TOKEN_BLAST: Token = {
  address: "0x20fE91f17ec9080E3caC2d688b4EcB48C5aC3a9C",
  decimals: 18,
  name: "YES Token",
  symbol: "YES",
  coingeckoId: "yes-token",
  chainId: ChainId.Blast,
  logoURI: "https://assets.coingecko.com/coins/images/35796/large/Yes_Token_200x200.png",
};

export const WBTC_TOKEN_MANTLE: Token = {
  address: "0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2",
  decimals: 8,
  name: "Wrapped BTC",
  symbol: "WBTC",
  coingeckoId: "wrapped-bitcoin",
  chainId: ChainId.Mantle,
  logoURI: "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png",
};

export const WBTC_TOKEN_LINEA: Token = {
  address: "0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4",
  decimals: 8,
  name: "Wrapped BTC",
  symbol: "WBTC",
  coingeckoId: "wrapped-bitcoin",
  chainId: ChainId.Linea,
  logoURI: "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png",
};

export const WRAPPED_CRONOS: Token = {
  chainId: ChainId.Cronos,
  address: "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
  name: "Wrapped Cronos",
  symbol: "WCRO",
  decimals: 18,
  coingeckoId: "crypto-com-chain",
  logoURI: 'https://static.crypto.com/token/icons/wrapped-cro/color_icon.png',
};

export const USDT_TOKEN_CRONOS: Token = {
  address: "0x66e428c3f67a68878562e79A0234c1F83c208770",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
  chainId: ChainId.Cronos,
  logoURI: USDT_LOGO_URL,
};

export const BASE_TOKENS_SUGGESTION = [
  WRAPPED_ETH_ARB,
  WRAPPED_ETH_AVAX,
  WRAPPED_ETH_ETH,
  WRAPPED_ETH_POLYGON,
  WRAPPED_ETH_OPT,
  WRAPPED_BTC_ARB,
  WRAPPED_BTC_AVAX,
  WRAPPED_BTC_ETH,
  WRAPPED_BTC_OPT,
  WRAPPED_BTC_POLYGON,
  COINBASE_WRAPPED_STAKED,
  WRAPPED_ETH_MODE,
  WRAPPED_ETH_BLAST,
  WRAPPED_ETH_SCROLL,
  WRAPPED_ETH_LINEA,
  WRAPPED_ETH_MANTLE,
  SCROLL_TOKEN,
  BLAST_TOKEN,
  MODE_TOKEN,
  MANTLE_TOKEN,
  UNI_TOKEN_LINEA,
  LINK_TOKEN_LINEA,
  WBTC_TOKEN_SCROLL,
  WBTC_TOKEN_MODE,
  WBTC_TOKEN_BLAST,
  WBTC_TOKEN_MANTLE,
  WBTC_TOKEN_LINEA,
  UNI_TOKEN_SCROLL,
  AAVE_TOKEN_SCROLL,
  LINK_TOKEN_SCROLL,
  UNI_TOKEN_MODE,
  EZETH_TOKEN_MODE,
  JUICE_TOKEN_BLAST,
  YES_TOKEN_BLAST,
  WRAPPED_CRONOS,
];

export const EXTENDED_QUOTE_TOKENS_SUGGESTION = [
  ...QUOTE_TOKENS_SUGGESTION,
  USDC_TOKEN_MODE,
  USDB_TOKEN_BLAST,
  USDC_TOKEN_SCROLL,
  USDC_TOKEN_LINEA,
  USDC_TOKEN_MANTLE,
  DAI_TOKEN_LINEA,
  DAI_TOKEN_SCROLL,
  DAI_TOKEN_MANTLE,
  USDT_TOKEN_LINEA,
  USDT_TOKEN_SCROLL,
  USDT_TOKEN_MANTLE,
  USDT_TOKEN_MODE,
  USDT_TOKEN_BLAST,
  USDT_TOKEN_CRONOS,
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
  [ChainId.Optimism]: {
    baseToken: WRAPPED_ETH_OPT,
    quoteToken: USDC_TOKEN_OPT,
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
  [ChainId.Blast]: {
    baseToken: WRAPPED_ETH_BLAST,
    quoteToken: USDB_TOKEN_BLAST,
  },
  [ChainId.Linea]: {
    baseToken: WRAPPED_ETH_LINEA,
    quoteToken: USDC_TOKEN_LINEA,
  },
  [ChainId.Scroll]: {
    baseToken: WRAPPED_ETH_SCROLL,
    quoteToken: USDC_TOKEN_SCROLL,
  },
  [ChainId.Mantle]: {
    baseToken: WRAPPED_ETH_MANTLE,
    quoteToken: USDC_TOKEN_MANTLE,
  },
  [ChainId.Mode]: {
    baseToken: WRAPPED_ETH_MODE,
    quoteToken: USDC_TOKEN_MODE,
  },
  [ChainId.Cronos]: {
    baseToken: WRAPPED_CRONOS,
    quoteToken: USDT_TOKEN_CRONOS,
  },
};
