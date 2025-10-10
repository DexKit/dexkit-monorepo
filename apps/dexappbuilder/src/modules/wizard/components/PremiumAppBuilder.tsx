import { AppConfirmDialog, useEditSiteId } from '@dexkit/ui';
import AddCreditsButton from '@dexkit/ui/components/AddCreditsButton';
import {
  CUSTOM_DOMAINS_AND_SIGNATURE_FEAT,
  CUSTOM_DOMAINS_PRICE,
  WIDGET_SIGNATURE_FEAT,
} from '@dexkit/ui/constants/featPayments';
import {
  useActivatePremiumMutation,
  useActiveFeatUsage,
  useDisablePremiumMutation,
  usePlanCheckoutMutation,
  useSubscription,
} from '@dexkit/ui/hooks/payments';
import { Alert, CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import Decimal from 'decimal.js';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { QUERY_ADMIN_WHITELABEL_CONFIG_NAME } from 'src/hooks/whitelabel';

interface Props {
  isWidget?: boolean;
  isHidePowered?: boolean;
}

export function PremiumAppBuilder({ isHidePowered, isWidget }: Props) {
  const subscriptionQuery = useSubscription();
  const queryClient = useQueryClient();
  const snackBar = useSnackbar();
  const { formatMessage } = useIntl();
  const { editSiteId } = useEditSiteId();
  const activeFeatUsageQuery = useActiveFeatUsage({
    slug: isWidget ? WIDGET_SIGNATURE_FEAT : CUSTOM_DOMAINS_AND_SIGNATURE_FEAT,
  });
  const { mutateAsync: checkoutPlan } = usePlanCheckoutMutation();
  const premiumActivateMutation = useActivatePremiumMutation({ isWidget });
  const disablePremiumMutation = useDisablePremiumMutation({ isWidget });
  const [openConfirmDisable, setOpenConfirmDisable] = useState(false);

  // we check if user has plan, if not subscribe. This should if done once
  useEffect(() => {
    async function subscribePlan() {
      if (!subscriptionQuery.data) {
        try {
          await checkoutPlan({ plan: 'free' });
          await subscriptionQuery.refetch();
        } catch {}
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

  const handleUnlockDomainFeature = async () => {
    try {
      await premiumActivateMutation.mutateAsync({
        siteId: editSiteId,
      });
      snackBar.enqueueSnackbar(
        formatMessage({
          id: 'feature.unlocked',
          defaultMessage: 'Feature unlocked',
        }),
        { variant: 'success' },
      );
      await activeFeatUsageQuery.refetch();
      await subscriptionQuery.refetch();
    } catch (e) {
      snackBar.enqueueSnackbar(
        formatMessage(
          {
            id: 'error.unlocking.feature.try.again.error.msg',
            defaultMessage:
              'Error unlocking feature. try again! Error: {errorMsg}',
          },
          { errorMsg: (e as Error)?.message },
        ),
        { variant: 'error' },
      );
    }
  };

  const handleDisableFeature = async () => {
    setOpenConfirmDisable(false);
    try {
      await disablePremiumMutation.mutateAsync({
        siteId: editSiteId,
      });
      snackBar.enqueueSnackbar(
        formatMessage({
          id: 'feature.disabled',
          defaultMessage: 'Feature disabled',
        }),
        { variant: 'success' },
      );
      await activeFeatUsageQuery.refetch();
      await subscriptionQuery.refetch();
      queryClient.invalidateQueries({
        queryKey: [QUERY_ADMIN_WHITELABEL_CONFIG_NAME],
      });
    } catch (e) {
      snackBar.enqueueSnackbar(
        formatMessage(
          {
            id: 'error.disabling.feature.try.again.error.msg',
            defaultMessage:
              'Error disabling feature. try again! Error: {errorMsg}',
          },
          { errorMsg: (e as Error)?.message },
        ),
        { variant: 'error' },
      );
    }
  };

  return (
    <>
      <AppConfirmDialog
        DialogProps={{
          open: openConfirmDisable,
          onClose: () => setOpenConfirmDisable(false),
        }}
        onConfirm={handleDisableFeature}
      >
        <FormattedMessage
          id="do.you.really.want.to.disable.this.feature"
          defaultMessage="Do you really want to disable this feature?"
        />
      </AppConfirmDialog>
      <Grid size={12}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid>
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
          <Grid>
            <AddCreditsButton />
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2} size={12}>
        <Grid>
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
        {!isPaid && (
          <Grid>
            <Button
              variant={'contained'}
              startIcon={
                premiumActivateMutation.isLoading && <CircularProgress />
              }
              disabled={
                credits < CUSTOM_DOMAINS_PRICE ||
                premiumActivateMutation.isLoading ||
                activeFeatUsageQuery.isLoading
              }
              onClick={handleUnlockDomainFeature}
              size="small"
            >
              {isHidePowered ? (
                <FormattedMessage
                  id="unlock.powered.by.feature"
                  defaultMessage="Unlock powered by feature"
                />
              ) : (
                <FormattedMessage
                  id="unlock.custom.domain.feature"
                  defaultMessage="Unlock custom domain feature"
                />
              )}
            </Button>
          </Grid>
        )}
        {!isPaid && (
          <Grid size={12}>
            <Alert severity="warning">
              <FormattedMessage
                id={`premium.feature.warning.message${isWidget && 'widget'}`}
                defaultMessage={`This is a premium feature please enable it to start using it. Enabling a {feature} costs {price} usd monthly, please make sure you have always credits to not disrupt the service.${isWidget && ' Note: You pay this value for all widgets you use not per widget.'}`}
                values={{
                  price: CUSTOM_DOMAINS_PRICE,
                  feature: isHidePowered ? 'powered by' : 'custom domain',
                }}
              />
            </Alert>
          </Grid>
        )}
      </Grid>
      {isPaid && (
        <Grid size={12}>
          <Grid>
            <Typography variant="subtitle1">
              <FormattedMessage
                id="premium.feature.is.paid.message"
                defaultMessage="Feature paid for this month. Make sure to have {price} usd credits for
            next month."
                values={{ price: CUSTOM_DOMAINS_PRICE }}
              />
            </Typography>
          </Grid>
          <Grid>
            <Button
              variant={'contained'}
              color="error"
              startIcon={
                disablePremiumMutation.isLoading && <CircularProgress />
              }
              disabled={
                disablePremiumMutation.isLoading ||
                activeFeatUsageQuery.isLoading
              }
              onClick={() => setOpenConfirmDisable(true)}
              size="small"
            >
              <FormattedMessage id="disable" defaultMessage="Disable" />
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
}
