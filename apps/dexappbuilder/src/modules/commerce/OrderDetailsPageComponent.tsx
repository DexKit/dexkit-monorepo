import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function OrderDetailsPageComponent() {
  return (
    <Container>
      <Stack spacing={2}>
        <Typography variant="h5">
          <FormattedMessage id="order.details" defaultMessage="Order Details" />
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage id="loading.order.details" defaultMessage="Loading order details..." />
            </Typography>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
}
