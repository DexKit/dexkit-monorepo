import type { AppTransaction } from '@dexkit/core/types';
import type { AppNotification } from '@dexkit/ui/types';
import { atom } from 'jotai';
import { focusAtom } from 'jotai/optics';
import { atomWithStorage } from 'jotai/utils';



import type { Asset } from '@dexkit/ui/modules/nft/types';
import type { AppState } from './app';
import { Token } from './blockchain';







export const appStateAtom = atomWithStorage<AppState>('appState', {
  transactions: {},
  tokens: [],
  isBalancesVisible: true,
  currency: 'usd',
  locale: 'en-US',
  currencyUser: '',
  localeUser: '',
  assets: {},
  themeMode: undefined,
  accountAssets: {
    lastTimeFetched: {
      time: new Date().getTime(),
      query: '',
    },
  },
  hiddenAssets: {},
});

export const assetsAtom = focusAtom<AppState, { [key: string]: Asset }, void>(
  appStateAtom,
  (o) => o.prop('assets')
);

export const currencyUserAtom = focusAtom<AppState, string, void>(
  appStateAtom,
  (o) => o.prop('currencyUser')
);

export const referralAtom = atom<string | undefined>(undefined);

export const notificationsAtom = atomWithStorage<AppNotification[]>(
  'dexkit.notifications',
  []
);

export const transactionsAtomV2 = atomWithStorage<{
  [key: string]: AppTransaction;
}>('dexkit.transactions', {});

export const selectedWalletAtom = atomWithStorage<string>('connector', '');

export const tokensAtom = focusAtom<AppState, Token[], void>(
  appStateAtom,
  (o) => o.prop('tokens')
);


export const hiddenAssetsAtom = focusAtom<
  AppState,
  { [key: string]: boolean },
  void
>(appStateAtom, (o) => o.prop('hiddenAssets'));