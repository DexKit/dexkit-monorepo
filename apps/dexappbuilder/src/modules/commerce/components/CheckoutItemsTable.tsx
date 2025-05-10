import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useField } from 'formik';
import { FormattedMessage } from 'react-intl';
import { CheckoutItemType } from '../types';
import CheckoutItemsTableRow from './CheckoutItemsTableRow';

export interface CheckoutItemsTableProps {
  name: string;
}

export default function CheckoutItemsTable({ name }: CheckoutItemsTableProps) {
  const [props, meta, helpers] = useField<CheckoutItemType[]>(name);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <FormattedMessage id="product" defaultMessage="Product" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="quantity" defaultMessage="Quantity" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="quantity" defaultMessage="Price" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="Total" defaultMessage="Total" />
          </TableCell>
          <TableCell>
            <FormattedMessage id="actions" defaultMessage="Actions" />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.value.map((item, index) => (
          <CheckoutItemsTableRow
            name={`${name}.${index}`}
            key={index}
            index={index}
          />
        ))}
      </TableBody>
    </Table>
  );
}
