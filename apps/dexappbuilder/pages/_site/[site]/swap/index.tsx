import { SectionsRenderer } from '@dexkit/dexappbuilder-viewer/components/SectionsRenderer';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { AppConfig, PageSectionsLayout } from '@dexkit/ui/modules/wizard/types/config';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { FormattedMessage, useIntl } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import { getAppConfig } from 'src/services/app';

const SwapPage: NextPage<{
  sections: AppPageSection[];
  layout?: PageSectionsLayout;
  appConfig: AppConfig;
}> = ({ sections, layout }) => {
  const { formatMessage } = useIntl();


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
            <Grid item xs={12}>
              <SectionsRenderer sections={sections} layout={layout} />
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
  if (params !== undefined) {
    const { site } = params;

    const configResponse = await getAppConfig(site, 'swap');
    const { appConfig } = configResponse;

    const page = appConfig.pages['swap'] || {};
    const sections = page?.sections || [
      {
        type: 'swap',
        title: 'Swap',
      },
    ];

    return {
      props: {
        page: 'swap',
        layout: page?.layout || null,
        sections: sections,
        site: params?.site,
        ...configResponse,
      },
      revalidate: REVALIDATE_PAGE_TIME,
    };
  }
  return {
    props: {},
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
