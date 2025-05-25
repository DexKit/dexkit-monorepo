import Delete from '@mui/icons-material/DeleteOutlined';
import { IconButton, Skeleton, TableCell, TableRow } from '@mui/material';
import Decimal from 'decimal.js';
import { Field, FieldArray, useField } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedNumber } from 'react-intl';
import useProduct from '../hooks/useProduct';
import ProductAutocomplete from './ProductAutocomplete';

export interface CheckoutItemsTableRowProps {
  name: string;
  index: number;
}

export default function CheckoutItemsTableRow({
  name,
  index,
}: CheckoutItemsTableRowProps) {
  const [propsEditable, metaEditable, helpersEditable] =
    useField<boolean>('editable');
  const [props, meta, helpers] = useField<string>(`${name}.productId`);
  const [propsQtd, metaQtd, helpersQtd] = useField<number | undefined>(
    `${name}.quantity`,
  );

  const { data: product, isLoading } = useProduct({ id: props.value });

  return (
    <TableRow>
      <TableCell>
        <ProductAutocomplete name={`${name}.productId`} />
      </TableCell>
      <TableCell>
        <Field
          disabled={propsEditable.value}
          name={`${name}.quantity`}
          component={TextField}
          size="small"
          type="number"
        />
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton />
        ) : (
          <FormattedNumber
            style="currency"
            minimumFractionDigits={2}
            maximumFractionDigits={18}
            currency="usd"
            value={new Decimal(product?.price ?? '0').toNumber()}
          />
        )}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton />
        ) : (
          propsQtd.value && (
            <FormattedNumber
              style="currency"
              currency="usd"
              minimumFractionDigits={2}
              maximumFractionDigits={18}
              value={new Decimal(product?.price ?? '0')
                .mul(parseInt(propsQtd.value?.toString() ?? '0').toString())
                .toNumber()}
            />
          )
        )}
      </TableCell>
      <TableCell>
        <FieldArray
          name="items"
          render={({ handleRemove }) => (
            <IconButton onClick={handleRemove(index)}>
              <Delete color="error" />
            </IconButton>
          )}
        />
      </TableCell>
    </TableRow>
  );
}
