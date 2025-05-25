import ShoppingCart from "@mui/icons-material/ShoppingCartOutlined";
import { Badge, IconButton } from "@mui/material";
import { useAtomValue } from "jotai";
import { dexkitCartAtom } from "../atoms";

import { useRouter } from "next/router";

export interface CommerceCartIconButtonProps {}

export default function CommerceCartIconButton({}: CommerceCartIconButtonProps) {
  const cartState = useAtomValue(dexkitCartAtom);

  const router = useRouter();

  const handleClick = () => {
    router.push("/c/cart");
  };

  return (
    <IconButton onClick={handleClick}>
      <Badge
        variant="standard"
        color="primary"
        badgeContent={
          cartState.items.length > 0
            ? cartState.items.length.toString()
            : undefined
        }
      >
        <ShoppingCart />
      </Badge>
    </IconButton>
  );
}
