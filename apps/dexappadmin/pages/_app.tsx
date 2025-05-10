import { CacheProvider, EmotionCache } from "@emotion/react";
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AppProps } from "next/app";
import Head from "next/head";
import * as React from "react";

import theme from "src/theme";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { useRouter } from "next/router";

import { Backdrop, CircularProgress } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
const clientSideEmotionCache = createEmotionCache();

import type { AssetAPI } from "@dexkit/ui/modules/nft/types";
import type { AppConfig } from "@dexkit/ui/modules/wizard/types/config";
import { AuthStateProvider } from "@dexkit/ui/providers/authStateProvider";

import { useLocale } from "@dexkit/ui/hooks/useLocale";
import { useState } from "react";
import { IntlProvider } from "react-intl";
import createEmotionCache from "src/createEmotionCache";
import { ThirdwebProvider } from "thirdweb/react";
// Client-side cache, shared for the whole session of the user in the browser.

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
  const { locale, onChangeLocale } = useLocale();

  const [messages, setMessages] = useState<any | null>(appLocaleMessages);

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

  const getLayout = (Component as any).getLayout || ((page: any) => page);

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

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <link rel="shortcut icon" href={"/favicon.ico"} />

        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="theme-color"
          content={theme?.colorSchemes?.light?.palette?.primary?.main}
        />
      </Head>
      <AuthStateProvider>
        <ThirdwebProvider>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <IntlProvider
                  locale={locale}
                  defaultLocale={locale}
                  messages={{}}
                >
                  <Backdrop
                    open={loading}
                    sx={{
                      color: theme?.colorSchemes?.light?.palette?.primary?.main,
                      zIndex: theme.zIndex.drawer + 1,
                    }}
                  >
                    <CircularProgress color="inherit" size={80} />
                  </Backdrop>

                  {getLayout(<Component {...pageProps} />)}
                </IntlProvider>
              </LocalizationProvider>
            </Hydrate>
          </QueryClientProvider>
        </ThirdwebProvider>
      </AuthStateProvider>
    </CacheProvider>
  );
}
