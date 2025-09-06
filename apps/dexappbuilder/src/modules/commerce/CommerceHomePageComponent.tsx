export const dynamic = 'force-dynamic';

import { Box, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { PageHeader } from '@dexkit/ui/components/PageHeader';

export default function CommerceHomePageComponent() {
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
              active: true,
            },
          ]}
        />
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Typography variant="h6">
                    <FormattedMessage id="total.orders" defaultMessage="Total Orders" />
                  </Typography>
                  <Typography variant="h4">
                    <FormattedMessage id="loading" defaultMessage="Loading..." />
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Typography variant="h6">
                    <FormattedMessage id="total.revenue" defaultMessage="Total Revenue" />
                  </Typography>
                  <Typography variant="h4">
                    <FormattedMessage id="loading" defaultMessage="Loading..." />
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
