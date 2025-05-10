import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import { FormattedMessage } from 'react-intl';
import { ProductFormType } from '../types';

export interface ProductPriceTableProps {}

export default function ProductPriceTable({}: ProductPriceTableProps) {
  const { values } = useFormikContext<ProductFormType>();

  return (
    <FieldArray
      name="prices"
      render={({ handleRemove }) => (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="network" defaultMessage="Network" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="token" defaultMessage="Token" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="amount" defaultMessage="Amount" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="actions" defaultMessage="Actions" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      )}
    />
  );
}
