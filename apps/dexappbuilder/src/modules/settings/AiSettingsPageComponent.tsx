import { Container, Paper, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function AiSettingsPageComponent() {
  return (
    <Container>
      <Stack spacing={2}>
        <Typography variant="h5">
          <FormattedMessage id="ai.settings" defaultMessage="AI Settings" />
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            <FormattedMessage id="loading.ai.settings" defaultMessage="Loading AI settings..." />
          </Typography>
        </Paper>
      </Stack>
    </Container>
  );
}
