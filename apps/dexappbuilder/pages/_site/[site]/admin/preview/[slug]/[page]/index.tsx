import { useRouter } from 'next/router';

import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';

import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { useEffect, useMemo } from 'react';
import { useAdminWhitelabelConfigQuery } from 'src/hooks/whitelabel';
import { getAppConfig } from 'src/services/app';

import { Box, CssBaseline, ThemeProvider, useTheme } from '@mui/material';
import Head from 'next/head';
import PreviewAuthLayout from 'src/components/layouts/PreviewAuthLayout';
import { getTheme } from 'src/theme';

function PreviewPage() {
  const router = useRouter();
  const theme = useTheme();

  const { slug, page, index, platform, themeMode } = router.query;

  const { data } = useAdminWhitelabelConfigQuery({ slug: slug as string });

  const appConfig = useMemo(() => {
    if ((data as any)?.config) {
      return JSON.parse((data as any).config) as AppConfig;
    }
  }, [data]);

  const [sections, layout] = useMemo(() => {
    const sectionIndex = index !== undefined ? parseInt(index as string) : -1;

    if (sectionIndex >= 0) {
      let result = appConfig?.pages[page as string]?.sections[sectionIndex];

      return [
        appConfig && result ? [result] : [],
        appConfig?.pages[page as string]?.layout,
      ];
    }
    return [
      appConfig ? appConfig.pages[page as string]?.sections ?? [] : [],
      appConfig?.pages[page as string]?.layout,
    ];
  }, [appConfig, page, index]);

  const disableLayoutFlag = false;

  const isMobileView = platform === 'mobile';
  const isDesktopView = platform === 'desktop';
  const isDarkMode = themeMode === 'dark';

  const currentTheme = useMemo(() => {
    if (!appConfig) {
      return theme;
    }

    const themeName = appConfig?.theme || 'default-theme';
    const baseTheme = getTheme({ name: themeName });

    if (baseTheme && baseTheme.theme) {
      const colorScheme = isDarkMode ? 'dark' : 'light';
      const themeWithCorrectMode = {
        ...baseTheme.theme,
        colorSchemes: {
          ...baseTheme.theme.colorSchemes,
          [colorScheme]: {
            ...baseTheme.theme.colorSchemes[colorScheme],
            palette: {
              ...baseTheme.theme.colorSchemes[colorScheme].palette,
              mode: isDarkMode ? 'dark' : 'light',
              text: {
                ...baseTheme.theme.colorSchemes[colorScheme].palette.text,
                primary: isDarkMode ? '#ffffff' : baseTheme.theme.colorSchemes[colorScheme].palette.text?.primary,
                secondary: isDarkMode ? '#dddddd' : baseTheme.theme.colorSchemes[colorScheme].palette.text?.secondary,
              },
              background: {
                ...baseTheme.theme.colorSchemes[colorScheme].palette.background,
                default: isDarkMode ? '#121212' : baseTheme.theme.colorSchemes[colorScheme].palette.background?.default,
                paper: isDarkMode ? '#1e1e1e' : baseTheme.theme.colorSchemes[colorScheme].palette.background?.paper,
              }
            }
          }
        }
      };
      return themeWithCorrectMode;
    }

    return theme;
  }, [isDarkMode, appConfig, theme]);

  useEffect(() => {
    if (isMobileView) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
    } else if (isDesktopView) {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.documentElement.style.height = 'auto';
      document.body.style.height = 'auto';
    }

    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.style.colorScheme = 'dark';
      document.documentElement.style.color = '#ffffff';
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.style.colorScheme = 'light';
      document.documentElement.style.color = '#121212';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.classList.remove('dark-mode');
      document.documentElement.style.colorScheme = '';
      document.documentElement.style.color = '';
    };
  }, [isMobileView, isDesktopView, isDarkMode]);

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Head>
        {isMobileView && (
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        )}
        {isDesktopView && (
          <meta name="viewport" content="width=1200, initial-scale=0.65, user-scalable=yes" />
        )}
        <style>{`
          body {
            background-color: ${isDarkMode ? '#121212' : '#ffffff'};
            color: ${isDarkMode ? '#ffffff' : '#121212'};
          }
          
          .MuiPaper-root {
            color: ${isDarkMode ? '#ffffff' : 'inherit'};
          }
          
          .MuiToolbar-root {
            color: ${isDarkMode ? '#ffffff' : 'inherit'};
          }
          
          .MuiAppBar-root {
            color: ${isDarkMode ? '#ffffff' : 'inherit'};
          }
          
          .preview-title {
            color: ${isDarkMode ? '#ffffff' : '#121212'};
          }
          
          .preview-footer {
            color: ${isDarkMode ? '#ffffff' : '#121212'};
          }
          
          /* Estilos para botones CTA */
          .MuiButton-containedPrimary {
            background-color: ${currentTheme?.colorSchemes?.light?.palette?.primary?.main || '#17CB95'};
            color: #ffffff;
          }
          
          .MuiButton-outlinedPrimary {
            border-color: ${currentTheme?.colorSchemes?.light?.palette?.primary?.main || '#17CB95'};
            color: ${currentTheme?.colorSchemes?.light?.palette?.primary?.main || '#17CB95'};
          }
          
          /* Ajustes para textos en footer */
          .MuiTypography-root a {
            color: ${isDarkMode ? '#dddddd' : 'inherit'};
          }
        `}</style>
      </Head>
      <Box
        sx={{
          width: isDesktopView ? '100%' : (isMobileView ? '100vw' : 'auto'),
          height: isMobileView ? '100vh' : 'auto',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <PreviewAuthLayout
          noSsr
          disableLayout={disableLayoutFlag}
          appConfig={appConfig}
          isPreview={true}
        >
          <SectionsRenderer sections={sections} layout={layout} />
        </PreviewAuthLayout>
      </Box>
    </ThemeProvider>
  );
}

type Params = {
  site?: string;
  page?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();
  const configResponse = await getAppConfig(params?.site, 'no-page-defined');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths<
  Params
> = ({ }: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default PreviewPage;
