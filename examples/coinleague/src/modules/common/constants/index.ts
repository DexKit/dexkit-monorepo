import { Currency, Language } from '../types/app';

export const MagicApiKey =
  process.env.MAGIC_API_KEY || 'pk_live_E64FED768E069658';

export const ZEROEX_NATIVE_TOKEN_ADDRESS =
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const NUMBER_REGEX = new RegExp('^([0-9]+([.][0-9]*)?|[.][0-9]+)$');

export const MULTICALL_NATIVE_TOKEN_ADDRESS =
  '0x0000000000000000000000000000000000000000';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const DRAWER_WIDTH = 240;

export const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

export const URL_REGEX =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

export const LANGUAGES: Language[] = [
  { name: 'English (US)', locale: 'en-US' },
  { name: 'Português (BR)', locale: 'pt-BR' },
  { name: 'Español (ES)', locale: 'es-ES' },
];

export const CURRENCIES: Currency[] = [{ symbol: 'usd', name: 'US Dollar' }];

export const DEXKIT_BASE_API_URL =
  process.env.DEXKIT_BASE_API_URL ||
  'https://dexkit-main-api-9vzhs.ondigitalocean.app';

export const NEXT_PUBLIC_DEXKIT_API_URL = 'https://nft-api.dexkit.com';
