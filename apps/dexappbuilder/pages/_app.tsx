import { EmotionCache } from '@emotion/react';
import { Analytics } from '@vercel/analytics/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

import '../src/polyfills/react-draggable-polyfill';
import '../src/polyfills/react-polyfills';

import type { } from '@mui/material/themeCssVarsAugmentation';

import defaultAppConfig from '@dexkit/ui/config/app.minimal.json';

import '../src/styles/editSectionDialog.css';
import './customCss.css';

import { setupTheme } from '@dexkit/ui/services/app';

import { AppMarketplaceProvider } from '../src/AppMarketplaceProvider';
import { PageProps } from '../src/PageProps';
import createEmotionCache from '../src/createEmotionCache';
import { getTheme } from '../src/getTheme';
import VibecoderDialogProvider from '../src/components/VibecoderDialogProvider';

import { AppConfigContext as AppUIConfigContext } from '@dexkit/ui/context/AppConfigContext';
import SiteProvider from '@dexkit/ui/providers/SiteProvider';
import { AuthStateProvider } from '@dexkit/ui/providers/authStateProvider';
import { setupSEO } from '@dexkit/ui/services/app';
import { CacheProvider } from '@emotion/react';
import { Backdrop, CircularProgress, ThemeProvider } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { DefaultSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { ThirdwebProvider } from 'thirdweb/react';
interface MyAppProps extends AppProps<PageProps> {
  emotionCache?: EmotionCache;
}
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props: MyAppProps) {
  const { pageProps, Component, emotionCache = clientSideEmotionCache } = props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { appConfig, appNFT, siteId, site, appPage, appLocaleMessages } =
    pageProps;

  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          suspense: false,
          staleTime: 60 * 1000,
        },
      },
    }),
  );

  useEffect(() => {
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

  const getLayout = (Component as any).getLayout || ((page: any) => page);

  const theme = useMemo(() => setupTheme({ appConfig, getTheme }), [appConfig, getTheme]);

  const SEO = setupSEO({ appConfig, appPage });

  const config = appConfig || (defaultAppConfig as any);
  const favicon = config.favicon_url || '/favicon.ico';
  const isPNG = favicon.endsWith('.png');

  return (
    <>
      <Head>
        {isPNG ? (
          <link rel="icon" type="image/png" href={favicon} />
        ) : (
          <link rel="shortcut icon" href={favicon} />
        )}
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="theme-color"
          content={(theme as any)?.colorSchemes?.light?.palette?.primary?.main || '#1976d2'}
        />
      </Head>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <AuthStateProvider>
            <SiteProvider siteId={siteId} slug={site}>
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
                                (theme as any)?.colorSchemes?.light?.palette?.primary
                                  ?.main || theme.palette.primary.main,
                              zIndex: theme.zIndex.drawer + 1,
                            }}
                          >
                            <CircularProgress color="inherit" size={80} />
                          </Backdrop>
                          {getLayout(<Component {...pageProps} />)}
                          <VibecoderDialogProvider />
                        </AppMarketplaceProvider>
                      </LocalizationProvider>
                    </Hydrate>
                  </QueryClientProvider>
                </ThirdwebProvider>
              </AppUIConfigContext.Provider>
            </SiteProvider>
          </AuthStateProvider>
        </ThemeProvider>
      </CacheProvider>
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </>
  );
}
