import { Button, CircularProgress, Divider, Grid, Stack } from "@mui/material";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import { useSnackbar } from "notistack";
import { FormattedMessage } from "react-intl";
import { toFormikValidationSchema } from "zod-formik-adapter";

import useCheckoutWebhookSettings from "../../../hooks/useCheckoutWebhookSettings";
import useUpdateCheckoutWebhookSettings from "../../../hooks/useUpdateCheckoutWebhookSettings";
import { CheckoutWebhookSettingsSchema } from "../../../schemas";
import { CheckoutWebhookSettingsType } from "../../../types";
import useParams from "../hooks/useParams";

interface CheckoutWebhookSettingsFormBaseProps {
  settings: {
    webhookUrl: string | null;
    webhookSecret: string | null;
  };
}

function CheckoutWebhookSettingsFormBase({
  settings,
}: CheckoutWebhookSettingsFormBaseProps) {
  const { mutateAsync: update } = useUpdateCheckoutWebhookSettings();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (value: CheckoutWebhookSettingsType) => {
    try {
      await update(value);

      enqueueSnackbar(
        <FormattedMessage
          id="webhook.settings.updated"
          defaultMessage="Webhook settings updated"
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
        webhookSecret: settings?.webhookSecret,
        webhookUrl: settings?.webhookUrl,
      }}
      validationSchema={toFormikValidationSchema(CheckoutWebhookSettingsSchema)}
    >
      {({ submitForm, isValid, isSubmitting }) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="webhookSecret"
                  fullWidth
                  label={
                    <FormattedMessage
                      id="webhook.secret"
                      defaultMessage="Webhook secret"
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="webhookUrl"
                  fullWidth
                  label={
                    <FormattedMessage
                      id="webhook.url"
                      defaultMessage="Webhook URL"
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

export default function CheckoutWebhookSettingsForm() {
  const { data: settings, isFetchedAfterMount } = useCheckoutWebhookSettings();
  console.log(settings);
  return (
    settings &&
    isFetchedAfterMount && (
      <CheckoutWebhookSettingsFormBase settings={settings} />
    )
  );
}
