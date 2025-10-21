import {
  SUPPORTED_DEXAPPBUILDER_CHAIN_IDS,
  SUPPORTED_LEGACY_CHAIN_IDS,
} from '@dexkit/evm-chains/constants';

import { EXCHANGE_NOTIFICATION_TYPES } from '@dexkit/exchange/constants/messages';
import {
  COMMON_NOTIFICATION_TYPES,
  WHITELABEL_NOTIFICATION_TYPES,
} from '@dexkit/ui/constants/messages/common';
import { useLocale } from '@dexkit/ui/hooks/useLocale';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { DexkitProvider } from '@dexkit/ui/providers/DexkitProvider';
import { setupSEO, setupTheme } from '@dexkit/ui/services/app';
import { useAtom } from 'jotai';
import { DefaultSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppConfig } from 'src/hooks/app/useAppConfig';
import { useSiteId } from 'src/hooks/app/useSiteId';
import {
  assetsAtom,
  currencyUserAtom,
  hiddenAssetsAtom,
  notificationsAtom,
  referralAtom,
  selectedWalletAtom,
  tokensAtom,
  transactionsAtomV2,
} from 'src/state/atoms';
import { getTheme } from 'src/theme';
import { loadLocaleMessages } from '../utils/intl';

export interface AppMarketplaceContextProps {
  children: React.ReactNode | React.ReactNode[];
  appLocaleMessages?: Record<string, string> | null;
  appPage?: string;
  appConfig?: AppConfig;
}

export function AppMarketplaceProvider({
  children,
  appPage,
  appLocaleMessages,
  appConfig: propsAppConfig,
}: AppMarketplaceContextProps) {
  const hookAppConfig = useAppConfig();
  const siteId = useSiteId();
  const router = useRouter();

  const appConfig = propsAppConfig || hookAppConfig;

  console.log('AppMarketplaceProvider - appConfig:', appConfig);

  const { locale, onChangeLocale } = useLocale();

  const [ref, setRef] = useAtom(referralAtom);

  const [messages, setMessages] = useState<any | null>(appLocaleMessages);

  useEffect(() => {
    loadLocaleMessages(locale).then((data) => setMessages(data.default));
  }, [locale]);

  useEffect(() => {
    if (router.query.ref) {
      (setRef as any)(router.query.ref as string);
    }
  }, [router.query.ref]);

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
        magicRedirectUrl:
          typeof window !== 'undefined'
            ? window.location.href
            : process.env.NEXT_PUBLIC_MAGIC_REDIRECT_URL || '',
      }}
      notificationTypes={{
        ...WHITELABEL_NOTIFICATION_TYPES,
        ...EXCHANGE_NOTIFICATION_TYPES,
        ...COMMON_NOTIFICATION_TYPES,
      }}
      userEventsURL={'/api/user-events'}
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
