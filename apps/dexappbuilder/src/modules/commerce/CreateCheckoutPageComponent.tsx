import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

export default function CreateCheckoutPageComponent() {
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
              <FormattedMessage
                id="checkouts"
                defaultMessage="Checkouts"
              />
            ),
            uri: '/u/account/commerce/checkouts',
          },
          {
            caption: (
              <FormattedMessage id="create" defaultMessage="Create" />
            ),
            uri: '/u/account/commerce/checkout/create',
            active: true,
          },
        ]}
      />
      <Alert
        severity="info"
        action={
          <Button
            LinkComponent={Link}
            href="/u/account/commerce/settings"
            variant="outlined"
            color="inherit"
          >
            <FormattedMessage
              id="settings"
              defaultMessage="Settings"
            />
          </Button>
        }
      >
        <FormattedMessage
          id="checkout.create.description"
          defaultMessage="Create a new checkout for your customers"
        />
      </Alert>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          <FormattedMessage id="loading.checkout.form" defaultMessage="Loading checkout form..." />
        </Typography>
      </Paper>
    </Stack>
  );
}
