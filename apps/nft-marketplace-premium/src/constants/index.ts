import { ChainId } from '@dexkit/core/constants';
import moment from 'moment';
import { Currency, Language } from '../types/app';
import { Token } from '../types/blockchain';

export const TRADER_ORDERBOOK_API = 'https://api.trader.xyz/orderbook/orders';

export const ZEROEX_NATIVE_TOKEN_ADDRESS =
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const MULTICALL_NATIVE_TOKEN_ADDRESS =
  '0x0000000000000000000000000000000000000000';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const WRAPPED_ETHER_CONTRACT: { [key: number]: string } = {
  3: '0xc778417e063141139fce010982780140aa0cd5ab',
};

export const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
  ? process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
  : '8b875cba6d295240d3b3861a3e8c2260';

export const ETH_COIN: Token = {
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
  address: ZEROEX_NATIVE_TOKEN_ADDRESS,
  logoURI: '',
  chainId: ChainId.Ethereum,
};

export const MATIC_COIN: Token = {
  name: 'Polygon',
  symbol: 'MATIC',
  decimals: 18,
  address: ZEROEX_NATIVE_TOKEN_ADDRESS,
  logoURI: '',
  chainId: ChainId.Polygon,
};

export const MIN_ORDER_DATE_TIME = moment.duration(1, 'hour');

export const COINGECKO_ENDPOIT = 'https://api.coingecko.com/api/v3';

export const COINGECKO_PLATFORM_ID: { [key: number]: string } = {
  [ChainId.Ethereum]: 'ethereum',
  [ChainId.Polygon]: 'polygon-pos',
  [ChainId.BSC]: 'binance-smart-chain',
  [ChainId.Avax]: 'avalanche',
  [ChainId.Celo]: 'celo',
  [ChainId.Fantom]: 'fantom',
  [ChainId.Optimism]: 'optimistic-ethereum',
  [ChainId.Arbitrum]: 'arbitrum-one',
  [ChainId.Base]: 'base',
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
    case ChainId.Arbitrum:
      return 'arbitrum.';
    case ChainId.Base:
      return 'base.';
    default:
      return '';
  }
};

export const ZERO_EX_QUOTE_ENDPOINT = (chainId?: number) => {
  const endpoint = `https://${ZERO_EX_CHAIN_PREFIX(
    chainId
  )}api.0x.org/swap/v1/quote`;

  return endpoint;
};

export const ZERO_EX_TOKENS_ENDPOINT = (chainId?: number) =>
  `https://${ZERO_EX_CHAIN_PREFIX(chainId)}api.0x.org/swap/v1/tokens`;

export const NUMBER_REGEX = new RegExp('^([0-9]+([.][0-9]*)?|[.][0-9]+)$');

export const LANGUAGES: Language[] = [
  { name: 'English (US)', locale: 'en-US' },
  { name: 'Português (BR)', locale: 'pt-BR' },
  { name: 'Español (ES)', locale: 'es-ES' },
];

export const CURRENCIES: Currency[] = [
  { symbol: 'ars', name: 'Argentine Peso' },
  { symbol: 'brl', name: 'Brazilian Real' },
  { symbol: 'clp', name: 'Chilean Peso' },
  { symbol: 'czk', name: 'Czech Koruna' },
  { symbol: 'eur', name: 'Euro' },
  { symbol: 'inr', name: 'Indian Rupee' },
  { symbol: 'ngn', name: 'Nigerian Naira' },
  { symbol: 'chf', name: 'Swiss Franc' },
  { symbol: 'usd', name: 'US Dollar' },
  { symbol: 'vef', name: 'Venezuelan Bolívar Fuerte' },
];

export const WIZARD_DOCS_URL =
  'https://docs.dexkit.com/defi-products/nft-marketplace/overview';

export const DEXKIT_DISCORD_SUPPORT_CHANNEL = 'https://discord.gg/FnkrFAY7Za';

export const IS_STAGING = process.env.IS_STAGING === 'true' ? true : false;

// Production API 'https://dexkit-main-api-9vzhs.ondigitalocean.app'
// Legacy Production API ''https://dexkitapi-8oo4v.ondigitalocean.app''
// DEV Production API https://goldfish-app-lh5o5.ondigitalocean.app'
// LOCALHOST API http://localhost:3000
export const DEXKIT_BASE_API_URL =
  process.env.NEXT_PUBLIC_DEXKIT_DASH_ENDPOINT ?? 'http://localhost:3005';
//export const DEXKIT_BASE_API_URL = 'https://dexkit-main-api-9vzhs.ondigitalocean.app'
// export const DEXKIT_BASE_API_URL = 'https://nft-api.dexkit.com';

export const DEXKIT_BASE_FILES_HOST =
  'https://dexkit-storage.nyc3.digitaloceanspaces.com';

export const DEXKIT_AUTHENTICATE_API_KEY = process.env.MARKETPLACE_API_KEY
  ? process.env.MARKETPLACE_API_KEY
  : '';

export const MAX_ACCOUNT_FILE_UPLOAD_SIZE = 2048576;

export const WHITELISTED_IMAGE_DOMAINS = [
  'i.seadn.io',
  'dweb.link',
  'ipfs.io',
  'ipfs.moralis.io',
  'dashboard.mypinata.cloud',
  'raw.githubusercontent.com',
  'arpeggi.io',
  'arweave.net',
  'i.ibb.co',
  // 'metadata.ens.domains',
  'assets.otherside.xyz',
  'dexkit-storage.nyc3.cdn.digitaloceanspaces.com',
  'dexkit-storage.nyc3.digitaloceanspaces.com',
];

export const URL_REGEX =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

//export const DEXKIT_NFT_BASE_URI = 'https://nft-api.dexkit.com'
export const DEXKIT_NFT_BASE_URI = DEXKIT_BASE_API_URL;

export const DEXKIT_NFT_METADATA_URI = `${DEXKIT_NFT_BASE_URI}/asset/metadata`;

export const MIN_KIT_HOLDING_AI_GENERATION = '1000';

export const WHITELISTED_AI_ACCOUNTS = [
  '0xAf16774D5579bBCbAFb72Df314C17704360BC0fB',
  '0x5265Bde27F57E738bE6c1F6AB3544e82cdc92a8f',
];
