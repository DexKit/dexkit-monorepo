import { Token } from "@dexkit/core/types";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Decimal from "decimal.js";
import { CheckoutItem } from "../types";

import InventoryIcon from "@mui/icons-material/Inventory";
import { Field, useFormikContext } from "formik";
import { TextField } from "formik-mui";

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
    <ListItem divider>
      <ListItemAvatar>
        <Avatar variant="rounded" src={item.product?.imageUrl ?? undefined}>
          <InventoryIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={item.description}
        secondary={
          editable && values.items[item.id]?.quantity
            ? `${new Decimal(values.items[item.id]?.quantity ?? 0)
                .mul(item.price)
                .toString()} 
              ${token?.symbol ? token?.symbol : "USD"}`
            : `x${values.items[item.id]?.quantity ?? item.quantity}`
        }
      />
      {editable ? (
        <Field
          type="number"
          variant="standard"
          component={TextField}
          name={`items[${item.id}].quantity`}
        />
      ) : (
        <Typography>
          {new Decimal(item.quantity).mul(item.price).toString()}{" "}
          {token?.symbol ? token?.symbol : "USD"}
        </Typography>
      )}
    </ListItem>
  );
}
