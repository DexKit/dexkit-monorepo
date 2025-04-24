import { EvmTokenList } from '../types';

export const UNISWAP_DEFAULT_TOKENLIST_URL = 'https://tokens.uniswap.org/';
export const GEMINI_TOKENLIST_URL =
  'https://www.gemini.com/uniswap/manifest.json';

export const EVM_TOKEN_LISTS: EvmTokenList[] = [
  {
    name: 'Dexkit Token List',
    url: 'https://raw.githubusercontent.com/DexKit/dexkit-token-list/main/build/dexkit.tokenlist.json',
  },
  {
    name: 'Gemini Token List',
    url: 'https://www.gemini.com/uniswap/manifest.json',
  },
  { name: 'Uniswap Token List', url: 'https://tokens.uniswap.org/' },
];
