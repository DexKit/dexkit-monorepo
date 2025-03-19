import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCart from "@mui/icons-material/ShoppingCart";

import Share from "@mui/icons-material/Share";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import Decimal from "decimal.js";
import { useMemo } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import useCommerce from "../../hooks/useCommerce";
import useUserProduct from "../../hooks/useUserProduct";
import Counter from "../Counter";
import ContentHeader from "./ContentHeader";

import { useRouter } from "next/router";

const Image = styled("img")((theme) => ({
  height: "auto",
  width: "100%",
}));

export interface ProductContentProps {
  productId: string;
  disableHeader?: boolean;
}

export default function ProductContent({
  productId,
  disableHeader,
}: ProductContentProps) {
  const {
    openCart,
    setProduct,
    cart: { item, addItem, updateItem },
  } = useCommerce();

  const { data: product } = useUserProduct({ id: productId });

  const cartItem = useMemo(() => {
    return item(productId ?? "");
  }, [productId, item]);

  const handleIncrement = () => {
    if (!cartItem) {
      if (product) {
        addItem({
          name: product.name,
          price: product.price,
          productId: product.id,
          quantity: 1,
          imageUrl: product.imageUrl ?? undefined,
        });
      }
    }

    if (cartItem) {
      updateItem({ ...cartItem, quantity: cartItem.quantity + 1 });
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      updateItem({ ...cartItem, quantity: cartItem.quantity - 1 });
    }
  };

  const handleDelete = () => {
    if (cartItem) {
      updateItem({ ...cartItem, quantity: 0 });
    }
  };

  const router = useRouter();

  const handleAddToCart = () => {
    if (product) {
      addItem({
        name: product.name,
        price: product.price,
        productId: product.id,
        quantity: 1,
        imageUrl: product.imageUrl ?? undefined,
      });
      router.push("/c/cart");
    }
  };

  return (
    <Grid container spacing={2}>
      {!disableHeader && (
        <Grid item xs={12}>
          <ContentHeader
            title={product?.name ?? <Skeleton />}
            onBack={() => setProduct(undefined)}
          />
        </Grid>
      )}
      <Grid item xs={12} sm={6}>
        <Image src={product?.imageUrl ?? ""} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box>
          <Stack alignItems="flex-start" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h4" component="h1">
                {product?.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <IconButton size="small">
                  <Tooltip
                    placement="top"
                    title={
                      <FormattedMessage
                        id="add.to.wishlist"
                        defaultMessage="Add to wishlist"
                      />
                    }
                  >
                    <FavoriteBorderIcon />
                  </Tooltip>
                </IconButton>
                <IconButton size="small">
                  <Tooltip
                    placement="top"
                    title={
                      <FormattedMessage id="share" defaultMessage="Share" />
                    }
                  >
                    <Share />
                  </Tooltip>
                </IconButton>
              </Stack>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {product?.description}
            </Typography>
            <Typography fontWeight="500" variant="h5">
              <FormattedNumber
                value={new Decimal(
                  product?.price?.toString() ?? "0",
                ).toNumber()}
                maximumFractionDigits={18}
                minimumFractionDigits={2}
              />{" "}
              USD
            </Typography>

            {cartItem?.quantity && cartItem?.quantity > 0 && (
              <Box>
                <Counter
                  value={cartItem?.quantity ?? 0}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onDelete={handleDelete}
                />
              </Box>
            )}

            {Boolean(cartItem) ? (
              <Button
                startIcon={<ShoppingCart />}
                onClick={openCart}
                fullWidth
                size="large"
                variant="outlined"
                color="primary"
              >
                <FormattedMessage id="go.to.cart" defaultMessage="Go to Cart" />
              </Button>
            ) : (
              <Button
                onClick={handleAddToCart}
                fullWidth
                size="large"
                variant="contained"
                color="primary"
              >
                <FormattedMessage id="buy.now" defaultMessage="Buy now" />
              </Button>
            )}
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}
