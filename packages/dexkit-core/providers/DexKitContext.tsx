import type { ChainId, TransactionType } from "@dexkit/core/constants";
import type {
  AppTransaction,
  Asset,
  TokenWhitelabelApp,
  TransactionMetadata,
  WatchTransactionDialogProperties,
} from "@dexkit/core/types";
import { SUPPORTED_LEGACY_CHAIN_IDS } from "@dexkit/evm-chains/constants";
import type {
  AppNotification,
  AppNotificationType,
  CreateAppNotificationParams,
} from "@dexkit/ui/types";
import React, { SetStateAction } from "react";

export interface DexkitContextState {
  onChangeLocale: (locale: string) => void;
  provider?: any;
  apiKey?: string;
  onConnectWallet?: () => void;
  affiliateReferral?: string;
  notificationTypes: { [key: string]: AppNotificationType };
  createNotification: (params: CreateAppNotificationParams) => void;
  clearNotifications: () => void;
  checkAllNotifications: () => void;
  hiddenAssets: { [key: string]: boolean };
  setHiddenAssets: (update: SetStateAction<{ [key: string]: boolean }>) => void;
  notifications: AppNotification[];
  tokens: TokenWhitelabelApp[];
  currencyUser?: string;
  setAssets: (update: SetStateAction<{ [key: string]: Asset }>) => void;
  setTokens: (update: SetStateAction<TokenWhitelabelApp[]>) => void;
  userEventURL?: string;
  siteId?: number;
  widgetId?: number;
  assets: { [key: string]: Asset };
  transactions: { [key: string]: AppTransaction };
  watchTransactionDialog: WatchTransactionDialogProperties;
  activeChainIds: number[];
}

export const DexKitContext = React.createContext<DexkitContextState>({
  notificationTypes: {},
  notifications: [],
  transactions: {},
  tokens: [],
  hiddenAssets: {},
  setHiddenAssets() {},
  assets: {},
  setAssets() {},
  setTokens() {},
  onChangeLocale: (locale: string) => {},
  createNotification: (params: CreateAppNotificationParams) => {},
  checkAllNotifications: () => {},
  clearNotifications: () => {},
  activeChainIds: SUPPORTED_LEGACY_CHAIN_IDS,
  watchTransactionDialog: {
    values: undefined,
    open: (type: string, values: Record<string, any>) => {},
    close: () => {},
    redirectUrl: "",
    setRedirectUrl: (update?: SetStateAction<string | undefined>) => {},
    error: undefined,
    hash: undefined,
    metadata: undefined,
    type: undefined,
    isOpen: false,
    setHash: (update?: SetStateAction<string | undefined>) => {},
    setType: (update?: SetStateAction<string | undefined>) => {},
    setDialogIsOpen: (update: SetStateAction<boolean>) => {},
    setError: (update?: SetStateAction<Error | undefined>) => {},
    setMetadata: (
      update?: SetStateAction<TransactionMetadata | undefined>
    ) => {},
    showDialog: (
      open: boolean,
      metadata?: TransactionMetadata,
      type?: TransactionType
    ) => {},
    setDialogError: (error?: Error) => {},
    addTransaction: ({
      hash,
      type,
      metadata,
      values,
      chainId,
    }: {
      hash: string;
      type: TransactionType;
      metadata?: TransactionMetadata | undefined;
      values: Record<string, any>;
      chainId: ChainId;
    }) => {},
    watch: (hash: string) => {},
  },
  widgetId: undefined,
  apiKey: undefined,
});
