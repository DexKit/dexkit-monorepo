import { DexkitProvider } from '@dexkit/ui/components';
import { createTheme, responsiveFontSizes, Theme } from '@mui/material';
import { useAtomValue } from 'jotai';
import { DefaultSeo } from 'next-seo';
import { useMemo } from 'react';
import { useAppConfig } from 'src/hooks/app';
import { localeAtom, pendingTransactionsAtom } from 'src/state/atoms';
import { getTheme } from 'src/theme';

import defaultAppConfig from '../../config/app.json';

export interface AppMarketplaceContextProps {
  children: React.ReactNode | React.ReactNode[];
}

export function AppMarketplaceContext({
  children,
}: AppMarketplaceContextProps) {
  const appConfig = useAppConfig();
  const locale = useAtomValue(localeAtom);

  const theme = useMemo<Theme>(() => {
    let tempTheme = getTheme(defaultAppConfig.theme)?.theme;
    let fontFamily;
    if (appConfig?.font) {
      fontFamily = `'${appConfig.font.family}', ${appConfig.font.category}`;
    }

    if (appConfig) {
      tempTheme = getTheme(appConfig.theme)?.theme;
    }
    if (appConfig && appConfig.theme === 'custom' && appConfig.customTheme) {
      const customTheme = JSON.parse(appConfig.customTheme);

      return responsiveFontSizes(
        fontFamily
          ? createTheme({
              ...customTheme,
              typography: {
                fontFamily,
              },
            })
          : createTheme(customTheme)
      );
    }

    return responsiveFontSizes(
      fontFamily
        ? createTheme({
            ...tempTheme,
            typography: {
              fontFamily,
            },
          })
        : createTheme(tempTheme)
    );
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
      pendingTransactionsAtom={pendingTransactionsAtom}
      locale={locale}
      defaultLocale={appConfig.locale}
      theme={theme}
    >
      <DefaultSeo {...SEO} />
      {children}
    </DexkitProvider>
  );
}
