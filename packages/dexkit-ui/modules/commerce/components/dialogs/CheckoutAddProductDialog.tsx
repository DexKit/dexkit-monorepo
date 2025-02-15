import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../../../../components";
import { ProductFormType } from "../../types";
import Counter from "../Counter";
import ProductsAutocomplete from "../ProductsAutocomplete";

export interface CheckoutAddProductDialogProps {
  DialogProps: DialogProps;
  onConfirm: (product: ProductFormType, quantity: number) => void;
}

export default function CheckoutAddProductDialog({
  DialogProps,
  onConfirm,
}: CheckoutAddProductDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const [product, setProduct] = useState<ProductFormType | null>(null);

  const handleChange = (product: ProductFormType | null) => {
    setProduct(product);
  };

  const [count, setCount] = useState(1);

  const handleIncrement = () => {
    setCount((value) => value + 1);
  };

  const handleDecrement = () => {
    setCount((value) => value - 1);
  };

  return (
    <Dialog maxWidth="sm" fullWidth {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="add.product.to.checkout"
            defaultMessage="Add Product to Checkout"
          />
        }
        onClose={handleClose}
        sx={{ py: 2, px: 4 }}
      />
      <DialogContent sx={{ py: 2, px: 4 }} dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ProductsAutocomplete product={product} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <Counter
              onDecrement={handleDecrement}
              onIncrement={handleIncrement}
              value={count}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ py: 2, px: 4 }}>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (product) {
              onConfirm(product, count);
            }
          }}
        >
          <FormattedMessage id="add" defaultMessage="Add" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
