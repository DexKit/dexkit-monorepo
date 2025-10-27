import moment from "moment";
import { Currency, Language } from "../types/app";
import { NETWORK_ID } from "./enum";

export const MIN_ORDER_DATE_TIME = moment.duration(1, 'hour');

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

export const DEXKIT_BASE_FILES_HOST =
  'https://dexkit-storage.nyc3.digitaloceanspaces.com';

export const LANGUAGES: Language[] = [
  { name: 'English (US)', locale: 'en-US' },
  { name: 'Português (BR)', locale: 'pt-BR' },
  { name: 'Español (ES)', locale: 'es-ES' },
  { name: 'Deutsch (DE)', locale: 'de-DE' },
  { name: 'Français (FR)', locale: 'fr-FR' },
  { name: 'Italiano (IT)', locale: 'it-IT' },
  { name: 'Norsk (NO)', locale: 'nn-NO' },
  { name: 'Čeština (CZ)', locale: 'cs-CZ' },

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
  { symbol: 'ves', name: 'Venezuelan Bolívar' },
];

export const MIN_KIT_HOLDING_AI_GENERATION = '1000';

export const MAX_ACCOUNT_FILE_UPLOAD_SIZE = 50 * 1024 * 1024;

export const DEXKIT_AUTHENTICATE_API_KEY = process?.env?.MARKETPLACE_API_KEY
  ? process?.env?.MARKETPLACE_API_KEY
  : '';

export const DEXKIT = {
  [NETWORK_ID.Polygon]: {
    address: '0x4d0def42cf57d6f27cd4983042a55dce1c9f853c',
    name: 'DexKit',
    symbol: 'KIT',
    decimals: 18,
    logoURI: '',
  },
  [NETWORK_ID.BSC]: {
    address: '0x314593fa9a2fa16432913dbccc96104541d32d11',
    name: 'DexKit',
    symbol: 'KIT',
    decimals: 18,
    logoURI: '',
  },
  [NETWORK_ID.Ethereum]: {
    address: '0x7866E48C74CbFB8183cd1a929cd9b95a7a5CB4F4',
    name: 'DexKit',
    symbol: 'KIT',
    decimals: 18,
    logoURI: '',
  }
}

export const WHITELISTED_AI_ACCOUNTS = [
  '0xAf16774D5579bBCbAFb72Df314C17704360BC0fB',
  '0x5265Bde27F57E738bE6c1F6AB3544e82cdc92a8f',
];