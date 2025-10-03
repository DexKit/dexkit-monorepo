import {
  Alert,
  AlertTitle,
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { EcommerceCredits } from "../EcommerceCredits";
import DashboardLayout from "../layouts/DashboardLayout";
import CheckoutGeneralSettingsForm from "./forms/CheckoutGeneralSettingsForm";
import CheckoutNetworksUpdateForm from "./forms/CheckoutNetworksUpdateForm";

export default function SettingsContainer() {
  return (
    <DashboardLayout page="settings">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            <FormattedMessage id="settings" defaultMessage="Settings" />
          </Typography>
          <Typography color="text.secondary" variant="body1">
            <FormattedMessage
              id="adjust.your.e.commerce.settings"
              defaultMessage="Adjust your e-commerce settings."
            />
          </Typography>
        </Box>

        <Box>
          <EcommerceCredits />
        </Box>

        <Divider />

        <Box sx={{ maxWidth: '600px' }}>
          <Stack spacing={2}>
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
            
            <CheckoutGeneralSettingsForm />
          </Stack>
        </Box>

        <Box>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="body1"
                fontWeight="bold"
                color="text.secondary"
                sx={{ mb: 1 }}
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
            
            <CheckoutNetworksUpdateForm />
          </Stack>
        </Box>
      </Stack>
    </DashboardLayout>
  );
}
