import AddCreditsButton from "@dexkit/ui/components/AddCreditsButton";
import { ECOMMERCE_PRICE } from "@dexkit/ui/constants/featPayments";
import {
  usePlanCheckoutMutation,
  useSubscription,
} from "@dexkit/ui/hooks/payments";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Decimal from "decimal.js";
import { useEffect, useMemo } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";

export function EcommerceCredits() {
  const subscriptionQuery = useSubscription();

  const { mutateAsync: checkoutPlan } = usePlanCheckoutMutation();

  // we check if user has plan, if not subscribe. This should if done once
  useEffect(() => {
    async function subscribePlan() {
      if (!subscriptionQuery.data) {
        try {
          await checkoutPlan({ plan: "free" });
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

  return (
    <Stack spacing={2}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
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
        </Box>
        <AddCreditsButton />
      </Box>

      <Alert severity="warning">
        <FormattedMessage
          id="ecommerce.price.per.order"
          defaultMessage="To process each order make sure you have at least {price} usd credits per order"
          values={{ price: ECOMMERCE_PRICE }}
        />
      </Alert>
    </Stack>
  );
}
