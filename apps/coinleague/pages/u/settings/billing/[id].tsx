import SettingsLayout from '@/modules/user/componentes/SettingsLayout';
import { DexkitApiProvider } from '@dexkit/core/providers';
import {
  Card,
  CardContent,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { useRouter } from 'next/router';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';
import { myAppsApi } from 'src/services/whitelabel';

import FeatUsageSummary from '@/modules/user/componentes/FeatUsageSummary';
import { useBillingQuery } from '@/modules/user/hooks/payments';
import Link from '@dexkit/ui/components/AppLink';
import Decimal from 'decimal.js';
import moment from 'moment';
import { FormattedMessage, FormattedNumber } from 'react-intl';

export default function BillingDetail() {
  const router = useRouter();
  const { id } = router.query;

  const billingQuery = useBillingQuery({ id: parseInt(id as string) });

  return (
    <Container>
      <SettingsLayout
        tab="billing"
        title={
          billingQuery.data ? (
            moment(billingQuery.data.periodStart).format('MM/YYYY')
          ) : (
            <Skeleton />
          )
        }
        uri={`/u/settings/billing/${id as string}`}
      >
        {(tab) => (
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item>
                    <Typography variant="caption" color="text.secondary">
                      <FormattedMessage
                        id="ref.period"
                        defaultMessage="Ref. period"
                      />
                    </Typography>
                    <Typography variant="body1">
                      {billingQuery.data ? (
                        <Link
                          href={`/u/settings/billing/${billingQuery.data.id}`}
                        >
                          {moment(billingQuery.data.periodStart).format(
                            'MM/YYYY',
                          )}
                        </Link>
                      ) : (
                        <Skeleton />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" color="text.secondary">
                      <FormattedMessage id="credits" defaultMessage="Credits" />
                    </Typography>
                    <Typography variant="body1">
                      {billingQuery.data ? (
                        <FormattedNumber
                          style="currency"
                          currencyDisplay="narrowSymbol"
                          currency="USD"
                          value={new Decimal(billingQuery.data?.available)
                            .minus(new Decimal(billingQuery.data?.used))
                            .toNumber()}
                          minimumFractionDigits={4}
                        />
                      ) : (
                        <Skeleton />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" color="text.secondary">
                      <FormattedMessage id="start" defaultMessage="Start" />
                    </Typography>
                    <Typography variant="body1">
                      {moment(billingQuery.data?.periodStart).format(
                        'DD/MM/YYYY HH:mm:ss',
                      )}{' '}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" color="text.secondary">
                      <FormattedMessage id="end" defaultMessage="End" />
                    </Typography>
                    <Typography variant="body1">
                      {moment(billingQuery.data?.periodEnd).format(
                        'DD/MM/YYYY HH:mm:ss',
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <FeatUsageSummary id={parseInt(id as string)} />
            </Card>
          </Stack>
        )}
      </SettingsLayout>
    </Container>
  );
}

(BillingDetail as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout noSsr>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {page}
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};

type Params = {
  site?: string;
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
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
