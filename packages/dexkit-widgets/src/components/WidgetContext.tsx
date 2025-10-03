import { DexkitProvider } from "@dexkit/ui/components";
import { COMMON_NOTIFICATION_TYPES } from "@dexkit/ui/constants/messages/common";
import { createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useState } from "react";
import {
  notificationsAtom,
  selectedWalletAtom,
  transactionsAtomV2,
} from "../state/atoms";

// Temporary atoms for DexkitProvider requirements
const tokensAtom = atomWithStorage<any[]>("dexkit.widget.tokens", []);
const assetsAtom = atomWithStorage<{ [key: string]: any }>("dexkit.widget.assets", {});
const hiddenAssetsAtom = atomWithStorage<{ [key: string]: boolean }>("dexkit.widget.hiddenAssets", {});
const currencyUserAtom = atomWithStorage<string>("dexkit.widget.currency", "usd");

export interface AppMarketplaceContextProps {
  children: React.ReactNode | React.ReactNode[];
}

const theme = createTheme({});

export function WidgetContext({ children }: AppMarketplaceContextProps) {
  const [locale, setLocale] = useState("en-US");
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <DexkitProvider
        locale={locale}
        defaultLocale={locale}
        theme={theme}
        selectedWalletAtom={selectedWalletAtom}
        options={{
          magicRedirectUrl: process.env.NEXT_PUBLIC_MAGIC_REDIRECT_URL || "",
        }}
        notificationTypes={{
          ...COMMON_NOTIFICATION_TYPES,
        }}
        transactionsAtom={transactionsAtomV2}
        notificationsAtom={notificationsAtom}
        tokensAtom={tokensAtom}
        assetsAtom={assetsAtom}
        hiddenAssetsAtom={hiddenAssetsAtom}
        currencyUserAtom={currencyUserAtom}
        onChangeLocale={(loc) => setLocale(loc)}
      >
        {children}
      </DexkitProvider>
    </QueryClientProvider>
  );
}
