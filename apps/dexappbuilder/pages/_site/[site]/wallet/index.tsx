import { Box, Container, Grid } from '@mui/material';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';

import { FormattedMessage, useIntl } from 'react-intl';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { NextSeo } from 'next-seo';

import { SectionsRenderer } from '@dexkit/dexappbuilder-viewer/components/SectionsRenderer';
import { AppConfig, PageSectionsLayout } from '@dexkit/ui/modules/wizard/types/config';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import AuthMainLayout from 'src/components/layouts/authMain';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import { getAppConfig } from '../../../../src/services/app';

const WalletPage: NextPage<{
  sections: AppPageSection[];
  layout?: PageSectionsLayout;
  appConfig: AppConfig;
}> = ({ sections, layout }: {
  sections: AppPageSection[];
  layout?: PageSectionsLayout;
  appConfig: AppConfig;
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'my.wallet',
          defaultMessage: 'My Wallet',
        })}
      />
      <Box>
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
                      <FormattedMessage id="wallet" defaultMessage="Wallet" />
                    ),
                    uri: '/wallet',
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
      </Box>
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

    const configResponse = await getAppConfig(site, 'wallet');
    const { appConfig } = configResponse;

    const page = appConfig.pages['wallet'] || {};
    const sections = (page as any)?.sections || [
      {
        type: 'wallet',
        title: 'Wallet',
      },
    ];

    return {
      props: {
        page: 'wallet',
        layout: (page as any)?.layout || null,
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

(WalletPage as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout disableAutoLogin noSsr>
      {page}
    </AuthMainLayout>
  );
};

export default WalletPage;
