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
import React from "react";
import { createContext } from "react";

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
  setHiddenAssets: (update: any) => void;
  notifications: AppNotification[];
  tokens: TokenWhitelabelApp[];
  currencyUser?: string;
  setAssets: (update: any) => void;
  setTokens: (update: any) => void;
  userEventURL?: string;
  siteId?: number;
  widgetId?: number;
  assets: { [key: string]: Asset };
  transactions: { [key: string]: AppTransaction };
  watchTransactionDialog: WatchTransactionDialogProperties;
  activeChainIds: number[];
}

export const DexKitContext = createContext<DexkitContextState>({
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
    setRedirectUrl: (update?: any) => {},
    error: undefined,
    hash: undefined,
    metadata: undefined,
    type: undefined,
    isOpen: false,
    setHash: (update?: any) => {},
    setType: (update?: any) => {},
    setDialogIsOpen: (update: any) => {},
    setError: (update?: any) => {},
    setMetadata: (
      update?: any
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
