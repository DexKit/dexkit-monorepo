import {
  SUPPORTED_DEXAPPBUILDER_CHAIN_IDS,
  SUPPORTED_LEGACY_CHAIN_IDS,
} from '@dexkit/evm-chains/constants';

import { EXCHANGE_NOTIFICATION_TYPES } from '@dexkit/exchange/constants/messages';
import { DexkitProvider } from '@dexkit/ui/components/DexkitProvider';
import { ThemeMode } from '@dexkit/ui/constants/enum';
import { COMMON_NOTIFICATION_TYPES } from '@dexkit/ui/constants/messages/common';
import { useLocale } from '@dexkit/ui/hooks/useLocale';
import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { useAtom } from 'jotai';
import { DefaultSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { WHITELABEL_NOTIFICATION_TYPES } from 'src/constants/messages';
import { useAppConfig, useSiteId, useThemeMode } from 'src/hooks/app';
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
import defaultAppConfig from '../../config/app.json';
import { loadLocaleMessages } from '../utils/intl';

export interface AppMarketplaceContextProps {
  children: React.ReactNode | React.ReactNode[];
  appLocaleMessages?: Record<string, string> | null;
}

export function AppMarketplaceProvider({
  children,
  appLocaleMessages,
}: AppMarketplaceContextProps) {
  const appConfig = useAppConfig();
  const siteId = useSiteId();
  const router = useRouter();

  const { locale, onChangeLocale } = useLocale();

  const [ref, setRef] = useAtom(referralAtom);
  const { mode } = useThemeMode();

  const [messages, setMessages] = useState<any | null>(appLocaleMessages);

  useEffect(() => {
    loadLocaleMessages(locale).then((data) => setMessages(data.default));
  }, [locale]);

  useEffect(() => {
    if (router.query.ref) {
      setRef(router.query.ref as string);
    }
  }, [router.query.ref]);

  const theme = useMemo(() => {
    let tempTheme = getTheme({
      name: defaultAppConfig.theme,
    })?.theme;
    let fontFamily;
    if (appConfig?.font) {
      fontFamily = `'${appConfig.font.family}', ${appConfig.font.category}`;
    }

    if (appConfig) {
      tempTheme = getTheme({
        name: appConfig.theme,
      })?.theme;
    }

    if (appConfig && appConfig.theme === 'custom') {
      let customTheme = {
        dark: {},
        light: {},
      };
      if (appConfig.customTheme) {
        const parsedCustomTheme = JSON.parse(appConfig.customTheme);
        if (parsedCustomTheme.palette.mode === ThemeMode.light) {
          customTheme.light = parsedCustomTheme;
        } else {
          customTheme.dark = parsedCustomTheme;
        }
      }

      if (mode === ThemeMode.light && appConfig.customThemeLight) {
        customTheme.light = JSON.parse(appConfig.customThemeLight);
      }
      if (mode === ThemeMode.dark && appConfig.customThemeDark) {
        customTheme.dark = JSON.parse(appConfig.customThemeDark);
      }

      if (customTheme) {
        return fontFamily
          ? extendTheme({
              typography: {
                fontFamily,
              },
              colorSchemes: {
                ...customTheme,
              },
            })
          : extendTheme({
              colorSchemes: {
                ...customTheme,
              },
            });
      }
    }

    let temp: any = tempTheme;

    delete temp['vars'];

    return fontFamily
      ? extendTheme({
          ...temp,
          typography: {
            fontFamily,
          },
        })
      : extendTheme({ ...temp });
  }, [appConfig]);

  const SEO = useMemo(() => {
    const config = appConfig;

    if (config) {
      const seoConfig: any = {
        defaultTitle: config.seo?.home?.title || config.name,
        titleTemplate: `${config.name} | %s`,
        description: config.seo?.home?.description,
        canonical: config.domain,
        openGraph: {
          type: 'website',
          description: config.seo?.home?.description || '',
          locale: config.locale || 'en_US',
          url: config.domain,
          site_name: config.name,
          images: config.seo?.home?.images,
        },
      };

      if (config.social) {
        for (let social of config.social) {
          if (social.type === 'twitter') {
            seoConfig.twitter = {
              handle: `@${social.handle}`,
              site: `@${social.handle}`,
              cardType: 'summary_large_image',
            };
          }
        }
      }

      return seoConfig;
    }
  }, [appConfig]);

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
