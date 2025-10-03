import { Alert, Card, CardContent, Divider, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import AddCreditsButton from '@dexkit/ui/components/AddCreditsButton';
import CreditsDataGrid from './tables/CreditsDataGrid';
import { useIsMobile } from '@dexkit/ui/hooks/misc';

export default function CreditSection() {
  const isMobile = useIsMobile();

  return (
    <>
      <Typography variant="subtitle1" sx={{
        fontSize: isMobile ? '1.1rem' : '1.25rem',
        mb: 2
      }}>
        <FormattedMessage id="credit.history" defaultMessage="Credit History" />
      </Typography>
      <Card sx={{
        overflow: 'hidden',
        '& .MuiCardContent-root': {
          padding: isMobile ? 1 : 2
        }
      }}>
        <CardContent sx={{
          '& button': {
            width: isMobile ? '100%' : 'auto'
          }
        }}>
          <AddCreditsButton />
        </CardContent>
        <Divider />
        <CardContent>
          <Alert severity="info" sx={{
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            '& .MuiAlert-message': {
              lineHeight: isMobile ? 1.3 : 1.4
            }
          }}>
            <FormattedMessage
              id="credits.expire.oneYear"
              defaultMessage="Your added credits will expire one year from the date of addition. Please utilize them before expiry."
            />
          </Alert>
        </CardContent>
        <Divider />
        <CreditsDataGrid />
      </Card>
    </>
  );
}
