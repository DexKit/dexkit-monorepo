import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Paper, Stack, TextField, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function EditFormPageComponent() {
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
                  id="edit.form"
                  defaultMessage="Edit Form"
                />
              ),
              uri: '/forms/edit',
              active: true,
            },
          ]}
        />
        <Box>
          <Typography variant="h5">
            <FormattedMessage
              id="edit.form"
              defaultMessage="Edit Form"
            />
          </Typography>
        </Box>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Form Name"
              placeholder="Enter form name"
            />
            <FormControl fullWidth>
              <FormLabel>Description</FormLabel>
              <TextField
                multiline
                rows={4}
                placeholder="Enter form description"
              />
              <FormHelperText>
                Describe what this form will do
              </FormHelperText>
            </FormControl>
            <TextField
              fullWidth
              label="Form Configuration"
              placeholder="Enter form configuration"
              multiline
              rows={6}
            />
            <Button variant="contained" color="primary">
              Save Form
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
