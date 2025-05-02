import { EmotionCache } from "@emotion/react";
import { AppProps } from "next/app";
import Head from "next/head";

import type {} from "@mui/material/themeCssVarsAugmentation";

import {
  DexAppBuilderRender,
  PageProps,
  getTheme,
} from "@dexkit/dexappbuilder-render";
import { setupTheme } from "@dexkit/ui/services/app";
// Client-side cache, shared for the whole session of the user in the browser.

interface MyAppProps extends AppProps<PageProps> {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { pageProps } = props;

  const { appConfig } = pageProps;

  const theme = setupTheme({ appConfig, getTheme });

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
