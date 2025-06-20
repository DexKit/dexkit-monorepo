import {
  SUPPORTED_DEXAPPBUILDER_CHAIN_IDS,
  SUPPORTED_LEGACY_CHAIN_IDS,
} from "@dexkit/evm-chains";
import { EXCHANGE_NOTIFICATION_TYPES } from "@dexkit/exchange/constants/messages";
import {
  COMMON_NOTIFICATION_TYPES,
  WHITELABEL_NOTIFICATION_TYPES,
} from "@dexkit/ui/constants/messages/common";
import { useLocale } from "@dexkit/ui/hooks/useLocale";
import { setupTheme } from "@dexkit/ui/services/app";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSetActiveWallet } from "thirdweb/react";
import {
  assetsAtom,
  currencyUserAtom,
  hiddenAssetsAtom,
  notificationsAtom,
  referralAtom,
  selectedWalletAtom,
  tokensAtom,
  transactionsAtomV2,
} from "../state/atoms";

import { AppConfigContext } from "@dexkit/ui/context/AppConfigContext";
import { AppConfig } from "@dexkit/ui/modules/wizard/types/config";
import { DexkitProvider } from "@dexkit/ui/providers/DexkitProvider";
import { client } from "@dexkit/wallet-connectors/thirdweb/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { EIP1193 } from "thirdweb/wallets";
import { getTheme } from "../themes/theme";
import { loadLocaleMessages } from "../utils/intl";

export interface WidgetContextProps {
  provider?: any;
  widgetId?: number;
  appConfig: AppConfig;
  apiKey?: string;
  onConnectWallet?: () => void;
  children: React.ReactNode | React.ReactNode[];
  appLocaleMessages?: Record<string, string> | null;
}

export function WidgetProvider({
  children,
  appConfig,
  widgetId,
  apiKey,
  onConnectWallet,
  provider,
  appLocaleMessages,
}: WidgetContextProps) {
  const router = useRouter();
  const setActiveWallet = useSetActiveWallet();
  const { locale, onChangeLocale } = useLocale();

  const [ref, setRef] = useAtom(referralAtom);

  const [queryClient] = React.useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          suspense: false,
          staleTime: 60 * 1000,
        },
      },
    })
  );

  useEffect(() => {
    if (router.query.ref) {
      //@ts-ignore
      setRef(router.query.ref as string);
    }
  }, [router.query.ref, setRef]);

  const [messages, setMessages] = useState<any | null>(appLocaleMessages);

  useEffect(() => {
    loadLocaleMessages(locale).then((data) => setMessages(data.default));
  }, [locale]);

  const theme = setupTheme({ appConfig, getTheme });

  useEffect(() => {
    const setActive = async () => {
      if (provider) {
        const thirdwebWallet = EIP1193.fromProvider({
          provider,
        });
        await thirdwebWallet.connect({
          client,
        });
        setActiveWallet(thirdwebWallet);
      }
    };
    setActive();
  }, [provider, setActiveWallet]);

  return (
    <ThirdwebProvider>
      <QueryClientProvider client={queryClient}>
        <AppConfigContext.Provider value={{ appConfig: appConfig }}>
          <DexkitProvider
            widgetId={widgetId}
            apiKey={apiKey}
            locale={locale}
            onConnectWallet={onConnectWallet}
            tokensAtom={tokensAtom}
            assetsAtom={assetsAtom}
            hiddenAssetsAtom={hiddenAssetsAtom}
            defaultLocale={locale}
            affiliateReferral={ref}
            currencyUserAtom={currencyUserAtom}
            localeMessages={messages}
            theme={theme}
            selectedWalletAtom={selectedWalletAtom}
            activeChainIds={
              widgetId
                ? appConfig?.activeChainIds || SUPPORTED_LEGACY_CHAIN_IDS
                : SUPPORTED_DEXAPPBUILDER_CHAIN_IDS
            }
            options={{
              magicRedirectUrl: "",
            }}
            notificationTypes={{
              ...WHITELABEL_NOTIFICATION_TYPES,
              ...EXCHANGE_NOTIFICATION_TYPES,
              ...COMMON_NOTIFICATION_TYPES,
            }}
            userEventsURL={`${process.env.NEXT_PUBLIC_DEXKIT_DASH_ENDPOINT}/user-events`}
            transactionsAtom={transactionsAtomV2}
            notificationsAtom={notificationsAtom}
            onChangeLocale={(loc) => onChangeLocale(loc)}
          >
            {children}
          </DexkitProvider>
        </AppConfigContext.Provider>
      </QueryClientProvider>
    </ThirdwebProvider>
  );
}
