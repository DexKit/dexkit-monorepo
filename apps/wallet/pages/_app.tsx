import { EmotionCache } from "@emotion/react";
import { AppProps } from "next/app";
import Head from "next/head";

import type {} from "@mui/material/themeCssVarsAugmentation";

import {
  AppMarketplaceProvider,
  PageProps,
  createEmotionCache,
  getTheme,
} from "@dexkit/dexappbuilder-render";
import { setupTheme } from "@dexkit/ui/services/app";
import React from "react";

import defaultAppConfig from "@dexkit/ui/config/app.json";
import { AppConfigContext as AppUIConfigContext } from "@dexkit/ui/context/AppConfigContext";
import SiteProvider from "@dexkit/ui/providers/SiteProvider";
import { AuthStateProvider } from "@dexkit/ui/providers/authStateProvider";
import { setupSEO } from "@dexkit/ui/services/app";
import { CacheProvider } from "@emotion/react";
import { Backdrop, CircularProgress } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { ThirdwebProvider } from "thirdweb/react";

// Client-side cache, shared for the whole session of the user in the browser.

interface MyAppProps extends AppProps<PageProps> {
  emotionCache?: EmotionCache;
}
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props: MyAppProps) {
  const { pageProps, Component, emotionCache = clientSideEmotionCache } = props;

  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const { appConfig, appNFT, siteId, site, appPage, appLocaleMessages } =
    pageProps;

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

  React.useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setLoading(true);
    });

    router.events.on("routeChangeComplete", () => {
      setLoading(false);
    });
    router.events.on("routeChangeError", () => {
      setLoading(false);
    });

    return () => {
      router.events.off("routeChangeStart", () => {
        setLoading(false);
      });
      router.events.off("routeChangeComplete", () => {
        setLoading(false);
      });
      router.events.off("routeChangeError", () => {
        setLoading(false);
      });
    };
  }, [router]);

  const getLayout = (Component as any).getLayout || ((page: any) => page);

  const theme = setupTheme({ appConfig, getTheme });

  const SEO = setupSEO({ appConfig, appPage });

  const config = appConfig || (defaultAppConfig as any);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href={"/favicon.ico"} />

        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="theme-color"
          content={theme?.colorSchemes?.light?.palette?.primary?.main}
        />
      </Head>
      <CacheProvider value={emotionCache}>
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
                              theme?.colorSchemes?.light?.palette?.primary
                                ?.main,
                            zIndex: theme.zIndex.drawer + 1,
                          }}
                        >
                          <CircularProgress color="inherit" size={80} />
                        </Backdrop>
                        {getLayout(<Component {...pageProps} />)}
                      </AppMarketplaceProvider>
                    </LocalizationProvider>
                  </Hydrate>
                </QueryClientProvider>
              </ThirdwebProvider>
            </AppUIConfigContext.Provider>
          </SiteProvider>
        </AuthStateProvider>
      </CacheProvider>
      {/*<DexAppBuilderRender appProps={props} />*/}
    </>
  );
}
