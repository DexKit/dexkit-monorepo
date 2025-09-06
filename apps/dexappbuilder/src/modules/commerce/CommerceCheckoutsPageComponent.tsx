import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Button, Paper, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';
import { FormattedMessage } from 'react-intl';

export default function CommerceCheckoutsPageComponent() {
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
            active: true,
          },
        ]}
      />
      <Typography variant="h6">
        <FormattedMessage id="checkouts" defaultMessage="Checkouts" />
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button
          LinkComponent={NextLink}
          href="/u/account/commerce/checkouts/create"
          variant="contained"
        >
          <FormattedMessage id="create" defaultMessage="Create" />
        </Button>
      </Stack>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          <FormattedMessage id="loading.checkouts" defaultMessage="Loading checkouts..." />
        </Typography>
      </Paper>
    </Stack>
  );
}
