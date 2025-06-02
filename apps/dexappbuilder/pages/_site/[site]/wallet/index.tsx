import { Box, Container, Grid } from '@mui/material';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';

import { FormattedMessage, useIntl } from 'react-intl';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { NextSeo } from 'next-seo';

import EvmWalletContainer from '@dexkit/ui/modules/wallet/components/containers/EvmWalletContainer';
import { REVALIDATE_PAGE_TIME } from 'src/constants';

import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from '../../../../src/services/app';

const WalletPage: NextPage = () => {
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
              <EvmWalletContainer />
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

    const configResponse = await getAppConfig(site, 'home');

    return {
      props: { ...configResponse },
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
