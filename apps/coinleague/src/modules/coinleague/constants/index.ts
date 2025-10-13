// Mumbai Price Feeds

import { ChainId } from '@/modules/common/constants/enums';
import { BigNumber } from '@ethersproject/bignumber';
import { Coin } from '../types';
import { GameOrderBy } from './enums';

import { BasePriceFeeds } from './PriceFeeds/base';
import { BSCPriceFeeds } from './PriceFeeds/bsc';
import { MaticPriceFeeds } from './PriceFeeds/matic';

export const DEXKIT_MULTIPLIER_HOLDING = BigNumber.from(50).mul(
  BigNumber.from(10).pow(18)
);

export const CREATOR_ADDRESSES = ['0xD00995A10dB2E58A1A90270485056629134B151B'];

export const CREATOR_PRIZES_ADDRESSES = [
  '0x5265Bde27F57E738bE6c1F6AB3544e82cdc92a8f',
  '0xA5bdC63A85f889076C17177290BD90Ebd2140966',
];

export const MumbaiPriceFeeds = [
  {
    address: '0x007A22900a3B98143368Bd5906f8E17e9867581b',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    base: 'BTC',
    baseName: 'Bitcoin',
    quote: 'USD',
  },
  {
    address: '0x0715A7794a1dc8e42615F059dD6e406A6594651A',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    base: 'ETH',
    baseName: 'Ethereum',
    quote: 'USD',
  },
  {
    address: '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada',
    base: 'MATIC',
    baseName: 'Polygon',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    quote: 'USD',
  },
];

export const TRADING_VIEW_TICKERS =
  'COINBASE:BTCUSD,COINBASE:ETHUSD,COINBASE:MATICUSD,BINANCE:1INCHUSD,FTX:AAVEUSD,COINBASE:ADAUSD,FTX:ALCXUSD,COINBASE:ALGOUSD,BINANCE:AUDUSDT,BINANCE:BALUSD,COINBASE:BATUSD,COINBASE:BCHUSD,BINANCE:BNBUSD,BITTREX:BNTUSD,GEMINI:BONDUSD,BITFINEX:BSVUSD,BINANCE:BTGUSD,FTX:CELUSD,COINBASE:COMPUSD,COINBASE:CRVUSD,KRAKEN:DASHUSD,BITFINEX:DOGEUSD,BITFINEX:DOTUSD,KUCOIN:DPIUSDT,BITFINEX:EOSUSD,COINBASE:ETCUSD,COINBASE:FARMUSD,BINANCE:FXSUSD,FTX:HTUSD,COINBASE:ICPUSD,COINBASE:KNCUSD,BITFINEX:LEOUSD,COINBASE:LINKUSD,COINBASE:LPTUSD,COINBASE:LTCUSD,COINBASE:MANAUSD,BITTREX:MFTUSD,BINANCEUS:IOTAUSD,BINANCEUS:MKRUSD,BITFINEX:NEOUSD,COINBASE:OMGUSD,BINANCE:PAXGUSD,COINBASE:QUICKUSD,COINBASE:REPUSD,BINANCE:SANDUSD,COINBASE:SNXUSD,BINANCE:SOLUSD,BINANCE:SUSHIUSD,BINANCE:THETAUSD,BINANCE:TRXUSD,COINBASE:UMAUSD,COINBASE:UNIUSD,BINANCE:VETUSD,COINBASE:WBTCUSD,COINBASE:XLMUSD,BINANCE:XMRUSD,SUSHISWAP:XSUSHIUSDT,BITFINEX:XTZUSD,COINBASE:YFIUSD,COINBASE:ZECUSD,COINBASE:ZRXUSD';

// Mumbai Price Feeds



export const PriceFeeds: { [key: number]: Coin[] } = {
  [ChainId.Mumbai]: MumbaiPriceFeeds,
  [ChainId.Polygon]: MaticPriceFeeds,
  [ChainId.BSC]: BSCPriceFeeds,
  [ChainId.Base]: BasePriceFeeds,
};

export const COIN_LEAGUES_FACTORY_ADDRESS_V3 = {
  [ChainId.Mumbai]: '0xb33f24f9ddc38725F2b791e63Fb26E6CEc5e842A',
  [ChainId.Polygon]: '0x43fB5D9d4Dcd6D71d668dc6f12fFf97F35C0Bd7E',
  [ChainId.BSC]: '',
  [ChainId.Base]: '0x34C21825ef6Bfbf69cb8748B4587f88342da7aFb',
};

export const DISABLE_CHAMPIONS_ID = '500000';

export const AFFILIATE_FIELD = 'league-affiliate';

// export const GAME_METADATA_API =
//   'https://coinleague-app-api-yxwk6.ondigitalocean.app';
//export const GAME_METADATA_API = 'http://localhost:4001';

export const GAME_METADATA_API =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEXKIT_DASH_ENDPOINT
    //'https://nft-api.dexkit.com'
    //'https://coinleague-app-api-yxwk6.ondigitalocean.app'
    : process.env.NEXT_PUBLIC_DEXKIT_DASH_ENDPOINT;

export const PROFILE_API = `${GAME_METADATA_API}/user`;

export enum Months {
  February = 'February',
  March = 'March',
  April = 'April',
  May = 'May',
  June = 'June',
  // March = 3,
}

export const BLOCK_TIMESTAMP_COMPETION: {
  [key: string]: { [key: number]: number };
} = {
  [Months.March]: {
    [ChainId.Mumbai]: 0,
    [ChainId.Polygon]: 25464624,
    [ChainId.BSC]: 0,
  },
  [Months.April]: {
    [ChainId.Mumbai]: 0,
    [ChainId.Polygon]: 26596644,
    [ChainId.BSC]: 0,
  },
  [Months.May]: {
    [ChainId.Mumbai]: 0,
    [ChainId.Polygon]: 27796644,
    [ChainId.BSC]: 0,
  },
  [Months.June]: {
    [ChainId.Mumbai]: 0,
    [ChainId.Polygon]: 29015000,
    [ChainId.BSC]: 0,
  },
};

export const NativeCoinAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export interface CoinToPlayInterface {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export const CoinToPlay: { [key in ChainId]?: CoinToPlayInterface[] } = {
  [ChainId.Mumbai]: [
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Matic',
      symbol: 'Matic',
      decimals: 18,
    },
    {
      address: '0xd3FC7D494ce25303BF8BeC111310629429e6cDEA',
      name: 'Tether',
      symbol: 'USDT',
      decimals: 6,
    },
  ],
  [ChainId.BSC]: [
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
  ],
  [ChainId.Polygon]: [
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Matic',
      symbol: 'Matic',
      decimals: 18,
    },
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      name: 'Tether',
      symbol: 'USDT',
      decimals: 6,
    },
  ],
  [ChainId.Base]: [
    {
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
    },
  ],
};

export const StableCoinToPlay: { [key in ChainId]?: CoinToPlayInterface } = {
  [ChainId.Mumbai]: {
    address: '0xd3FC7D494ce25303BF8BeC111310629429e6cDEA',
    name: 'Tether',
    symbol: 'USDT',
    decimals: 6,
  },
  [ChainId.Polygon]: {
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    name: 'Tether',
    symbol: 'USDT',
    decimals: 6,
  },
  [ChainId.Base]: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
  },
};

export const GET_LEAGUES_CHAIN_ID = (chainId?: ChainId) => {
  if (chainId && chainId === ChainId.Mumbai) {
    return ChainId.Mumbai;
  }
  if (chainId && chainId === ChainId.BSC) {
    return ChainId.BSC;
  }
  if (chainId && chainId === ChainId.Base) {
    return ChainId.Base;
  }
  // return ChainId.Matic;
  return ChainId.Polygon;
};

export const GET_GAME_ORDER_OPTIONS = [
  {
    value: GameOrderBy.HighLevel,
    defaultMessage: 'Higher Level',
    messageId: 'app.coinLeagues.higherLevel',
  },
  {
    value: GameOrderBy.LowLevel,
    defaultMessage: 'Lower Level',
    messageId: 'app.coinLeagues.lowerLevel',
  },
  {
    value: GameOrderBy.AboutStart,
    defaultMessage: 'About to Start',
    messageId: 'app.coinLeagues.aboutstart',
  },
  {
    value: GameOrderBy.MostFull,
    defaultMessage: 'Most Full',
    messageId: 'app.coinLeagues.mostFull',
  },
  {
    value: GameOrderBy.MostEmpty,
    defaultMessage: 'Most Empty',
    messageId: 'app.coinLeagues.mostEmpty',
  },
  {
    value: GameOrderBy.HighDuration,
    defaultMessage: 'Higher Duration',
    messageId: 'app.coinLeagues.higherDuration',
  },
  {
    value: GameOrderBy.LowerDuration,
    defaultMessage: 'Lower Duration',
    messageId: 'app.coinLeagues.lowerDuration',
  },
  {
    value: GameOrderBy.MoreCoins,
    defaultMessage: 'More Coins',
    messageId: 'app.coinLeagues.moreCoins',
  },
  {
    value: GameOrderBy.LessCoins,
    defaultMessage: 'Less Coins',
    messageId: 'app.coinLeagues.lessCoins',
  },
];

export const BITBOY_TEAM: Array<{ address: string; label: string }> = [
  /*{
    address: '0x186035678f02f19d311ad24EA73a08EA4cD7f01e',
    label: 'Justin',
  },
  {
    address: '0xD1C86EA01EE183a48C86EDAD3be357B40E106F97',
    label: 'TJ',
  },
  {
    address: '0x77279C13336751281Bfc20F7381475f2db7dEaC0',
    label: 'Deezy',
  },
  {
    address: '0xaf5E3194e9E2D076D9dE7d73CaE3EA23d9278B14',
    label: 'Bitboy',
  },
  {
    address: '0xCB8b2c541E18AdBC8B4B8A42a3CA769f4EB72e6C',
    label: 'J Chains',
  },
  {
    address: '0x1b66A204a3e4be0E75B0dE7b91BC541bB7d99c8f',
    label: 'RayPulse',
  },*/
];

export const CREATOR_LABELS = [
  ...BITBOY_TEAM,
  /*{
    address: '0xA27e256CDD086eF88953b941582bB651582c1454',
    label: 'Albert Hoffman',
  },
  {
    address: '0x529be61AF4FD199456A5Bc67B72CD2F2a0A3FD70',
    label: 'Albert Hoffman',
  },*/
];

export const GAME_ENDED = 'GAME_ENDED';
export const GAME_ABORTED = 'GAME_ABORTED';
export const GAME_STARTED = 'GAME_STARTED';
export const GAME_WAITING = 'GAME_WAITING';

export const COINLEAGUE_DEFAULT_AFFILIATE =
  '0xD50E4D1E0b49eb64a6bF2f48731c035E8948D219';
