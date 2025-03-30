import {
  AppNotification,
  AppState,
  ProfileNft,
} from '@/modules/common/types/app';
import { atom } from 'jotai';
import { focusAtom } from 'jotai/optics';
import { atomWithStorage } from 'jotai/utils';

import {
  Transaction,
  TransactionStatus,
} from '@/modules/common/types/transactions';

export const appStateAtom = atomWithStorage<AppState>('appState', {
  transactions: {},
  notifications: [],
  isBalancesVisible: true,
  currency: 'usd',
  locale: 'en-US',
});

export const transactionsAtom = focusAtom<
  AppState,
  { [key: string]: Transaction },
  void
>(appStateAtom, (o) => o.prop('transactions'));

export const notificationsAtom = focusAtom<AppState, AppNotification[], void>(
  appStateAtom,
  (o) => o.prop('notifications')
);

export const isBalancesVisibleAtom = focusAtom<AppState, boolean, void>(
  appStateAtom,
  (o) => o.prop('isBalancesVisible')
);

export const pendingTransactionsAtom = atom<any, any>(
  (get) => {
    const transactions = get(transactionsAtom);

    let pendingTxs: { [hash: string]: Transaction } = {};

    if (transactions) {
      for (const hash of Object.keys(transactions)) {
        if (transactions[hash].status === TransactionStatus.Pending) {
          pendingTxs[hash] = transactions[hash];
        }
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

export const uncheckedNotificationsAtom = atom((get) => {
  const notifications = get(notificationsAtom);

  if (notifications) {
    return notifications.filter((t) => !t.checked);
  }

  return [];
});

export const currencyAtom = focusAtom<AppState, string, void>(
  appStateAtom,
  (o) => o.prop('currency')
);

export const localeAtom = focusAtom<AppState, string, void>(appStateAtom, (o) =>
  o.prop('locale')
);

export const profileNftAtom = focusAtom<AppState, ProfileNft | undefined, void>(
  appStateAtom,
  (o) => o.prop('profileNft')
);

export const showNotificationsAtom = atom<boolean>(false);

export const showConnectWalletAtom = atom<boolean>(false);

export const firstVisitAtom = atomWithStorage('isFirstVisit', true);

export const selectedWalletAtom = atomWithStorage<string>('selectedWallet', '');

export const showWelcomeAtom = atomWithStorage<boolean>('welcomeDialog', true);
