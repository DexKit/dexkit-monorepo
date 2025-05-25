import CheckoutGeneralSettingsForm from '@/modules/commerce/components/CheckoutGeneralSettingsForm';
import CheckoutNetworksUpdateForm from '@/modules/commerce/components/CheckoutNetworksUpdateForm';
import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import Info from '@mui/icons-material/InfoOutlined';
import {
  Alert,
  AlertTitle,
  Box,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function CommerceProductsPage() {
  return (
    <DashboardLayout page="settings">
      <Stack spacing={2}>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">
                <FormattedMessage
                  id="general.settings"
                  defaultMessage="General Settings"
                />
              </Typography>
              <Typography color="text.secondary" variant="body2">
                <FormattedMessage
                  id="recipient.information"
                  defaultMessage="Recipient information"
                />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="warning">
                <AlertTitle>
                  <FormattedMessage
                    id="alert.for.wallet.address"
                    defaultMessage="Alert for wallet address"
                  />
                </AlertTitle>
                <Typography>
                  <FormattedMessage
                    id="unique.address.alert"
                    defaultMessage="Please enter the unique address where you will receive payments for your sales. Ensure it is correct to avoid any loss of funds."
                  />
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <CheckoutGeneralSettingsForm />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body1" fontWeight="bold">
                    <FormattedMessage
                      id="payment.networks"
                      defaultMessage="Payment Networks"
                    />
                  </Typography>
                  <Tooltip
                    title={
                      <FormattedMessage
                        id="select.crypto.networks.tooltip"
                        defaultMessage="Select the crypto networks you want to accept for payments during checkout."
                      />
                    }
                  >
                    <Info color="primary" />
                  </Tooltip>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <CheckoutNetworksUpdateForm />
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </DashboardLayout>
  );
}
