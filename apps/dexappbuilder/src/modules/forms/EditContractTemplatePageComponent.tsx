import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Paper, Stack, TextField, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function EditContractTemplatePageComponent() {
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
            },
            {
              caption: (
                <FormattedMessage
                  id="edit.template"
                  defaultMessage="Edit Template"
                />
              ),
              uri: '/forms/contract-templates/edit',
              active: true,
            },
          ]}
        />
        <Box>
          <Typography variant="h5">
            <FormattedMessage
              id="edit.contract.template"
              defaultMessage="Edit Contract Template"
            />
          </Typography>
        </Box>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Template Name"
              placeholder="Enter template name"
            />
            <FormControl fullWidth>
              <FormLabel>Description</FormLabel>
              <TextField
                multiline
                rows={4}
                placeholder="Enter template description"
              />
              <FormHelperText>
                Describe what this contract template will do
              </FormHelperText>
            </FormControl>
            <TextField
              fullWidth
              label="ABI (JSON)"
              placeholder="Enter contract ABI in JSON format"
              multiline
              rows={6}
            />
            <TextField
              fullWidth
              label="Bytecode"
              placeholder="Enter contract bytecode"
              multiline
              rows={3}
            />
            <Button variant="contained" color="primary">
              Save Template
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
