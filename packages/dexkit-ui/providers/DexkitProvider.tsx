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

import { DexKitContext } from "@dexkit/core/providers/DexKitContext";
import { ThemeProvider, useColorScheme } from "@mui/material/styles";
import React from "react";
import { AppErrorBoundary } from "../components/AppErrorBoundary";
import GaslessTradesUpdater from "../components/GaslessTradesUpdater";
import TransactionUpdater from "../components/TransactionUpdater";
import { useForceThemeMode, useThemeMode } from "../hooks";
import type { AppNotification, AppNotificationType } from "../types";

function ThemeSyncComponent() {
  const { mode: normalMode } = useThemeMode();
  const { mode: forcedMode, isForced } = useForceThemeMode();
  const { setMode, mode: currentColorSchemeMode } = useColorScheme();

  const effectiveMode = forcedMode || normalMode;

  React.useEffect(() => {
    if (setMode && effectiveMode !== currentColorSchemeMode) {
      setMode(effectiveMode);
    }
  }, [effectiveMode, setMode, currentColorSchemeMode, isForced]);

  return null;
}

function ThemeWrapper({ children, theme }: { children: React.ReactNode; theme: any }) {
  return (
    <ThemeProvider theme={theme}>
      <ThemeSyncComponent />
      {children}
    </ThemeProvider>
  );
}

export interface DexkitProviderProps {
  provider?: any;
  apiKey?: string;
  onConnectWallet?: () => void;
  theme: any;
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
  widgetId?: number;
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
  apiKey,
  provider,
  onConnectWallet,
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
  widgetId,
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
        onConnectWallet,
        provider,
        apiKey,
        userEventURL: userEventsURL,
        siteId: siteId,
        widgetId: widgetId,
        affiliateReferral,
        activeChainIds: activeChainIds ? activeChainIds : [1],
      }}
    >
      {(React as any).createElement(IntlProvider, {
        locale: locale,
        defaultLocale: locale,
        messages: localeMessages,
        children: (
          <AppErrorBoundary
            fallbackRender={({ resetErrorBoundary, error }: any) => (
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
            <ThemeWrapper theme={theme}>
              {(React as any).createElement(SnackbarProvider, {
                maxSnack: 3,
                anchorOrigin: { horizontal: "right", vertical: "bottom" },
                children: (
                  <>
                    <CssBaseline />
                    {children}
                    <TransactionUpdater pendingTransactionsAtom={transactionsAtom} />
                    <GaslessTradesUpdater />
                  </>
                )
              })}
            </ThemeWrapper>
          </AppErrorBoundary>
        )
      })}
    </DexKitContext.Provider>
  );
}
