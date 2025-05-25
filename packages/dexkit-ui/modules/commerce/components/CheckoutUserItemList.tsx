import { Token } from "@dexkit/core/types";
import { List } from "@mui/material";
import { CheckoutItem } from "../types";

import CheckoutUserItemsTableRow from "./CheckoutUserItemsTableRow";

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
    <List disablePadding>
      {items?.map((item: CheckoutItem, index: number) => (
        <CheckoutUserItemsTableRow
          item={item}
          key={index}
          token={token}
          editable={editable}
        />
      ))}
    </List>
  );
}
