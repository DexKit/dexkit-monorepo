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

import { AppConfigContext as AppUIConfigContext } from '@dexkit/ui/context/AppConfigContext';
import { Backdrop, CircularProgress } from '@mui/material';

import type {} from '@mui/material/themeCssVarsAugmentation';
import { getTheme } from 'src/theme';

import defaultAppConfig from '../config/app.json';
import { AppMarketplaceProvider } from '../src/components/AppMarketplaceProvider';
import { AppConfigContext } from '../src/contexts';

import './customCss.css';

import type { AssetAPI } from '@dexkit/ui/modules/nft/types';
import type { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import SiteProvider from '@dexkit/ui/providers/SiteProvider';
import { AuthStateProvider } from '@dexkit/ui/providers/authStateProvider';
import { setupSEO, setupTheme } from '@dexkit/ui/services/app';
import { AppBarANN } from 'src/components/AppBarANN';
import { ThirdwebProvider } from 'thirdweb/react';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps<{ dehydratedState: DehydratedState }> {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const { appConfig, appNFT, siteId, site, appPage, appLocaleMessages } =
    pageProps as {
      appConfig: AppConfig;
      appNFT: AssetAPI;
      siteId: number | undefined;
      dehydratedState: DehydratedState;
      site?: string;
      appPage?: string;
      appLocaleMessages?: Record<string, string> | null;
    };

  const [queryClient] = React.useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          suspense: false,
          staleTime: 60 * 1000,
        },
      },
    }),
  );

  const getLayout = (Component as any).getLayout || ((page: any) => page);

  const theme = setupTheme({ appConfig, getTheme });

  const SEO = setupSEO({ appConfig, appPage });

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
  const isPNG = favicon.endsWith('.png');

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        {isPNG ? (
          <link rel="icon" type="image/png" href={favicon} />
        ) : (
          <link rel="shortcut icon" href={favicon} />
        )}
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="theme-color"
          content={theme?.colorSchemes?.light?.palette?.primary?.main}
        />
      </Head>
      <AuthStateProvider>
        <SiteProvider siteId={siteId} slug={site}>
          <AppConfigContext.Provider
            value={{ appConfig: config, appNFT, siteId }}
          >
            <AppUIConfigContext.Provider
              value={{ appConfig: config, appNFT, siteId }}
            >
              <ThirdwebProvider>
                <QueryClientProvider client={queryClient}>
                  <Hydrate state={pageProps.dehydratedState}>
                    <DefaultSeo {...SEO} />
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <AppMarketplaceProvider
                        appLocaleMessages={appLocaleMessages}
                      >
                        <Backdrop
                          open={loading}
                          sx={{
                            color:
                              theme?.colorSchemes?.light?.palette?.primary
                                ?.main,
                            zIndex: theme.zIndex.drawer + 1,
                          }}
                        >
                          <CircularProgress color="inherit" size={80} />
                        </Backdrop>
                        {false && <AppBarANN />}
                        {getLayout(<Component {...pageProps} />)}
                      </AppMarketplaceProvider>
                    </LocalizationProvider>
                  </Hydrate>
                </QueryClientProvider>
              </ThirdwebProvider>
            </AppUIConfigContext.Provider>
          </AppConfigContext.Provider>
        </SiteProvider>
      </AuthStateProvider>
      <Analytics />
    </CacheProvider>
  );
}
