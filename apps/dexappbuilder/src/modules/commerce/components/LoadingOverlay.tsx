import { Box, CircularProgress, Stack, Typography, useTheme } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export function LoadingOverlay() {
  const theme = useTheme();
  return (
    <Stack
      py={2}
      alignItems="center"
      justifyItems="center"
      spacing={1}
      justifyContent="center"
      sx={{ height: '100%' }}
    >
      <CircularProgress size={theme.spacing(2)} color="primary" />
      <Box>
        <Typography align="center" variant="h5">
          <FormattedMessage id="loading" defaultMessage="Loading" />
        </Typography>
      </Box>
    </Stack>
  );
}
