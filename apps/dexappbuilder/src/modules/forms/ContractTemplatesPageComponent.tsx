import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Box, Container, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { Button, Paper } from '@mui/material';

export default function ContractTemplatesPageComponent() {
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
                <FormattedMessage id="forms" defaultMessage="Forms" />
              ),
              uri: '/forms',
            },
            {
              caption: (
                <FormattedMessage
                  id="contract.templates"
                  defaultMessage="Contract Templates"
                />
              ),
              uri: '/forms/contract-templates',
              active: true,
            },
          ]}
        />
        <Box>
          <Typography variant="h5">
            <FormattedMessage
              id="contract.templates"
              defaultMessage="Contract Templates"
            />
          </Typography>
        </Box>
        <Box>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography variant="h6">
                <FormattedMessage
                  id="no.templates"
                  defaultMessage="No Contract Templates"
                />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage
                  id="no.templates.description"
                  defaultMessage="No contract templates have been created yet."
                />
              </Typography>
              <Button variant="contained" color="primary">
                <FormattedMessage id="create.template" defaultMessage="Create Template" />
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
}
