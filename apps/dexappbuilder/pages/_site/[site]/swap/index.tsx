import SwapSection from '@dexkit/dexappbuilder-viewer/components/sections/SwapSection';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { SwapPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { NoSsr } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import { useAppConfig } from 'src/hooks/app';
import { getAppConfig } from 'src/services/app';

const SwapPage: NextPage = () => {
  const { formatMessage } = useIntl();
  const appConfig = useAppConfig();
  const swapSection = useMemo(() => {
    const swapSectionPageIndex = appConfig.pages['home']?.sections.findIndex(
      (s) => s.type === 'swap'
    );
    if (swapSectionPageIndex !== -1) {
      return (
        (appConfig.pages['home']?.sections[
          swapSectionPageIndex
        ] as SwapPageSection) ||
        ({
          type: 'swap',
        } as SwapPageSection)
      );
    }
    return {
      type: 'swap',
    } as SwapPageSection;
  }, [appConfig]);

  return (
    <>
      <NextSeo title={formatMessage({ id: 'swap', defaultMessage: 'Swap' })} />
      <MainLayout>
        <Container>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="home" defaultMessage="Home" />
                    ),
                    uri: '/',
                  },
                  {
                    caption: (
                      <FormattedMessage id="swap" defaultMessage="Swap" />
                    ),
                    uri: '/swap',
                    active: true,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NoSsr>
                <SwapSection section={swapSection} />
              </NoSsr>
            </Grid>
          </Grid>
        </Container>
      </MainLayout>
    </>
  );
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const configResponse = await getAppConfig(params?.site, 'home');

  return {
    props: {
      ...configResponse,
    },
    revalidate: REVALIDATE_PAGE_TIME,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default SwapPage;
