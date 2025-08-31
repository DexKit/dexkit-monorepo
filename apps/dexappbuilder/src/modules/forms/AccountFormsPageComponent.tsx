import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Box, Container, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';


export default function AccountFormsPageComponent() {
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
                  id="my.forms"
                  defaultMessage="My Forms"
                />
              ),
              uri: '/forms/account',
              active: true,
            },
          ]}
        />
        <Box>
          <Typography variant="h5">
            <FormattedMessage
              id="my.forms"
              defaultMessage="My Forms"
            />
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" color="text.secondary">
            <FormattedMessage
              id="account.forms.description"
              defaultMessage="Manage your created forms and templates"
            />
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
