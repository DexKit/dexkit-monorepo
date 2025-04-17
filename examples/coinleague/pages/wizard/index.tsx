import AppPageHeader from '@/modules/common/components/AppPageHeader';
import MainLayout from '@/modules/common/components/layouts/MainLayout';
import Link from '@/modules/common/components/Link';
import { Add } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import { FormattedMessage } from 'react-intl';

const WizardIndexPage: NextPage = () => {
  return (
    <MainLayout>
      <Stack spacing={2}>
        <AppPageHeader
          breadcrumbs={[
            {
              caption: <FormattedMessage id="home" defaultMessage="Home" />,
              uri: '/',
            },
            {
              caption: <FormattedMessage id="wizard" defaultMessage="Wizard" />,
              uri: '/wizard',
            },
          ]}
        />
      </Stack>
      <Box>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <Stack
                    sx={{ p: 2 }}
                    justifyContent="space-between"
                    alignItems="center"
                    alignContent="center"
                    direction="row"
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        <FormattedMessage
                          id="my.collections"
                          defaultMessage="My Collections"
                        />
                      </Typography>
                      <Typography color="textSecondary" variant="subtitle2">
                        <FormattedMessage
                          id="create.and.manage.your.collections"
                          defaultMessage="Create and manage your collections"
                        />
                      </Typography>
                    </Box>
                    <IconButton
                      LinkComponent={Link}
                      href="/wizard/collections/create"
                      color="primary"
                    >
                      <Add />
                    </IconButton>
                  </Stack>
                  <Divider />
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <Stack
                    sx={{ p: 2 }}
                    justifyContent="space-between"
                    alignItems="center"
                    alignContent="center"
                    direction="row"
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        <FormattedMessage
                          id="my.tokens"
                          defaultMessage="My Tokens"
                        />
                      </Typography>
                      <Typography color="textSecondary" variant="subtitle2">
                        <FormattedMessage
                          id="create.and.manage.your.tokens"
                          defaultMessage="Create and manage your tokens"
                        />
                      </Typography>
                    </Box>
                    <IconButton
                      LinkComponent={Link}
                      href="/wizard/tokens/create"
                      color="primary"
                    >
                      <Add />
                    </IconButton>
                  </Stack>
                  <Divider />
                  <CardContent></CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default WizardIndexPage;
