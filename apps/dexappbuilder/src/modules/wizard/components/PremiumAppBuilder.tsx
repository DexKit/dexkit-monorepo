import AddCreditsButton from '@dexkit/ui/components/AddCreditsButton';
import {
  useActiveFeatUsage,
  usePlanCheckoutMutation,
  useSubscription,
} from '@dexkit/ui/hooks/payments';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Decimal from 'decimal.js';
import { useEffect, useMemo } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

export function PremiumAppBuilder() {
  const subscriptionQuery = useSubscription();
  const activeFeatUsageQuery = useActiveFeatUsage();
  const { mutateAsync: checkoutPlan, isLoading } = usePlanCheckoutMutation();
  // we check if user has plan, if not subscribe. This should if done once
  useEffect(() => {
    async function subscribePlan() {
      if (!subscriptionQuery.data) {
        await checkoutPlan({ plan: 'free' });
        await subscriptionQuery.refetch();
      }
    }
    subscribePlan();
  }, [subscriptionQuery.data]);

  const credits = useMemo(() => {
    if (activeFeatUsageQuery.data && subscriptionQuery.data) {
      return new Decimal(activeFeatUsageQuery.data?.available)
        .minus(new Decimal(activeFeatUsageQuery.data?.used))
        .add(
          new Decimal(subscriptionQuery.data?.creditsAvailable).minus(
            new Decimal(subscriptionQuery.data?.creditsUsed)
          )
        )
        .toNumber();
    }

    return 0;
  }, [activeFeatUsageQuery.data, subscriptionQuery.data]);

  return (
    <>
      {' '}
      <Grid item xs={12}>
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
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {credits < 50 && (
          <AddCreditsButton
            buttonText={
              <FormattedMessage
                id="pay.custom.domain.feature"
                defaultMessage="Add 50 USD credits to pay feature"
              />
            }
          />
        )}

        {credits >= 50 && (
          <Button variant={'contained'}>
            <FormattedMessage
              id="unlock.custom.domain.feature"
              defaultMessage="Unlock custom domain feature"
            />
          </Button>
        )}
      </Grid>
      <Grid item xs={12}>
        <Typography>
          Feature Paid for this month. Make sure to have 50 usd credits for next
          month
        </Typography>
      </Grid>
    </>
  );
}
