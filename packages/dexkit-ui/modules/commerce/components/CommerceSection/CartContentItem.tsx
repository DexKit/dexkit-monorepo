import Inventory from "@mui/icons-material/Inventory";
import {
  Avatar,
  Box,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import Decimal from "decimal.js";
import { CartItem } from "../../types";
import Counter from "../Counter";

export interface CartContentItemProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onDelete: () => void;
}

export default function CartContentItem({
  item,
  onIncrement,
  onDecrement,
  onDelete,
}: CartContentItemProps) {
  return (
    <TableRow>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar src={item.imageUrl} variant="rounded">
            <Inventory />
          </Avatar>
          <Box>
            <Typography variant="body1">{item.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.price} USD
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <Counter
          value={item?.quantity ?? 0}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onDelete={onDelete}
        />
      </TableCell>
      <TableCell>
        {new Decimal(item.price).mul(item?.quantity ?? 0).toString()} USD
      </TableCell>
    </TableRow>
  );
}
