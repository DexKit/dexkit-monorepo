import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainLayout from '../../../src/components/layouts/main';
import { getAppConfig } from '../../../src/services/app';

interface UnderConstructionPageProps {
  appConfig: AppConfig;
  appLocaleMessages: Record<string, string>;
  siteId: string;
  site: string;
}

const UnderConstructionPage: NextPage<UnderConstructionPageProps> = ({
  appConfig,
}) => {
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (!appConfig.underConstruction && router.asPath === '/under-construction') {
      router.replace('/', undefined, { shallow: true });
    }
  }, [appConfig.underConstruction, router.asPath]);

  if (!appConfig.underConstruction) {
    return null;
  }

  return (
    <MainLayout disablePadding>
      <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            py: 8,
          }}
        >
          {/* Logo */}
          {appConfig.logo?.url && (
            <Box sx={{ mb: 4 }}>
              <img
                src={appConfig.logo.url}
                alt={appConfig.name || 'App Logo'}
                style={{
                  width: appConfig.logo.width || 120,
                  height: appConfig.logo.height || 120,
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}

          {/* Title */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            {appConfig.name || 'Our App'}
          </Typography>

          {/* Under Construction Badge */}
          <Box
            sx={{
              px: 3,
              py: 1,
              mb: 4,
              backgroundColor: theme.palette.warning.main,
              color: theme.palette.warning.contrastText,
              borderRadius: 2,
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            <FormattedMessage
              id="under.construction"
              defaultMessage="Under Construction"
            />
          </Box>

          {/* Message */}
          <Typography
            variant="h6"
            component="p"
            sx={{
              mb: 4,
              color: theme.palette.text.secondary,
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            <FormattedMessage
              id="under.construction.message"
              defaultMessage="We're working hard to bring you something amazing. Please check back soon!"
            />
          </Typography>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.reload()}
              sx={{ px: 4, py: 1.5 }}
            >
              <FormattedMessage
                id="refresh.page"
                defaultMessage="Refresh Page"
              />
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                router.push('/');
              }}
              sx={{ px: 4, py: 1.5 }}
            >
              <FormattedMessage
                id="try.again"
                defaultMessage="Try Again"
              />
            </Button>
          </Stack>

          {/* Footer Info */}
          <Box sx={{ mt: 6, opacity: 0.7 }}>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage
                id="under.construction.footer"
                defaultMessage="This page is displayed because the app is currently in under construction mode."
              />
            </Typography>
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  let site = params?.site as string;

  if (site && site.includes(':') && site.startsWith('dexkit.app:')) {
    site = site.split(':')[1];
  }

  if (!site) {
    return {
      notFound: true,
    };
  }

  try {
    const configResponse = await getAppConfig(site);

    const cleanProps = {
      appConfig: configResponse.appConfig,
      appLocaleMessages: configResponse.appLocaleMessages || {},
      siteId: configResponse.siteId || null,
      slug: configResponse.slug || null,
      appNFT: configResponse.appNFT || null,
      site,
    };

    return {
      props: cleanProps,
      revalidate: 300,
    };
  } catch (error) {
    console.error('Error fetching app config:', error);

    return {
      props: {
        appConfig: {
          underConstruction: true,
          name: 'App',
        } as AppConfig,
        appLocaleMessages: {},
        siteId: null,
        slug: null,
        appNFT: null,
        site,
      },
      revalidate: 300,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default UnderConstructionPage;
