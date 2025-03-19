import { TransactionStatus } from "@dexkit/core/constants/enums";
import type {
  AppTransaction,
  Asset,
  TokenWhitelabelApp,
} from "@dexkit/core/types";
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import type {
  AppNotification,
  AppNotificationType,
  CreateAppNotificationParams,
} from "../types";
import { useWatchTransactionDialog } from "./useWatchTransactionsDialog";

export function useDexkitContextState({
  notificationTypes,
  notificationsAtom,
  tokensAtom,
  assetsAtom,
  hiddenAssetsAtom,
  transactionsAtom,
  onChangeLocale,
  currencyUserAtom,
}: {
  notificationTypes: { [key: string]: AppNotificationType };
  notificationsAtom: PrimitiveAtom<AppNotification[]>;
  tokensAtom: PrimitiveAtom<TokenWhitelabelApp[]>;
  assetsAtom: PrimitiveAtom<{ [key: string]: Asset }>;
  hiddenAssetsAtom: PrimitiveAtom<{ [key: string]: boolean }>;
  currencyUserAtom: PrimitiveAtom<string>;
  transactionsAtom: PrimitiveAtom<{ [key: string]: AppTransaction }>;

  onChangeLocale: (locale: string) => void;
}) {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [tokens, setTokens] = useAtom(tokensAtom);
  const [assets, setAssets] = useAtom(assetsAtom);
  const [hiddenAssets, setHiddenAssets] = useAtom(hiddenAssetsAtom);
  const currencyUser = useAtomValue(currencyUserAtom);
  const [transactions, setTransactions] = useAtom(transactionsAtom);
  const watchTransactionDialog = useWatchTransactionDialog({
    transactionsAtom,
  });

  const checkAllNotifications = () => {
    setNotifications((notifications) => {
      return notifications.map((n) => ({ ...n, checked: true }));
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const createNotification = (params: CreateAppNotificationParams) => {
    setNotifications((notifications) => {
      const date = new Date().getTime();

      const newNotification: AppNotification = {
        date,
        subtype: params.subtype,
        type: params.type,
        icon: params.icon,
        metadata: params.metadata,
        values: params.values,
        url: params.url,
      };

      if (params.metadata && params.metadata["hash"]) {
        const hash = params.metadata["hash"];
        const chainId = params.metadata["chainId"];

        if (chainId) {
          setTransactions((transactions) => {
            return {
              ...transactions,
              [hash]: {
                chainId,
                created: date,
                status: TransactionStatus.Pending,
                values: params.values,
                type: params.subtype,
              },
            };
          });
        }
      }

      return [...notifications, newNotification];
    });
  };

  return {
    tokens,
    setTokens,
    assets,
    currencyUser,
    setAssets,
    hiddenAssets,
    setHiddenAssets,
    transactions,
    createNotification,
    clearNotifications,
    checkAllNotifications,
    onChangeLocale,
    notificationTypes,
    notifications: notifications.reverse(),
    watchTransactionDialog,
  };
}
