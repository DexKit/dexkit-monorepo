import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function ViewFormPageComponent() {
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
                  id="view.form"
                  defaultMessage="View Form"
                />
              ),
              uri: '/forms/view',
              active: true,
            },
          ]}
        />
        <Box>
          <Typography variant="h5">
            <FormattedMessage
              id="view.form"
              defaultMessage="View Form"
            />
          </Typography>
        </Box>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography variant="body1" color="text.secondary">
              <FormattedMessage
                id="form.view.description"
                defaultMessage="This form is currently being viewed. You can interact with it below."
              />
            </Typography>
            <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                <FormattedMessage
                  id="form.content.placeholder"
                  defaultMessage="Form content will be displayed here"
                />
              </Typography>
            </Box>
            <Button variant="contained" color="primary">
              <FormattedMessage id="submit.form" defaultMessage="Submit Form" />
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
