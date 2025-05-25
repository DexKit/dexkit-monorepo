import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCart from "@mui/icons-material/ShoppingCartOutlined";

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
  Typography
} from "@mui/material";
import Decimal from "decimal.js";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import useCommerce from "../../hooks/useCommerce";
import useUserProduct from "../../hooks/useUserProduct";
import Counter from "../Counter";
import ContentHeader from "./ContentHeader";

import { getWindowUrl } from "@dexkit/core/utils/browser";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useUserProductImages from "../../hooks/useUserProductImages";
import { ShareType } from "../containers/types";
import { generateShareLink } from "../containers/utils";
import ProductImagesSlide from "./ProductImagesSlide";

// Import Swiper styles
import "swiper/css";

const ShareDialogV2 = dynamic(
  () => import("../../../../components/dialogs/ShareDialogV2")
);

const Image = styled("img")(({ theme }) => ({
  height: "100%",
  width: "100%",
  objectFit: "cover",
  aspectRatio: "1/1",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[200]}`,

  backgroundColor: theme.palette.background.paper,
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
    }
  };

  const handleBuyNow = () => {
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

  const [url, setUrl] = useState<string>();

  const handleShareContent = (value: string) => {
    const msg = `Product link: ${url}`;

    let link = "";

    if (
      ["telegram", "whatsapp", "facebook", "email", "pinterest", "x"].includes(
        value
      ) &&
      url
    ) {
      link = generateShareLink(msg, url, value as ShareType);

      window.open(link, "_blank");
    }
  };

  const handleClose = () => {
    setUrl(undefined);
  };

  const handleShare = () => {
    setUrl(`${getWindowUrl()}/c/product/${product?.id}`);
  };

  const { data: images } = useUserProductImages({ productId });

  const [imageUrl, setImageUrl] = useState<string>();

  const handleSelectImage = useCallback(
    (url: string) => () => {
      setImageUrl(url);
    },
    []
  );

  console.log("Vproduct", product, productId);

  return (
    <>
      {url && (
        <ShareDialogV2
          url={url}
          DialogProps={{
            open: true,
            maxWidth: "sm",
            fullWidth: true,
            onClose: handleClose,
          }}
          onClick={handleShareContent}
        />
      )}
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Image
                src={
                  imageUrl !== undefined ? imageUrl : product?.imageUrl ?? ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <ProductImagesSlide onSelectImage={handleSelectImage} images={images ?? []} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Stack alignItems="flex-start" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h4" component="h1">
                  {product ? product?.name : <Skeleton />}
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
                  <IconButton onClick={handleShare} size="small">
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
                {product ? product?.description : <Skeleton />}
              </Typography>
              <Typography fontWeight="500" variant="h5">
                {product ? (
                  <>
                    <FormattedNumber
                      value={new Decimal(
                        product?.price?.toString() ?? "0"
                      ).toNumber()}
                      maximumFractionDigits={18}
                      minimumFractionDigits={2}
                    />{" "}
                    USD
                  </>
                ) : (
                  <Skeleton />
                )}
              </Typography>

              {cartItem?.quantity && cartItem?.quantity > 0 ? (
                <Box>
                  <Counter
                    value={cartItem?.quantity ?? 0}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    onDelete={handleDelete}
                  />
                </Box>
              ) : (
                <Button
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  fullWidth
                  size="large"
                  color="primary"
                >
                  <FormattedMessage
                    id="add.to.cart"
                    defaultMessage="Add to cart"
                  />
                </Button>
              )}

              {cartItem?.quantity && cartItem?.quantity > 0 ? (
                <Button
                  startIcon={<ShoppingCart />}
                  onClick={openCart}
                  fullWidth
                  size="large"
                  variant="outlined"
                  color="primary"
                >
                  <FormattedMessage
                    id="go.to.cart"
                    defaultMessage="Go to Cart"
                  />
                </Button>
              ) : (
                <Button
                  onClick={handleBuyNow}
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
    </>
  );
}
