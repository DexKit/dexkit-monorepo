import { CacheProvider, EmotionCache } from '@emotion/react';
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';
import createEmotionCache from '../src/createEmotionCache';

import { DefaultSeo } from 'next-seo';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { useRouter } from 'next/router';

import { ThemeMode } from '@dexkit/ui/constants/enum';
import { Backdrop, CircularProgress } from '@mui/material';
import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { getTheme } from 'src/theme';
import { AssetAPI } from 'src/types/nft';
import defaultAppConfig from '../config/app.json';
import { AppMarketplaceProvider } from '../src/components/AppMarketplaceProvider';
import { AppConfigContext } from '../src/contexts';
import { AppConfig } from '../src/types/config';
import './customCss.css';

import SiteProvider from '@dexkit/ui/providers/SiteProvider';
import { AppBarANN } from 'src/components/AppBarANN';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps<{ dehydratedState: DehydratedState }> {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const { appConfig, appNFT, siteId, site } = pageProps as {
    appConfig: AppConfig;
    appNFT: AssetAPI;
    siteId: number | undefined;
    dehydratedState: DehydratedState;
    site?: string;
  };

  const [queryClient] = React.useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          suspense: false,
        },
      },
    }),
  );

  const getLayout = (Component as any).getLayout || ((page: any) => page);

  const theme = React.useMemo(() => {
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

      if (appConfig?.customThemeLight) {
        customTheme.light = JSON.parse(appConfig.customThemeLight);
      }
      if (appConfig?.customThemeDark) {
        customTheme.dark = JSON.parse(appConfig.customThemeDark);
      }
      //@deprecated remove customTheme later
      if (appConfig?.customTheme) {
        const parsedCustomTheme = JSON.parse(appConfig.customTheme);
        if (parsedCustomTheme?.palette?.mode === ThemeMode.light) {
          customTheme.light = parsedCustomTheme;
        } else {
          customTheme.dark = parsedCustomTheme;
        }
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

  const SEO = React.useMemo(() => {
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
  React.useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setLoading(true);
    });

    router.events.on('routeChangeComplete', () => {
      setLoading(false);
    });
    router.events.on('routeChangeError', () => {
      setLoading(false);
    });

    return () => {
      router.events.off('routeChangeStart', () => {
        setLoading(false);
      });
      router.events.off('routeChangeComplete', () => {
        setLoading(false);
      });
      router.events.off('routeChangeError', () => {
        setLoading(false);
      });
    };
  }, [router]);

  const config = appConfig || defaultAppConfig;
  const favicon = config.favicon_url || '/favicon.ico';

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <link rel="shortcut icon" href={favicon} />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="theme-color"
          content={theme?.colorSchemes?.light?.palette?.primary?.main}
        />
      </Head>
      <SiteProvider siteId={siteId} slug={site}>
        <AppConfigContext.Provider
          value={{ appConfig: config, appNFT, siteId }}
        >
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <DefaultSeo {...SEO} />
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <AppMarketplaceProvider>
                  <Backdrop
                    open={loading}
                    sx={{
                      color: theme?.colorSchemes?.light?.palette?.primary?.main,
                      zIndex: theme.zIndex.drawer + 1,
                    }}
                  >
                    <CircularProgress color="inherit" size={80} />
                  </Backdrop>
                  <AppBarANN />
                  {getLayout(<Component {...pageProps} />)}
                </AppMarketplaceProvider>
              </LocalizationProvider>
            </Hydrate>
          </QueryClientProvider>
        </AppConfigContext.Provider>
      </SiteProvider>
      <Analytics />
    </CacheProvider>
  );
}
