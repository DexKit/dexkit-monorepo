import { AppTransaction } from '@dexkit/core/types';
import { AppNotification } from '@dexkit/ui/types';
import { atom } from 'jotai';
import { focusAtom } from 'jotai/optics';
import { atomWithStorage } from 'jotai/utils';
import { AppState } from '../types/app';
import {
  Token,
  Transaction,
  TransactionMetadata,
  TransactionStatus,
  TransactionType,
} from '../types/blockchain';

import { ThemeMode } from '@dexkit/ui/constants/enum';
import { Asset } from '@dexkit/ui/modules/nft/types';


export const referralAtom = atom<string | undefined>(undefined);

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

export const transactionsAtom = focusAtom<
  AppState,
  { [key: string]: Transaction },
  void
>(appStateAtom, (o) => o.prop('transactions'));

export const isBalancesVisibleAtom = focusAtom<AppState, boolean, void>(
  appStateAtom,
  (o) => o.prop('isBalancesVisible')
);

export const pendingTransactionsAtom = atom<any, any>(
  (get) => {
    const transactions = get(transactionsAtom);

    let pendingTxs: { [hash: string]: Transaction } = {};

    for (const hash of Object.keys(transactions)) {
      if (transactions[hash].status === TransactionStatus.Pending) {
        pendingTxs[hash] = transactions[hash];
      }
    }

    return pendingTxs;
  },
  (get, set, arg) => {
    return set(transactionsAtom, arg);
  }
);

export const hasPendingTransactionsAtom = atom(
  (get) => Object.keys(get(pendingTransactionsAtom)).length > 0
);

export const uncheckedTransactionsAtom = atom((get) =>
  Object.keys(get(transactionsAtom))
    .map((key) => {
      const transactions = get(transactionsAtom);

      return transactions[key];
    })
    .filter((t) => !t.checked)
);

export const tokensAtom = focusAtom<AppState, Token[], void>(
  appStateAtom,
  (o) => o.prop('tokens')
);

export const currencyAtom = focusAtom<AppState, string, void>(
  appStateAtom,
  (o) => o.prop('currency')
);

export const userThemeModeAtom = focusAtom<
  AppState,
  ThemeMode | undefined,
  void
>(appStateAtom, (o) => o.prop('themeMode'));

export const localeAtom = focusAtom<AppState, string, void>(appStateAtom, (o) =>
  o.prop('locale')
);

export const currencyUserAtom = focusAtom<AppState, string, void>(
  appStateAtom,
  (o) => o.prop('currencyUser')
);

export const localeUserAtom = focusAtom<AppState, string, void>(
  appStateAtom,
  (o) => o.prop('localeUser')
);

export const assetsAtom = focusAtom<AppState, { [key: string]: Asset }, void>(
  appStateAtom,
  (o) => o.prop('assets')
);

export const accountAssetsAtom = focusAtom<
  AppState,
  {
    data?: {
      network?: string;
      assets?: Asset[];
      account?: string;
      total?: number;
      page?: number;
      perPage?: number;
    }[];
    lastTimeFetched?: { query: string; time: number };
  },
  void
>(appStateAtom, (o) => o.prop('accountAssets'));

export const hiddenAssetsAtom = focusAtom<
  AppState,
  { [key: string]: boolean },
  void
>(appStateAtom, (o) => o.prop('hiddenAssets'));

export const transactionDialogOpenAtom = atom(false);
export const transactionDialogHashAtom = atom<string | undefined>(undefined);
export const transactionDialogErrorAtom = atom<Error | undefined>(undefined);
export const transactionDialogMetadataAtom = atom<
  TransactionMetadata | undefined
>(undefined);

/** @deprecated */
export const transactionDialogTypeAtom = atom<TransactionType | undefined>(
  undefined
);

export const transactionValuesAtom = atom<Record<string, any> | undefined>(
  undefined
);

export const transactionTypeAtom = atom<string | undefined>(undefined);

export const switchNetworkOpenAtom = atom(false);
export const switchNetworkChainIdAtom = atom<number | undefined>(undefined);

export const transactionDialogRedirectUrlAtom = atom<string | undefined>(
  undefined
);

export const drawerIsOpenAtom = atom(false);

export const holdsKitDialogAtom = atom(false);

// Swap settings

export const isAutoSlippageAtom = atomWithStorage<boolean>(
  'isAutoSlippage',
  true
);

export const isMiniSidebarAtom = atomWithStorage<boolean>(
  'isMiniSidebar',
  false
);

export const maxSlippageAtom = atomWithStorage<number>('maxSlippage', 0.0);

export const showSelectCurrencyAtom = atom<boolean>(false);
export const showSelectLocaleAtom = atom<boolean>(false);

export const showAppTransactionsAtom = atom<boolean>(false);

export const selectedWalletAtom = atomWithStorage<string>('connector', '');

export const transactionsAtomV2 = atomWithStorage<{
  [key: string]: AppTransaction;
}>('dexkit.transactions', {});

export const gaslessTradesAtom = atomWithStorage<{
  [key: string]: AppTransaction;
}>('dexkit.gaslesstrades', {});

export const notificationsAtom = atomWithStorage<AppNotification[]>(
  'dexkit.notifications',
  []
);
