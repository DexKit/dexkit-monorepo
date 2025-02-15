import Delete from "@mui/icons-material/DeleteOutlined";
import {
  Box,
  Button,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useField } from "formik";
import { ChangeEvent, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { CheckoutItemType } from "../../../types";
import CheckoutItemsTableRow from "./CheckoutItemsTableRow";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

export interface CheckoutItemsTableProps {
  name: string;
}

export default function CheckoutItemsTable({ name }: CheckoutItemsTableProps) {
  const [props, meta, helpers] = useField<CheckoutItemType[]>(name);

  const [selected, setSelected] = useState<number[]>([]);

  const hasChecked = useMemo(() => {
    return selected.length > 0;
  }, [JSON.stringify(selected)]);

  const isAllChecked = useMemo(() => {
    return props.value.length > 0 && selected.length === props.value.length;
  }, [JSON.stringify(selected)]);

  const handleSelectAll = (e: ChangeEvent) => {
    setSelected((value) => {
      if (value.length > 0) {
        return [];
      }

      return props.value.map((_, index) => index);
    });
  };

  const handleSelect = (index: number) => {
    return () => {
      setSelected((value) => {
        if (value.includes(index)) {
          return value.filter((c) => c !== index);
        }

        return [...value, index];
      });
    };
  };

  const handleDelete = () => {
    helpers.setValue(
      props.value.filter((n, index) => !selected.includes(index))
    );
    setSelected([]);
  };

  return (
    <Box>
      <Stack justifyContent="space-between" direction="row" alignItems="center">
        <Box></Box>
        {hasChecked && (
          <Button
            onClick={handleDelete}
            color="error"
            size="small"
            variant="outlined"
            startIcon={<Delete />}
          >
            <FormattedMessage id="delete" defaultMessage="Delete" />
          </Button>
        )}
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                onChange={handleSelectAll}
                checked={isAllChecked}
                indeterminate={!isAllChecked && hasChecked}
              />
            </TableCell>
            <TableCell>
              <FormattedMessage id="image" defaultMessage="Image" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="product" defaultMessage="Product" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="quantity" defaultMessage="Quantity" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="unit.price" defaultMessage="Unit price" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="Total price" defaultMessage="Total price" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="actions" defaultMessage="Actions" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.value.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <Stack alignItems="center">
                  <Box sx={{ fontSize: "3rem" }}>
                    <ShoppingBagIcon fontSize="inherit" />
                  </Box>
                  <Typography textAlign="center" variant="h5">
                    <FormattedMessage
                      id="no.products"
                      defaultMessage="No products"
                    />
                  </Typography>
                  <Typography
                    textAlign="center"
                    variant="body1"
                    color="text.secondary"
                  >
                    <FormattedMessage
                      id="add.products.to.the.checkout"
                      defaultMessage="Add products to the checkout"
                    />
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
          )}
          {props.value.map((item, index) => (
            <CheckoutItemsTableRow
              selected={selected.includes(index)}
              onSelect={handleSelect(index)}
              name={`${name}.${index}`}
              key={index}
              index={index}
            />
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
