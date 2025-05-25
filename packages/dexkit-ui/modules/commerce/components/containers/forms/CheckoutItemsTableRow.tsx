import Delete from "@mui/icons-material/DeleteOutlined";
import {
  Avatar,
  Checkbox,
  IconButton,
  Skeleton,
  TableCell,
  TableRow,
} from "@mui/material";
import Decimal from "decimal.js";
import { FieldArray, useField } from "formik";
import useProduct from "../../../hooks/useProduct";

export interface CheckoutItemsTableRowProps {
  name: string;
  index: number;
  selected?: boolean;
  onSelect: () => void;
}

export default function CheckoutItemsTableRow({
  name,
  index,
  selected,
  onSelect,
}: CheckoutItemsTableRowProps) {
  const [props, meta, helpers] = useField<string>(`${name}.productId`);
  const [propsQtd, metaQtd, helpersQtd] = useField<number | undefined>(
    `${name}.quantity`
  );

  const { data: product, isLoading } = useProduct({ id: props.value });

  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={Boolean(selected)} onChange={(e) => onSelect()} />
      </TableCell>
      <TableCell>
        <Avatar
          variant="rounded"
          src={product?.imageUrl ?? ""}
          sx={(theme) => ({
            width: theme.spacing(5),
            height: theme.spacing(5),
          })}
        />
      </TableCell>
      <TableCell>{product?.name}</TableCell>
      <TableCell>{propsQtd.value}</TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton />
        ) : (
          `${new Decimal(product?.price ?? "0").toNumber()} USD`
        )}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton />
        ) : (
          `${
            propsQtd.value &&
            new Decimal(product?.price ?? "0")
              .mul(parseInt(propsQtd.value?.toString() ?? "0").toString())
              .toNumber()
          } USD`
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
