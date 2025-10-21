import AddCreditsButton from "@dexkit/ui/components/AddCreditsButton";
import {
  usePlanCheckoutMutation,
  useSubscription,
} from "@dexkit/ui/hooks/payments";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Decimal from "decimal.js";
import { useEffect, useMemo } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";

interface Props {
  isWidget?: boolean;
  alertWarningMessage: React.ReactNode;
  isHidePowered?: boolean;
}

export function AddCredits({
  isHidePowered,
  isWidget,
  alertWarningMessage,
}: Props) {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Credits Section */}
      <Box>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage id="credits" defaultMessage="Credits" />
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
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
          <Box>
            <AddCreditsButton />
          </Box>
        </Stack>
      </Box>
      
      {/* Warning Alert */}
      {alertWarningMessage && (
        <Box>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            {alertWarningMessage}
          </Alert>
        </Box>
      )}
    </Box>
  );
}
