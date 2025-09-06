import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Box, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function AccountHomePageComponent() {
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
                <FormattedMessage id="account" defaultMessage="Account" />
              ),
              uri: '/u/account',
              active: true,
            },
          ]}
        />
        <Box>
          <Typography variant="h5">
            <FormattedMessage id="account" defaultMessage="Account" />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <FormattedMessage 
              id="account.description" 
              defaultMessage="Manage your account settings and preferences" 
            />
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Typography variant="h6">
                  <FormattedMessage id="profile" defaultMessage="Profile" />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage 
                    id="profile.description" 
                    defaultMessage="Update your personal information" 
                  />
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Typography variant="h6">
                  <FormattedMessage id="settings" defaultMessage="Settings" />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage 
                    id="settings.description" 
                    defaultMessage="Configure your account preferences" 
                  />
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
