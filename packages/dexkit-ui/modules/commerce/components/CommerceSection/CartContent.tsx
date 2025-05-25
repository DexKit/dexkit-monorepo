import {
  Box,
  Card,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import useCommerce from "../../hooks/useCommerce";
import CartContentItem from "./CartContentItem";
import ContentHeader from "./ContentHeader";
import PaymentCard from "./PaymentCard";

import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

export interface CartContentProps {
  disableHeader?: boolean;
}

export default function CartContent({ disableHeader }: CartContentProps) {
  const {
    cartItems,
    closeCart,
    checkCart,
    cart: { item, updateItem },
    productId,
  } = useCommerce();

  useEffect(() => {
    checkCart();
  }, []);

  const handleIncrement = (productId: string) => {
    return () => {
      const cartItem = item(productId ?? "");

      if (cartItem) {
        updateItem({ ...cartItem, quantity: cartItem.quantity + 1 });
      }
    };
  };

  const handleDecrement = (productId: string) => {
    return () => {
      const cartItem = item(productId ?? "");

      if (cartItem) {
        updateItem({ ...cartItem, quantity: cartItem.quantity - 1 });
      }
    };
  };

  const handleDelete = (productId: string) => {
    return () => {
      const cartItem = item(productId ?? "");

      if (cartItem) {
        updateItem({ ...cartItem, quantity: 0 });
      }
    };
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {!disableHeader && (
          <Grid item xs={12}>
            <ContentHeader
              title={<FormattedMessage id="cart" defaultMessage="Cart" />}
              onBack={closeCart}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={8}>
          {cartItems.length === 0 ? (
            <Card sx={{ py: 4 }}>
              <Stack alignItems="center" spacing={2}>
                <Stack
                  sx={{ fontSize: "3rem" }}
                  alignItems="center"
                  alignContent="center"
                >
                  <ProductionQuantityLimitsIcon fontSize="inherit" />
                </Stack>
                <Box>
                  <Typography textAlign="center" variant="h5">
                    <FormattedMessage
                      id="empty.cart"
                      defaultMessage="Empty cart"
                    />
                  </Typography>
                  <Typography
                    color="text.secondary"
                    textAlign="center"
                    variant="body1"
                  >
                    <FormattedMessage
                      id="your.cart.is.empty"
                      defaultMessage="Your cart is empty"
                    />
                  </Typography>
                </Box>
              </Stack>
            </Card>
          ) : (
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
                {cartItems.map((item, index) => (
                  <CartContentItem
                    key={index}
                    item={item}
                    onIncrement={handleIncrement(item.productId)}
                    onDecrement={handleDecrement(item.productId)}
                    onDelete={handleDelete(item.productId)}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </Grid>
        <Grid item xs={12} sm={4}>
          <PaymentCard />
        </Grid>
      </Grid>
    </Box>
  );
}
