import AddCreditsButton from '@dexkit/ui/components/AddCreditsButton';
import {
  CUSTOM_DOMAINS_AND_SIGNATURE_FEAT_FREE_PLAN_SLUG,
  CUSTOM_DOMAINS_PRICE,
} from '@dexkit/ui/constants/featPayments';
import {
  useActiveFeatUsage,
  usePlanCheckoutMutation,
  useSubscription,
} from '@dexkit/ui/hooks/payments';
import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Decimal from 'decimal.js';
import { useEffect, useMemo } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

export function PremiumAppBuilder() {
  const subscriptionQuery = useSubscription();
  const activeFeatUsageQuery = useActiveFeatUsage({
    slug: CUSTOM_DOMAINS_AND_SIGNATURE_FEAT_FREE_PLAN_SLUG,
  });
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
    if (subscriptionQuery.data) {
      return new Decimal(subscriptionQuery.data?.creditsAvailable)
        .minus(new Decimal(subscriptionQuery.data?.creditsUsed))
        .toNumber();
    }

    return 0;
  }, [subscriptionQuery.data]);

  const isPaid = activeFeatUsageQuery.data
    ? activeFeatUsageQuery?.data?.active
    : undefined;

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
              {subscriptionQuery.data ? (
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
      <Grid item xs={12} container spacing={2}>
        <Grid item>
          {credits < CUSTOM_DOMAINS_PRICE && (
            <AddCreditsButton
              buttonText={
                <FormattedMessage
                  id="pay.custom.domain.feature.for.this.month"
                  defaultMessage="Add {price} USD credits to pay feature for this month"
                  values={{ price: CUSTOM_DOMAINS_PRICE }}
                />
              }
            />
          )}
        </Grid>
        <Grid item>
          <Button
            variant={'contained'}
            disabled={credits < CUSTOM_DOMAINS_PRICE}
            size="small"
          >
            <FormattedMessage
              id="unlock.custom.domain.feature"
              defaultMessage="Unlock custom domain feature"
            />
          </Button>
        </Grid>
      </Grid>
      {!isPaid && (
        <Grid item xs={12}>
          <Alert severity="warning">
            <FormattedMessage
              id="premium.feature.warning.message"
              defaultMessage="This is a premium feature please enable it to start using it. Enabling a custom domain costs {price} usd monthly, please make sure you have always credits to not disrupt the service."
              values={{ price: CUSTOM_DOMAINS_PRICE }}
            />
          </Alert>
        </Grid>
      )}
      {isPaid && (
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            <FormattedMessage
              id="premium.feature.is.paid.message"
              defaultMessage="Feature Paid for this month. Make sure to have {price} usd credits for
            next month"
            />
          </Typography>
        </Grid>
      )}
    </>
  );
}
