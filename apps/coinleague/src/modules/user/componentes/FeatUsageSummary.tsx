import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useBillingByFeatQuery } from '../hooks/payments';
import FeatUsageSummaryRow from './FeatUsageSummaryRow';

export interface FeatUsageSummaryProps {
  id: number;
}

export default function FeatUsageSummary({ id }: FeatUsageSummaryProps) {
  const billingByFeatQuery = useBillingByFeatQuery({ id });

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <FormattedMessage id="feature" defaultMessage="Feature" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="amount" defaultMessage="Amount" />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {billingByFeatQuery.isLoading && (
          <>
            <TableRow>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
          </>
        )}
        {billingByFeatQuery.data?.map((feat, index: number) => (
          <FeatUsageSummaryRow feat={feat} key={index} />
        ))}
      </TableBody>
    </Table>
  );
}
