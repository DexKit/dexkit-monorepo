import { Card, CardContent, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function PaymentsSection() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <FormattedMessage id="payments" defaultMessage="Payments" />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage
            id="payments.disabled"
            defaultMessage="Payment methods are currently disabled."
          />
        </Typography>
      </CardContent>
    </Card>
  );
}
