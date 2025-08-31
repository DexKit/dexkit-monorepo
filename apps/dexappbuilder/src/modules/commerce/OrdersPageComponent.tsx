export const dynamic = 'force-dynamic';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function OrdersPageComponent() {
  return (
    <Container>
      <Stack spacing={2}>
        <PageHeader
          breadcrumbs={[
            {
              caption: <FormattedMessage id="home" defaultMessage="Home" />,
              uri: '/',
            },
            {
              caption: (
                <FormattedMessage id="commerce" defaultMessage="Commerce" />
              ),
              uri: '/u/account/commerce',
            },
            {
              caption: (
                <FormattedMessage id="orders" defaultMessage="Orders" />
              ),
              uri: '/u/account/commerce/orders',
              active: true,
            },
          ]}
        />
        <Box>
          <Typography variant="h5">
            <FormattedMessage id="orders" defaultMessage="Orders" />
          </Typography>
        </Box>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            <FormattedMessage id="loading.orders" defaultMessage="Loading orders..." />
          </Typography>
        </Paper>
      </Stack>
    </Container>
  );
}
