import { useCreditHistory } from '@dexkit/ui/hooks/payments';
import {
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Decimal from 'decimal.js';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';

import AddCreditsButton from '@dexkit/ui/components/AddCreditsButton';
import moment from 'moment';

export default function CreditSection() {
  const { data: credits } = useCreditHistory();

  const { formatMessage } = useIntl();

  return (
    <>
      <Typography variant="subtitle1">
        <FormattedMessage id="credit.history" defaultMessage="Credit History" />
      </Typography>
      <Card>
        <CardContent>
          <AddCreditsButton />
        </CardContent>
        <Divider />
        <CardContent>
          <Alert severity="info">
            <FormattedMessage
              id="credits.expire.oneYear"
              defaultMessage="Your added credits will expire one year from the date of addition. Please utilize them before expiry."
            />
          </Alert>
        </CardContent>
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="status" defaultMessage="Status" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="Created" defaultMessage="Created" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="amount" defaultMessage="Amount" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {credits?.map((credit, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  {credit.enabled ? (
                    <Chip
                      size="small"
                      color="success"
                      variant="outlined"
                      label={formatMessage({
                        id: 'credited',
                        defaultMessage: 'Credited',
                      })}
                    />
                  ) : (
                    <Chip
                      size="small"
                      color="warning"
                      variant="outlined"
                      label={formatMessage({
                        id: 'payment.pending',
                        defaultMessage: 'Payment Pending',
                      })}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {moment(credit.createdAt).format('DD/MM/YYYY hh:mm:ss')}
                </TableCell>
                <TableCell>
                  <FormattedNumber
                    style="currency"
                    currency="USD"
                    value={new Decimal(credit.amount).toNumber()}
                    minimumFractionDigits={4}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
