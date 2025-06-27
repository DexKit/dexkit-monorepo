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
import { DexkitProvider } from "@dexkit/ui/providers/DexkitProvider";
import { setupSEO, setupTheme } from "@dexkit/ui/services/app";
import { useAtom } from "jotai";
import { DefaultSeo } from "next-seo";
import { useEffect, useState } from "react";

import {
  assetsAtom,
  currencyUserAtom,
  hiddenAssetsAtom,
  notificationsAtom,
  referralAtom,
  selectedWalletAtom,
  tokensAtom,
  transactionsAtomV2,
} from "@dexkit/dexappbuilder-viewer/state/atoms";
import { getTheme } from "@dexkit/dexappbuilder-viewer/themes/theme";
import { useRouter } from "next/router";

import { loadLocaleMessages } from "@dexkit/dexappbuilder-viewer/utils/intl";
import { useAppConfig } from "@dexkit/ui/hooks/useAppConfig";
import { useSiteId } from "@dexkit/ui/hooks/useSiteId";
import React from "react";

export interface AppMarketplaceContextProps {
  children: React.ReactNode | React.ReactNode[];
  appLocaleMessages?: Record<string, string> | null;
  appPage?: string;
}

export function AppMarketplaceProvider({
  children,
  appPage,
  appLocaleMessages,
}: AppMarketplaceContextProps) {
  const appConfig = useAppConfig();
  const siteId = useSiteId();
  const router = useRouter();

  const { locale, onChangeLocale } = useLocale();

  const [ref, setRef] = useAtom(referralAtom);

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

  const SEO = setupSEO({ appConfig, appPage });

  return (
    <DexkitProvider
      locale={locale}
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
        siteId
          ? appConfig.activeChainIds || SUPPORTED_LEGACY_CHAIN_IDS
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
      userEventsURL={"/api/user-events"}
      transactionsAtom={transactionsAtomV2}
      notificationsAtom={notificationsAtom}
      siteId={siteId}
      onChangeLocale={(loc) => onChangeLocale(loc)}
    >
      <DefaultSeo {...SEO} />
      {children}
    </DexkitProvider>
  );
}
