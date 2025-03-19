import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { COIN_LIST } from '../constants';
import { Account, Coin, Wallet } from '../types';
import { DkApiAsset } from '../types/dexkitapi';

export const coinsAtom = atomWithStorage(
  'coins',
  COIN_LIST.filter((c) => !c.isHidden)
);

export const accountsAtom = atomWithStorage<Account[]>('accounts', []);

export const walletsAtom = atomWithStorage<Wallet[]>('wallets', []);

export const isAutoSlippageAtom = atomWithStorage<boolean>(
  'isAutoSlippage',
  true
);

export const maxSlippageAtom = atomWithStorage<number>('maxSlippage', 0.0);

export const showSelectCurrencyAtom = atom<boolean>(false);
export const showSelectLocaleAtom = atom<boolean>(false);

export const nftsLastFetchAtom = atomWithStorage<number>('nfts-last-fetch', 0);
export const nftsAtom = atomWithStorage<DkApiAsset[]>('nfts', []);

export const nftAccountsAtom = atomWithStorage<Account[]>('nftsAccounts', []);

export const recentCoinsAtom = atomWithStorage<{ coin: Coin; count: number }[]>(
  'recentCoins',
  []
);

export const swapFavoriteCoinsAtom = atomWithStorage<Coin[]>(
  'swapFavoriteCoins',
  []
);

export const importedCoinsAtom = atomWithStorage<Coin[]>(
  'importedCoins',
  COIN_LIST.filter((c) => !c.isHidden)
);
