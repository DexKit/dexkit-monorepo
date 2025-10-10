import { AppDialogTitle } from "@dexkit/ui";
import FormikDecimalInput from "@dexkit/ui/components/FormikDecimalInput";
import {
  useBuyCreditsCheckout,
  useCryptoCheckout,
  useSubscription,
} from "@dexkit/ui/hooks/payments";
import HistoryIcon from "@mui/icons-material/History";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import Decimal from "decimal.js";
import { Field, Formik, FormikHelpers } from "formik";
import { Select } from "formik-mui";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import { useIsBalanceVisible } from "../../modules/wallet/hooks";
import { isBalancesVisibleAtom } from "../../modules/wallet/state";

export interface AddCreditDialogProps {
  DialogProps: DialogProps;
  initialAmount?: string;
}

export default function AddCreditDialog({
  DialogProps,
  initialAmount,
}: AddCreditDialogProps) {
  const { onClose } = DialogProps;
  const { enqueueSnackbar } = useSnackbar();

  const buyCreditsCheckout = useBuyCreditsCheckout();

  const cryptoCheckout = useCryptoCheckout();

  const handleClose = async () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }

    cryptoCheckout.reset();
    buyCreditsCheckout.reset();
  };

  const handleSubmit = async (
    {
      amount,
      paymentMethod,
    }: {
      amount: string;
      paymentMethod: string;
    },
    helpers: FormikHelpers<{
      amount: string;
      paymentMethod: string;
    }>
  ) => {
    try {
      if (paymentMethod === "crypto") {
        const result = await cryptoCheckout.mutateAsync({
          amount,
          intent: "credit-grant",
        });

        if (result?.id) {
          window.open(`/checkout/${result.id}`);
          helpers.resetForm();
        } else {
          enqueueSnackbar(
            formatMessage({
              id: "error.creating.checkout",
              defaultMessage: "Error creating checkout session. Please try again.",
            }),
            { variant: "error" }
          );
        }
      } else {
        const result = await buyCreditsCheckout.mutateAsync({
          amount: parseFloat(amount),
        });

        if (result?.url) {
          window.open(result.url, "_blank");
          helpers.resetForm();
        } else {
          enqueueSnackbar(
            formatMessage({
              id: "error.creating.payment",
              defaultMessage: "Error creating payment session. Please try again.",
            }),
            { variant: "error" }
          );
        }
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      
      let errorMessage = formatMessage({
        id: "payment.error.generic",
        defaultMessage: "An error occurred while processing your payment. Please try again.",
      });

      if (error?.response?.status === 500) {
        errorMessage = formatMessage({
          id: "payment.error.server",
          defaultMessage: "Server error. Please try again later or contact support if the problem persists.",
        });
      } else if (error?.response?.status === 400) {
        errorMessage = formatMessage({
          id: "payment.error.invalid",
          defaultMessage: "Invalid payment request. Please check your amount and try again.",
        });
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const { formatMessage } = useIntl();

  const handleValitate = ({ amount }: any) => {
    const value = new Decimal(amount || "0");

    if (value.lessThan(5)) {
      return {
        amount: formatMessage({
          defaultMessage: "the minimum is 5",
          id: "the.minimum.is.five",
        }),
      };
    }

    if (value.greaterThan(600)) {
      return {
        amount: formatMessage({
          defaultMessage: "the maximum is 600",
          id: "the.maximum.is.600",
        }),
      };
    }
  };

  const subscriptionQuery = useSubscription();

  const isVisible = useIsBalanceVisible();

  const [isBalancesVisible, setIsBalancesVisible] = useAtom(
    isBalancesVisibleAtom
  );

  const handleToggleVisibility = () => {
    setIsBalancesVisible((value: boolean) => !value);
  };

  const credits = useMemo(() => {
    if (subscriptionQuery.data) {
      return new Decimal(subscriptionQuery.data?.creditsAvailable).minus(
        new Decimal(subscriptionQuery.data?.creditsUsed)
      );
    }

    return 0;
  }, [subscriptionQuery.data]);

  const renderContent = () => {
    if (cryptoCheckout.data || buyCreditsCheckout.data) {
      return (
        <Stack alignItems="center" justifyContent="center" spacing={2}>
          <HistoryIcon fontSize="large" color="primary" />
          <Box>
            <Typography align="center" variant="h5">
              <FormattedMessage
                id="waiting.payment"
                defaultMessage="Waiting payment"
              />
            </Typography>
            <Typography align="center" variant="body1" color="text.secondary">
              <FormattedMessage
                id="payment.confirmation.message"
                defaultMessage="Please wait for 10 confirmations for payment recognition."
              />
            </Typography>
          </Box>
        </Stack>
      );
    }

    return (
      <Stack spacing={2}>
        <Stack>
          <Typography variant="body2">
            <FormattedMessage id="balance" defaultMessage="Balance" />
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="h5">
              {isVisible ? (
                <FormattedNumber
                  value={Number(credits.toString())}
                  style="currency"
                  currency="USD"
                />
              ) : (
                `****.**`
              )}
            </Typography>
            <IconButton onClick={handleToggleVisibility}>
              {isBalancesVisible ? (
                <Visibility fontSize="small" />
              ) : (
                <VisibilityOff fontSize="small" />
              )}
            </IconButton>
          </Stack>
        </Stack>
        <FormikDecimalInput
          TextFieldProps={{
            label: <FormattedMessage id="amount" defaultMessage="Amount" />,
          }}
          name="amount"
          decimals={2}
        />
        <Field
          component={Select}
          name="paymentMethod"
          fullWidth
          label={
            <FormattedMessage
              id="payment.method"
              defaultMessage="Payment method"
            />
          }
        >
          <MenuItem value="crypto">
            <FormattedMessage
              id="cryptocurrency"
              defaultMessage="Cryptocurrency"
            />
          </MenuItem>
          {/* <MenuItem disabled value="card">
            <FormattedMessage
              id="credit.card.soming.soon"
              defaultMessage="Credit Card (Coming Soon)"
            />
          </MenuItem>*/}
        </Field>
      </Stack>
    );
  };

  return (
    <Dialog {...DialogProps}>
      <Formik
        initialValues={{
          amount: initialAmount || "50",
          paymentMethod: "crypto",
        }}
        onSubmit={handleSubmit}
        validate={handleValitate}
      >
        {({ submitForm, isValid, isSubmitting }: any) => (
          <>
            <AppDialogTitle
              onClose={handleClose}
              title={
                <FormattedMessage id="add.credit" defaultMessage="Add Credit" />
              }
            />
            <DialogContent dividers>{renderContent()}</DialogContent>
            {!buyCreditsCheckout.data && !cryptoCheckout.data && (
              <DialogActions>
                <Button
                  variant="contained"
                  disabled={isSubmitting || !isValid}
                  onClick={submitForm}
                >
                  <FormattedMessage id="add" defaultMessage="Add" />
                </Button>
                <Button onClick={handleClose} disabled={isSubmitting}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
              </DialogActions>
            )}
          </>
        )}
      </Formik>
    </Dialog>
  );
}
