import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Paper, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function EditCheckoutPageComponent() {
  return (
    <Stack spacing={2}>
      <PageHeader
        breadcrumbs={[
          {
            caption: (
              <FormattedMessage id="commerce" defaultMessage="Commerce" />
            ),
            uri: '/u/account/commerce',
          },
          {
            caption: (
              <FormattedMessage id="checkouts" defaultMessage="Checkouts" />
            ),
            uri: '/u/account/commerce/checkouts',
          },
          {
            caption: (
              <FormattedMessage id="edit.checkout" defaultMessage="Edit Checkout" />
            ),
            uri: '/u/account/commerce/checkout/edit',
            active: true,
          },
        ]}
      />
      <Typography variant="h6">
        <FormattedMessage id="edit.checkout" defaultMessage="Edit Checkout" />
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          <FormattedMessage id="loading.checkout.edit" defaultMessage="Loading checkout edit form..." />
        </Typography>
      </Paper>
    </Stack>
  );
}
