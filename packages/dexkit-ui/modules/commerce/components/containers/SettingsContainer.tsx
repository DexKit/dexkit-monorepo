import {
  Alert,
  AlertTitle,
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { FormattedMessage } from "react-intl";
import { EcommerceCredits } from "../EcommerceCredits";
import DashboardLayout from "../layouts/DashboardLayout";
import CheckoutGeneralSettingsForm from "./forms/CheckoutGeneralSettingsForm";
import CheckoutNetworksUpdateForm from "./forms/CheckoutNetworksUpdateForm";
import CheckoutWebhookSettingsForm from "./forms/CheckoutWebhookSettingsForm";

export default function SettingsContainer() {
  return (
    <DashboardLayout page="settings">
      <Stack spacing={2}>
        <Box>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="h5">
                <FormattedMessage id="settings" defaultMessage="Settings" />
              </Typography>
              <Typography color="text.secondary" variant="body1">
                <FormattedMessage
                  id="adjust.your.e.commerce.settings"
                  defaultMessage="Adjust your e-commerce settings."
                />
              </Typography>
            </Grid>
            <Grid size={12}>
              <EcommerceCredits />
            </Grid>
            <Grid size={12}>
              <Divider />
            </Grid>
            <Grid size={6}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    fontWeight="bold"
                  >
                    <FormattedMessage
                      id="recipient.information"
                      defaultMessage="Recipient information"
                    />
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Alert severity="warning">
                    <AlertTitle sx={{ fontWeight: "bold" }}>
                      <FormattedMessage
                        id="alert.for.wallet.address"
                        defaultMessage="Alert for wallet address"
                      />
                    </AlertTitle>
                    <Typography>
                      <FormattedMessage
                        id="unique.address.alert"
                        defaultMessage="Please verify that the recipient wallet address is correct to avoid losing funds. This is where you will receive payments for your sales."
                      />
                    </Typography>
                  </Alert>
                </Grid>
                <Grid size={12}>
                  <CheckoutGeneralSettingsForm />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12}>
              <Box>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  <FormattedMessage
                    id="payment.networks"
                    defaultMessage="Payment Networks"
                  />
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  <FormattedMessage
                    id="payment.networks.subtext"
                    defaultMessage="Select the crypto networks you want to accept for payments during checkout."
                  />
                </Typography>
              </Box>
            </Grid>
            <Grid size={12}>
              <CheckoutNetworksUpdateForm />
            </Grid>
            <Grid size={12}>
              <Box>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  <FormattedMessage
                    id="webhook.settings"
                    defaultMessage="Webhook settings"
                  />
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  <FormattedMessage
                    id="webhook.settings.subtext"
                    defaultMessage="Configure your webhook settings for better integration."
                  />
                </Typography>
              </Box>
            </Grid>
            <Grid size={12}>
              <CheckoutWebhookSettingsForm />
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </DashboardLayout>
  );
}