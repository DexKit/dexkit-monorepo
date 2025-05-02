import { EmotionCache } from "@emotion/react";
import { DehydratedState } from "@tanstack/react-query";
import { AppProps } from "next/app";
import Head from "next/head";

import theme from "src/theme";

import type {} from "@mui/material/themeCssVarsAugmentation";
const clientSideEmotionCache = createEmotionCache();

import type { AssetAPI } from "@dexkit/ui/modules/nft/types";
import type { AppConfig } from "@dexkit/ui/modules/wizard/types/config";

import createEmotionCache from "src/createEmotionCache";

import { DexAppBuilderRender } from "@dexkit/dexappbuilder-render";
// Client-side cache, shared for the whole session of the user in the browser.

interface MyAppProps extends AppProps<{ dehydratedState: DehydratedState }> {
  emotionCache?: EmotionCache;
}

interface PageProps {
  appConfig: AppConfig;
  appNFT: AssetAPI;
  siteId: number | undefined;
  dehydratedState: DehydratedState;
  site?: string;
  appPage?: string;
  loading?: boolean;
  appLocaleMessages?: Record<string, string> | null;
}

export default function MyApp(props: MyAppProps) {
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
      <DexAppBuilderRender appProps={props} />
    </>
  );
}
