import { EXCHANGE_NOTIFICATION_TYPES } from '@dexkit/exchange/constants/messages';
import { DexkitProvider } from '@dexkit/ui/components';
import { ThemeMode } from '@dexkit/ui/constants/enum';
import { COMMON_NOTIFICATION_TYPES } from '@dexkit/ui/constants/messages/common';
import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { useAtom } from 'jotai';
import { DefaultSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { WHITELABEL_NOTIFICATION_TYPES } from 'src/constants/messages';
import {
  useAppConfig,
  useLocale,
  useSiteId,
  useThemeMode,
} from 'src/hooks/app';
import {
  assetsAtom,
  currencyUserAtom,
  notificationsAtom,
  referralAtom,
  selectedWalletAtom,
  tokensAtom,
  transactionsAtomV2,
} from 'src/state/atoms';
import { getTheme } from 'src/theme';
import defaultAppConfig from '../../config/app.json';
import { loadLocaleData } from '../utils/intl';

export interface AppMarketplaceContextProps {
  children: React.ReactNode | React.ReactNode[];
}

export function AppMarketplaceProvider({
  children,
}: AppMarketplaceContextProps) {
  const appConfig = useAppConfig();
  const siteId = useSiteId();
  const router = useRouter();

  const { locale: defaultLocale } = useLocale();
  const [locale, setLocale] = useState(defaultLocale);
  const [ref, setRef] = useAtom(referralAtom);
  const { mode } = useThemeMode();


  useEffect(()=> {
    if(router.query.ref){
      setRef(router.query.ref as string);
    }

  },[router.query.ref])

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
      defaultLocale={locale}
      affiliateReferral={ref}
      currencyUserAtom={currencyUserAtom}
      localeMessages={loadLocaleData(locale)}
      theme={theme}
      selectedWalletAtom={selectedWalletAtom}
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
      onChangeLocale={(loc) => setLocale(loc)}
    >
      <DefaultSeo {...SEO} />
      {children}
    </DexkitProvider>
  );
}
