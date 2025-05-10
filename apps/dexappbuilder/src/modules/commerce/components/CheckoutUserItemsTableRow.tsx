import { Token } from '@dexkit/core/types';
import { Avatar, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { CheckoutItem } from '../types';

import InventoryIcon from '@mui/icons-material/Inventory';
import Decimal from 'decimal.js';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';

export interface CheckoutUserItemsTableRowProps {
  token?: Token | null;
  item: CheckoutItem;
  editable?: boolean;
}

export default function CheckoutUserItemsTableRow({
  token,
  item,
  editable,
}: CheckoutUserItemsTableRowProps) {
  const { values } = useFormikContext<{
    items: { [key: string]: { quantity: number; price: string } };
  }>();

  return (
    <TableRow>
      <TableCell>
        <Stack direction="row" spacing={2}>
          <Avatar
            sx={(theme) => ({
              width: theme.spacing(5),
              height: theme.spacing(5),
            })}
            variant="rounded"
            src={item.product?.imageUrl ?? undefined}
          >
            <InventoryIcon />
          </Avatar>
          <Typography>{item.description}</Typography>
        </Stack>
      </TableCell>
      <TableCell>
        {editable ? (
          <Field
            type="number"
            variant="standard"
            component={TextField}
            name={`items[${item.id}].quantity`}
          />
        ) : (
          values.items[item.id]?.quantity
        )}
      </TableCell>
      <TableCell>
        {new Decimal(values.items[item.id]?.quantity)
          .mul(item.price)
          .toString()}{' '}
        {token?.symbol ? token?.symbol : 'USD'}
      </TableCell>
    </TableRow>
  );
}
