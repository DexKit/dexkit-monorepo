import React from "react";

import defaultAppConfig from "@dexkit/ui/config/app.json";
import { AppConfigContext as AppUIConfigContext } from "@dexkit/ui/context/AppConfigContext";
import type { AssetAPI } from "@dexkit/ui/modules/nft/types";
import { GatedPageLayout } from "@dexkit/ui/modules/wizard/types";
import {
  AppConfig,
  GatedCondition,
  PageSectionsLayout,
} from "@dexkit/ui/modules/wizard/types/config";
import { AppPageSection } from "@dexkit/ui/modules/wizard/types/section";
import SiteProvider from "@dexkit/ui/providers/SiteProvider";
import { AuthStateProvider } from "@dexkit/ui/providers/authStateProvider";
import { setupSEO, setupTheme } from "@dexkit/ui/services/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { Backdrop, CircularProgress } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ThirdwebProvider } from "thirdweb/react";
import { AppMarketplaceProvider } from "../src/components/AppMarketplaceProvider";
import createEmotionCache from "./createEmotionCache";

import { RenderDexAppBuilderWidget } from "@dexkit/dexappbuilder-viewer";
import ProtectedContent from "@dexkit/dexappbuilder-viewer/components/ProtectedContent";
import { SectionsRenderer } from "@dexkit/dexappbuilder-viewer/components/SectionsRenderer";
import { getTheme } from "@dexkit/dexappbuilder-viewer/themes/theme";
import AuthMainLayout from "@dexkit/ui/components/layouts/authMain";
import MainLayout from "@dexkit/ui/components/layouts/main";
import { SessionProvider } from "next-auth/react";

export { getTheme, RenderDexAppBuilderWidget };

export interface PageProps {
  appConfig: AppConfig;
  appNFT: AssetAPI;
  siteId: number | undefined;
  dehydratedState: DehydratedState;
  site?: string;
  appPage?: string;
  appLocaleMessages?: Record<string, string> | null;
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps<PageProps> {
  emotionCache?: EmotionCache;
}

export function DexAppBuilderRender({ appProps }: { appProps: MyAppProps }) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  } = appProps;

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
                          color: theme?.palette?.primary?.main,
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
  );
}

export interface CustomPageProps {
  sections: AppPageSection[];
  account?: string;
  isProtected: boolean;
  conditions?: GatedCondition[];
  gatedLayout?: GatedPageLayout;
  layout?: PageSectionsLayout;
  result: boolean;
  site: string;
  page: string;
  partialResults: { [key: number]: boolean };
  balances: { [key: number]: string };
  slug?: string;
}

export function RenderCustomPage({
  sections,
  isProtected,
  conditions,
  site,
  page,
  gatedLayout,
  slug,
  layout,
}: CustomPageProps) {
  if (isProtected) {
    return (
      <SessionProvider>
        <AuthMainLayout>
          <ProtectedContent
            site={site}
            page={page}
            isProtected={isProtected}
            conditions={conditions}
            layout={gatedLayout}
            slug={slug}
            pageLayout={layout}
          />
        </AuthMainLayout>
      </SessionProvider>
    );
  }

  return (
    <MainLayout disablePadding>
      <SectionsRenderer sections={sections} layout={layout} />
    </MainLayout>
  );
}

export { AppMarketplaceProvider, createEmotionCache };
