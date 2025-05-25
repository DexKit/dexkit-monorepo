import { Button, CircularProgress, Divider, Grid, Stack } from "@mui/material";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import { useSnackbar } from "notistack";
import { FormattedMessage } from "react-intl";
import { toFormikValidationSchema } from "zod-formik-adapter";

import useCheckoutSettings from "../../../hooks/useCheckoutSettings";
import useUpdateCheckoutSettings from "../../../hooks/useUpdateCheckoutSettings";
import { CheckoutSettingsSchema } from "../../../schemas";
import { CheckoutSettingsType } from "../../../types";
import useParams from "../hooks/useParams";

interface CheckoutGeneralSettingsFormBaseProps {
  settings: {
    notificationEmail: string;
    receiverAddress: string;
  };
}

function CheckoutGeneralSettingsFormBase({
  settings,
}: CheckoutGeneralSettingsFormBaseProps) {
  const { mutateAsync: update } = useUpdateCheckoutSettings();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (value: CheckoutSettingsType) => {
    try {
      await update(value);

      enqueueSnackbar(
        <FormattedMessage
          id="general.settings.updated"
          defaultMessage="General settings updated"
        />,
        { variant: "success" }
      );
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  const { goBack } = useParams();

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        receiverAccount: settings.receiverAddress,
        receiverEmail: settings.notificationEmail,
      }}
      validationSchema={toFormikValidationSchema(CheckoutSettingsSchema)}
    >
      {({ submitForm, isValid, isSubmitting }) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="receiverAccount"
                  fullWidth
                  label={
                    <FormattedMessage
                      id="recipient.wallet.address"
                      defaultMessage="Recipient wallet address"
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="receiverEmail"
                  fullWidth
                  label={
                    <FormattedMessage
                      id="recipient.email"
                      defaultMessage="Recipient e-mail"
                    />
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <div>
              <Stack spacing={2} justifyContent="flex-end" direction="row">
                <Button
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress color="inherit" size="1rem" />
                    ) : undefined
                  }
                  disabled={!isValid || isSubmitting}
                  variant="contained"
                  onClick={submitForm}
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
              </Stack>
            </div>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}

export default function CheckoutGeneralSettingsForm() {
  const { data: settings, isFetchedAfterMount } = useCheckoutSettings();

  return (
    settings &&
    isFetchedAfterMount && (
      <CheckoutGeneralSettingsFormBase settings={settings} />
    )
  );
}
