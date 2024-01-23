import { ChainId } from '@dexkit/core';
import { AppPageOptions } from '../../../types/config';
import { SectionMetadata } from '../types/section';

export const MAX_FEES = 10;

export const UNISWAP_DEFAULT_TOKENLIST_URL = 'https://tokens.uniswap.org/';
export const GEMINI_TOKENLIST_URL =
  'https://www.gemini.com/uniswap/manifest.json';

export const DEXKIT_TOKENLIST_URL =
  'https://raw.githubusercontent.com/DexKit/dexkit-token-list/main/build/dexkit.tokenlist.json';

export const WIZARD_MAX_TOKENS = 60;

export const WIZARD_SWAP_MAX_FEES = 10;

export const KITTYGOTCHI_CONTRACT =
  '0xEA88540adb1664999524d1a698cb84F6C922D2A1';

export const HELP_FIELD_TEXT = {
  name: 'Name of your App.',
  email: 'Email used to receive notifications about your App.',
  domain:
    'Domain used to deploy your App. Make sure you own this domain and that is not in use. If in use remove all records on it.',
  'favicon.url':
    'Image Url for the favicon used by your application. {br} Recomended size: 20x20px',
  'logo.url':
    'Image Url for the logo used by your application. {br} Recomended size: 150x150px',
  'custom.primary.color': 'Primary color',
  'custom.secondary.color': 'Secondary color',
  'custom.background.default.color': 'Background color',
  'custom.text.primary.color': 'Text color',
};

export const CORE_PAGES: { [key: string]: AppPageOptions } = {
  ['swap']: {
    title: 'Swap',
    uri: '/swap',
  },
  ['collections']: {
    title: 'Collections',
    uri: '/collections',
  },
  ['wallet']: {
    title: 'Wallet',
    uri: '/wallet',
  },
};

export enum BuilderKit {
  ALL = 'All Kits',
  NFT = 'NFT Kit',
  Swap = 'Swap Kit',
}

export const SectionsMetadata: SectionMetadata[] = [
  {
    type: 'video',
    title: 'Video',
    icon: 'videocam',
  },
];

export const DEX_GENERATOR_CONTRACT_TYPES: { type: string; name: string }[] = [
  { type: 'DropERC1155', name: 'Edition Drop' },
  { type: 'DropERC20', name: 'Token Drop' },
  { type: 'DropERC721', name: 'NFT Drop' },
  { type: 'TokenStake', name: 'Token Stake' },
  { type: 'NFTStake', name: 'NFT Stake' },
  { type: 'EditionStake', name: 'Edition Stake' },
  { type: 'TokenERC20', name: 'Token' },
  { type: 'TokenERC721', name: 'Collection' },
  { type: 'TokenERC1155', name: 'Edition' },
];

export const DEX_GENERATOR_CONTRACT_TYPES_AVAIL = [
  'DropERC20',
  'DropERC1155',
  'DropERC721',
  'EditionStake',
  'NFTStake',
  'TokenStake',
  'TokenERC20',
  'TokenERC721',
  'TokenERC1155',
];

export const DARKBLOCK_SUPPORTED_CHAIN_IDS = [
  ChainId.Ethereum,
  ChainId.Polygon,
  ChainId.Avax,
  ChainId.Base,
  ChainId.Goerli,
  ChainId.Mumbai
]
