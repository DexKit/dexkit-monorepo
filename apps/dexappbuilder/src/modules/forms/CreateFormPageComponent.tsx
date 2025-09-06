import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Stack, TextField, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function CreateFormPageComponent() {
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
                <FormattedMessage id="create" defaultMessage="Create" />
              ),
              uri: '/forms/create',
              active: true,
            },
          ]}
        />
        <Box>
          <Typography variant="h5">
            <FormattedMessage
              id="create.form"
              defaultMessage="Create Form"
            />
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" color="text.secondary">
            <FormattedMessage
              id="create.form.description"
              defaultMessage="Create a new form to interact with smart contracts"
            />
          </Typography>
        </Box>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Form Name"
            placeholder="Enter form name"
          />
          <FormControl fullWidth>
            <FormLabel>
              Description
            </FormLabel>
            <TextField
              multiline
              rows={4}
              placeholder="Enter form description"
            />
            <FormHelperText>
              <FormattedMessage
                id="description.helper"
                defaultMessage="Describe what this form will do"
              />
            </FormHelperText>
          </FormControl>
          <Button variant="contained" color="primary">
            <FormattedMessage id="create.form" defaultMessage="Create Form" />
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
