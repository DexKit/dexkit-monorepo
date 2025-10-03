import { TransactionStatus, TransactionType } from "@dexkit/core/constants";
import { AppTransaction, Token, Transaction, TransactionMetadata } from "@dexkit/core/types";
import { AppNotification } from "@dexkit/ui/types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { AppState } from "../../types";

export const transactionsAtom = atom<{ [key: string]: Transaction } | undefined>(undefined);



export const isConnectWalletOpenAtom = atom(false);
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


export const selectedWalletAtom = atomWithStorage<string>('connector', '');

export const transactionsAtomV2 = atomWithStorage<{
  [key: string]: AppTransaction;
}>('dexkit.transactions', {});

export const notificationsAtom = atomWithStorage<AppNotification[]>(
  'dexkit.notifications',
  []
);

export const recentTokensAtom = atomWithStorage<
  { token: Token; count: number }[]
>("recentTokens", []);

export const appStateAtom = atomWithStorage<AppState>("appState", {
  transactions: {},
});



export const pendingTransactionsAtom = atom<any, any>(
  (get) => {
    const transactions: any = get(transactionsAtom);

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
    return set(transactionsAtom as any, arg);
  }
);

export const uncheckedTransactionsAtom = atom((get) => {
  const txs: { [key: string]: Transaction } | undefined = get(transactionsAtom);

  if (txs) {
    return Object.keys(txs)
      .map((key) => txs[key])
      .filter((t) => !t.checked);
  }

  return [];
});

export const hasPendingTransactionsAtom = atom(
  (get) => Object.keys(get(pendingTransactionsAtom)).length > 0
);