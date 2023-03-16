import { SwapWidget } from '@dexkit/widgets';
import { NoSsr } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { FormattedMessage, useIntl } from 'react-intl';
import MainLayout from 'src/components/layouts/main';
import { PageHeader } from 'src/components/PageHeader';
import { useSwapState } from 'src/hooks/swap';
import { getAppConfig } from 'src/services/app';

const WidgetComponent = () => {
  const swapState = useSwapState();

  return <SwapWidget {...swapState} />;
};

const SwapV2Page: NextPage = () => {
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
            <Grid item xs={12} sm={6}>
              <NoSsr>
                <WidgetComponent />
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
  const appConfig = await getAppConfig(params?.site);

  return {
    props: { appConfig },
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default SwapV2Page;
