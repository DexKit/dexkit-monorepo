import Link from '@dexkit/ui/components/AppLink';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import Add from '@mui/icons-material/Add';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function FormsManagePageComponent() {
  return (
    <Container maxWidth={'xl'}>
      <Stack spacing={2}>
        <PageHeader
          breadcrumbs={[
            {
              caption: <FormattedMessage id="home" defaultMessage="Home" />,
              uri: '/',
            },
            {
              caption: (
                <FormattedMessage
                  id="dexcontracts"
                  defaultMessage="DexContracts"
                />
              ),
              uri: '/forms',
            },
            {
              caption: (
                <FormattedMessage
                  id="manage.contract.forms"
                  defaultMessage="Manage Contract Forms"
                />
              ),
              uri: `/forms/manage`,
              active: true,
            },
          ]}
        />
        <Box>
          <Typography variant="h5">
            <FormattedMessage
              id="my.contract.forms"
              defaultMessage="My Contract Forms"
            />
          </Typography>
        </Box>
        <Box>
          <Button
            LinkComponent={Link}
            href="/forms/create"
            size="small"
            variant="contained"
            startIcon={<Add />}
          >
            <FormattedMessage
              id="create.contract.form"
              defaultMessage="New Contract Form"
            />
          </Button>
        </Box>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            <FormattedMessage id="loading.forms" defaultMessage="Loading forms..." />
          </Typography>
        </Paper>
      </Stack>
    </Container>
  );
}
