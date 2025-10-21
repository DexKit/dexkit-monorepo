import AddCreditsButton from '@dexkit/ui/components/AddCreditsButton';
import { useIsMobile } from '@dexkit/ui/hooks/misc';
import {
  usePlanCheckoutMutation,
  usePlanPrices,
} from '@dexkit/ui/hooks/payments';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import Decimal from 'decimal.js';
import { useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import { useBillingHistoryQuery, useSubscription } from '../hooks/payments';
import CreditSection from './CreditSection';
import PlanDetailsDialog from './dialogs/PlanDetailsDialog';
import BillingDataGrid from './tables/BillingDataGrid';

export default function BillingSection() {
  const billingHistoryQuery = useBillingHistoryQuery({});
  const isMobile = useIsMobile();

  const { mutateAsync: checkoutPlan, isLoading } = usePlanCheckoutMutation();

  const subscriptionQuery = useSubscription();

  const handleCheckout = (plan: string) => {
    return async () => {
      const result = await checkoutPlan({ plan });

      if (result && result?.url) {
        window.open(result.url, '_blank');
      }

      if (plan === 'free') {
        await subscriptionQuery.refetch();
        //  await activeFeatUsageQuery.refetch();
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
    if (subscriptionQuery.data) {
      return new Decimal(subscriptionQuery.data?.creditsAvailable)
        .minus(new Decimal(subscriptionQuery.data?.creditsUsed))
        .toNumber();
    }

    return 0;
  }, [subscriptionQuery.data]);

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
      <Stack spacing={isMobile ? 1.5 : 2}>
        {credits <= 0.5 && (
          <Alert severity="warning" sx={{
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            '& .MuiAlert-message': {
              lineHeight: isMobile ? 1.3 : 1.4
            }
          }}>
            <FormattedMessage
              id="credits.below0.50"
              defaultMessage="Your credits are now below $0.50. Please consider adding more credits to continue using our services."
            />
          </Alert>
        )}
        <Card sx={{
          '& .MuiCardContent-root': {
            padding: isMobile ? 1.5 : 2
          }
        }}>
          <CardContent>
            {/* {subscriptionQuery.isSuccess && !subscriptionQuery.data && (
              <Grid container spacing={2}>
                {planPricesQuery.data?.map((pp, key) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={key}>
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
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              width: '100%',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 2 : 0
            }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage id="credits" defaultMessage="Credits" />
                </Typography>
                <Typography variant="body1" sx={{
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  fontWeight: 500
                }}>
                  {subscriptionQuery.data ? (
                    <FormattedNumber
                      style="currency"
                      currencyDisplay="narrowSymbol"
                      currency="USD"
                      value={credits}
                      minimumFractionDigits={isMobile ? 2 : 4}
                    />
                  ) : (
                    <Skeleton />
                  )}
                </Typography>
              </Box>
              <Box sx={{
                width: isMobile ? '100%' : 'auto',
                '& button': {
                  width: isMobile ? '100%' : 'auto'
                }
              }}>
                <AddCreditsButton />
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Typography variant="h6" sx={{
          mb: 2,
          fontSize: isMobile ? '1.1rem' : '1.25rem'
        }}>
          <FormattedMessage id="usage.periods" defaultMessage="Usage periods" />
        </Typography>
        <Card sx={{
          overflow: 'hidden',
          '& .MuiCardContent-root': {
            padding: isMobile ? 1 : 2
          }
        }}>
          <BillingDataGrid />
        </Card>
        <CreditSection />
      </Stack>
    </>
  );
}
