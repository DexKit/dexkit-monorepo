import {
  Box,
  Button,
  ButtonGroup,
  CardActionArea,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Decimal from "decimal.js";
import { FormattedMessage, FormattedNumber } from "react-intl";
import useCommerce from "../hooks/useCommerce";
import { Product } from "../types";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import FavoriteIcon from "@mui/icons-material/Favorite";

import Delete from "@mui/icons-material/Delete";
import { MouseEvent } from "react";

import Share from "@mui/icons-material/Share";
import { useRouter } from "next/router";

export interface ProductCardProps {
  product: Product;
  isOnWinshlist: boolean;
  onShare: (target: HTMLElement) => void;
  onWishlist: () => void;
}

export default function ProductCard({
  product,
  isOnWinshlist,
  onShare,
  onWishlist,
}: ProductCardProps) {
  const { isSection, setProduct, cart } = useCommerce();

  const router = useRouter();

  const handleClick = (e: MouseEvent) => {
    if (isSection) {
      e.preventDefault();

      if (!cart.item(product.id) || cart.item(product.id)?.quantity === 0) {
        cart.addItem({
          name: product.name,
          price: product.price,
          productId: product.id,
          quantity: 1,
          imageUrl: product.imageUrl ?? "",
        });

        router.push("/c/cart");
      }
    }
  };

  const handleClickImage = (e: MouseEvent) => {
    if (isSection) {
      e.preventDefault();
      setProduct(product.id);
    }
  };

  const handleAdd = () => {
    if (!cart.item(product.id) || cart.item(product.id)?.quantity === 0) {
      return cart.addItem({
        name: product.name,
        price: product.price,
        productId: product.id,
        quantity: 1,
        imageUrl: product.imageUrl ?? "",
      });
    }

    return cart.updateItem({
      name: product.name,
      price: product.price,
      productId: product.id,
      quantity: 0,
      imageUrl: product.imageUrl ?? "",
    });
  };

  return (
    <Box>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="flex-end">
          <IconButton size="small" onClick={onWishlist}>
            {isOnWinshlist ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
          <IconButton size="small" onClick={(e) => onShare(e.currentTarget)}>
            <Share fontSize="small" />
          </IconButton>
        </Stack>

        <CardActionArea onClick={handleClickImage}>
          {product.imageUrl ? (
            <Box
              sx={{
                aspectRatio: "1/1",
                height: "100%",
                width: "100%",
                backgroundRepeat: "no-repeat",
                objectFit: "cover",
                backgroundSize: "contain",
                backgroundPosition: "center center",
                backgroundImage: `url("${product.imageUrl}")`,
                borderRadius: (theme) => theme.shape.borderRadius,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{ aspectRatio: "1/1", height: "100%", width: "100%" }}
            />
          )}
        </CardActionArea>
        <Stack alignItems="flex-start" spacing={2}>
          <Box>
            <Typography fontWeight="bold" variant="body1">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FormattedNumber
                maximumFractionDigits={18}
                minimumFractionDigits={2}
                value={new Decimal(product.price).toNumber()}
              />{" "}
              USD
            </Typography>
          </Box>
          <ButtonGroup variant="contained">
            <Button
              onClick={handleClick}
              size="small"
              variant="contained"
              color="primary"
            >
              <FormattedMessage id="buy.now" defaultMessage="Buy now" />
            </Button>
            {!cart.item(product.id) || cart.item(product.id)?.quantity === 0 ? (
              <Button onClick={handleAdd} size="small" variant="contained">
                <AddShoppingCartIcon fontSize="small" />
              </Button>
            ) : (
              <Button onClick={handleAdd} size="small" variant="outlined">
                <Delete color="inherit" fontSize="small" />
              </Button>
            )}
          </ButtonGroup>
        </Stack>
      </Stack>
    </Box>
  );
}
