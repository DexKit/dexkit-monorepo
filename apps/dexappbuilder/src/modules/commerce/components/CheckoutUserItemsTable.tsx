import { Token } from '@dexkit/core/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { CheckoutItem } from '../types';

import { FormattedMessage } from 'react-intl';
import CheckoutUserItemsTableRow from './CheckoutUserItemsTableRow';

export interface CheckoutUserItemListProps {
  token?: Token | null;
  items: CheckoutItem[];
  editable?: boolean;
}

export default function CheckoutUserItemList({
  token,
  items,
  editable,
}: CheckoutUserItemListProps) {
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
            <FormattedMessage id="total" defaultMessage="Total" />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items?.map((item: CheckoutItem, index: number) => (
          <CheckoutUserItemsTableRow
            item={item}
            key={index}
            token={token}
            editable={editable}
          />
        ))}
      </TableBody>
    </Table>
  );
}
