import { Container, Grid } from '@mui/material';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { FormattedMessage, useIntl } from 'react-intl';
import MainLayout from '../../../../src/components/layouts/main';

import CreateAssetOrderContainer from '@/modules/nft/components/container/CreateAssetOrderContainer';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { NextSeo } from 'next-seo';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import { getAppConfig } from '../../../../src/services/app';

export const OrdersIndex: NextPage = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      <NextSeo
        title={formatMessage({
          id: 'create.order',
          defaultMessage: 'Create Order',
        })}
      />
      <Container>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12}>
            <PageHeader
              breadcrumbs={[
                {
                  caption: <FormattedMessage id="home" defaultMessage="Home" />,
                  uri: '/',
                },
                {
                  caption: (
                    <FormattedMessage
                      id="create.order"
                      defaultMessage="Create Order"
                    />
                  ),
                  uri: '/order/create',
                  active: true,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <CreateAssetOrderContainer />
          </Grid>
        </Grid>
      </Container>
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
    props: { ...configResponse },
    revalidate: REVALIDATE_PAGE_TIME,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

(OrdersIndex as any).getLayout = function getLayout(page: any) {
  return <MainLayout noSsr>{page}</MainLayout>;
};

export default OrdersIndex;
