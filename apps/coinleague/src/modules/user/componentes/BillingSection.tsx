import AddCreditsButton from '@dexkit/ui/components/AddCreditsButton';
import {
  useActiveFeatUsage,
  usePlanCheckoutMutation,
  usePlanPrices,
} from '@dexkit/ui/hooks/payments';
import {
  Alert,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Decimal from 'decimal.js';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import Link from '@dexkit/ui/components/AppLink';
import { useBillingHistoryQuery, useSubscription } from '../hooks/payments';
import CreditSection from './CreditSection';
import PlanDetailsDialog from './dialogs/PlanDetailsDialog';

export default function BillingSection() {
  const billingHistoryQuery = useBillingHistoryQuery();

  const { mutateAsync: checkoutPlan, isLoading } = usePlanCheckoutMutation();

  const subscriptionQuery = useSubscription();
  const activeFeatUsageQuery = useActiveFeatUsage();

  const handleCheckout = (plan: string) => {
    return async () => {
      const result = await checkoutPlan({ plan });

      if (result && result?.url) {
        window.open(result.url, '_blank');
      }

      if (plan === 'free') {
        await subscriptionQuery.refetch();
        await activeFeatUsageQuery.refetch();
      }
    };
  };

  const [planSlug, setPlanSlug] = useState<string>();
  const [open, setOpen] = useState(false);

  const handleViewDetails = (plan: string) => {
    return async () => {
      setPlanSlug(plan);
      setOpen(true);
    };
  };

  const handleClose = () => {
    setOpen(false);
    setPlanSlug(undefined);
  };

  const planPricesQuery = usePlanPrices();

  const credits = useMemo(() => {
    if (activeFeatUsageQuery.data && subscriptionQuery.data) {
      return new Decimal(activeFeatUsageQuery.data?.available)
        .minus(new Decimal(activeFeatUsageQuery.data?.used))
        .add(
          new Decimal(subscriptionQuery.data?.creditsAvailable).minus(
            new Decimal(subscriptionQuery.data?.creditsUsed),
          ),
        )
        .toNumber();
    }

    return 0;
  }, [activeFeatUsageQuery.data, subscriptionQuery.data]);

  return (
    <>
      <PlanDetailsDialog
        DialogProps={{
          open,
          onClose: handleClose,
          maxWidth: 'sm',
          fullWidth: true,
        }}
        slug={planSlug}
      />
      <Stack spacing={2}>
        {credits <= 0.5 && (
          <Alert severity="warning">
            <FormattedMessage
              id="credits.below0.50"
              defaultMessage="Your credits are now below $0.50. Please consider adding more credits to continue using our services."
            />
          </Alert>
        )}
        <Card>
          <CardContent>
            {/* {subscriptionQuery.isSuccess && !subscriptionQuery.data && (
              <Grid container spacing={2}>
                {planPricesQuery.data?.map((pp, key) => (
                  <Grid item xs={12} sm={4} key={key}>
                    <PlanCard
                      disabled={isLoading}
                      name={pp.name}
                      price={new Decimal(pp.amount).toNumber() / 100}
                      description="Better to start"
                      onClick={handleCheckout(pp.slug)}
                      onViewDetails={handleViewDetails(pp.slug)}
                    />
                  </Grid>
                ))}
              </Grid>
            )} */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="credits" defaultMessage="Credits" />
                </Typography>
                <Typography variant="body1">
                  {activeFeatUsageQuery.data && subscriptionQuery.data ? (
                    <FormattedNumber
                      style="currency"
                      currencyDisplay="narrowSymbol"
                      currency="USD"
                      value={credits}
                      minimumFractionDigits={4}
                    />
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <AddCreditsButton />
              </Grid>
              {/* <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="plan" defaultMessage="Plan" />
                </Typography>
                <Typography variant="body1">
                  {subscriptionQuery.data ? (
                    subscriptionQuery.data.planName
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="status" defaultMessage="Status" />
                </Typography>
                <Typography variant="body1">
                  {subscriptionQuery.data ? (
                    subscriptionQuery.data.status
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
              </Grid> */}
              {/* <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="start" defaultMessage="Start" />
                </Typography>
                <Typography variant="body1">
                  {moment(subscriptionQuery.data?.period_start).format(
                    'DD/MM/YYYY HH:mm:ss',
                  )}{' '}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="end" defaultMessage="End" />
                </Typography>
                <Typography variant="body1">
                  {moment(subscriptionQuery.data?.period_end).format(
                    'DD/MM/YYYY HH:mm:ss',
                  )}
                </Typography>
              </Grid> */}
            </Grid>
          </CardContent>
        </Card>
        <Typography variant="subtitle1">
          <FormattedMessage id="usage.periods" defaultMessage="Usage periods" />
        </Typography>
        <Card>
          {billingHistoryQuery.data && billingHistoryQuery.data.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormattedMessage id="start" defaultMessage="Start" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="end" defaultMessage="End" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="total" defaultMessage="Total" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="actions" defaultMessage="Actions" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billingHistoryQuery.data?.map((period: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      {moment(period.periodStart).format('DD/MM/YYYY')}
                    </TableCell>

                    <TableCell>
                      {moment(period.periodEnd).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                      <Typography>
                        <FormattedNumber
                          value={new Decimal(period.used).toNumber()}
                          style="currency"
                          currencyDisplay="narrowSymbol"
                          currency="USD"
                          minimumFractionDigits={4}
                        />
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Link
                        variant="body1"
                        href={`/u/settings/billing/${period.id}`}
                      >
                        <FormattedMessage id="view" defaultMessage="View" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CardContent sx={{ py: 2 }}>
              <Typography align="center" variant="h5">
                <FormattedMessage id="no.usage" defaultMessage="No usage" />
              </Typography>
              <Typography align="center" variant="body1" color="text.secondary">
                <FormattedMessage
                  id="you.still.dont.have.any.records"
                  defaultMessage="You still don't have any records."
                />
              </Typography>
            </CardContent>
          )}
        </Card>
        <CreditSection />
      </Stack>
    </>
  );
}
