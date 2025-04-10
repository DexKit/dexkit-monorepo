import {
  FormattedMessage,
  IntlProvider,
  MessageFormatElement,
} from "react-intl";

import { SnackbarProvider } from "notistack";

import { useDexkitContextState } from "../hooks/useDexkitContextState";

import type {
  AppTransaction,
  Asset,
  TokenWhitelabelApp,
} from "@dexkit/core/types";

import { Button, CssBaseline, Stack, Typography } from "@mui/material";
import { PrimitiveAtom, SetStateAction, WritableAtom } from "jotai";

import {
  Experimental_CssVarsProvider as CssVarsProvider,
  SupportedColorScheme,
} from "@mui/material/styles";
import React from "react";
import { DexKitContext } from "../context/DexKitContext";
import type { AppNotification, AppNotificationType } from "../types";
import { AppErrorBoundary } from "./AppErrorBoundary";
import GaslessTradesUpdater from "./GaslessTradesUpdater";
import TransactionUpdater from "./TransactionUpdater";
export interface DexkitProviderProps {
  theme: {
    cssVarPrefix?: string | undefined;
    colorSchemes: Record<SupportedColorScheme, Record<string, any>>;
  };
  affiliateReferral?: string;
  locale: string;
  activeChainIds?: number[];
  defaultLocale?: string;
  onChangeLocale: (locale: string) => void;
  notificationTypes: { [key: string]: AppNotificationType };
  localeMessages?:
    | Record<string, string>
    | Record<string, MessageFormatElement[]>;
  children: React.ReactNode | React.ReactNode[];
  options?: {
    magicRedirectUrl: string;
  };
  userEventsURL?: string;
  siteId?: number;
  transactionsAtom: WritableAtom<
    {
      [key: string]: AppTransaction;
    },
    SetStateAction<{
      [key: string]: AppTransaction;
    }>,
    void
  >;
  notificationsAtom: PrimitiveAtom<AppNotification[]>;
  tokensAtom: PrimitiveAtom<TokenWhitelabelApp[]>;
  assetsAtom: PrimitiveAtom<{ [key: string]: Asset }>;
  hiddenAssetsAtom: PrimitiveAtom<{ [key: string]: boolean }>;
  currencyUserAtom: PrimitiveAtom<string>;
  selectedWalletAtom: PrimitiveAtom<string>;
}

export function DexkitProvider({
  children,
  theme,
  affiliateReferral,
  currencyUserAtom,
  selectedWalletAtom,
  transactionsAtom,
  locale,
  tokensAtom,
  assetsAtom,
  hiddenAssetsAtom,
  onChangeLocale,
  localeMessages,
  notificationTypes,
  notificationsAtom,
  userEventsURL,
  activeChainIds,
  siteId,
}: DexkitProviderProps) {
  const appState = useDexkitContextState({
    notificationTypes,
    notificationsAtom,
    tokensAtom,
    assetsAtom,
    hiddenAssetsAtom,
    transactionsAtom,
    currencyUserAtom,
    onChangeLocale,
  });

  return (
    <DexKitContext.Provider
      value={{
        ...appState,
        userEventURL: userEventsURL,
        siteId: siteId,
        affiliateReferral,
        activeChainIds: activeChainIds ? activeChainIds : [1],
      }}
    >
      <IntlProvider
        locale={locale}
        defaultLocale={locale}
        messages={localeMessages}
      >
        <AppErrorBoundary
          fallbackRender={({ resetErrorBoundary, error }) => (
            <Stack justifyContent="center" alignItems="center">
              <Typography variant="h6">
                <FormattedMessage
                  id="something.went.wrong"
                  defaultMessage="Oops, something went wrong"
                  description="Something went wrong error message"
                />
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {String(error)}
              </Typography>
              <Button color="primary" onClick={resetErrorBoundary}>
                <FormattedMessage
                  id="try.again"
                  defaultMessage="Try again"
                  description="Try again"
                />
              </Button>
            </Stack>
          )}
        >
          <CssVarsProvider theme={theme}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <CssBaseline />
              {children}
              <TransactionUpdater pendingTransactionsAtom={transactionsAtom} />
              <GaslessTradesUpdater />
            </SnackbarProvider>
          </CssVarsProvider>
        </AppErrorBoundary>
      </IntlProvider>
    </DexKitContext.Provider>
  );
}
