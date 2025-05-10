import { EmotionCache } from '@emotion/react';
import { Analytics } from '@vercel/analytics/react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import type {} from '@mui/material/themeCssVarsAugmentation';

import defaultAppConfig from '../config/app.json';

import './customCss.css';

import { setupTheme } from '@dexkit/ui/services/app';

import {
  DexAppBuilderRender,
  PageProps,
  getTheme,
} from '@dexkit/dexappbuilder-render';

interface MyAppProps extends AppProps<PageProps> {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { pageProps } = props;

  const { appConfig } = pageProps;

  const theme = setupTheme({ appConfig, getTheme });

  const config = appConfig || defaultAppConfig;
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
          content={theme?.colorSchemes?.light?.palette?.primary?.main}
        />
      </Head>
      <DexAppBuilderRender appProps={props} />
      <Analytics />
    </>
  );
}
