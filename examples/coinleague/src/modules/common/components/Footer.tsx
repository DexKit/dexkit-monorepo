import { Box, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function Footer() {
  return (
    <Box sx={{ py: 2 }}>
      <Typography component="div" variant="body1" align="center">
        <FormattedMessage
          id="dexkit.footer.text"
          defaultMessage="{brand} - v{version} - 2022"
          values={{ version: '0.0.1', brand: 'DexKit' }}
        />
      </Typography>
    </Box>
  );
}
