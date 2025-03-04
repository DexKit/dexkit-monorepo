import { AppDialogTitle } from '@dexkit/ui';
import { ProductFormType } from '@dexkit/ui/modules/commerce/types';
import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import Decimal from 'decimal.js';
import { useCallback, useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

export interface AddProductsDialogProps {
  DialogProps: DialogProps;
  products: ProductFormType[];

  defaultSelection: string[];

  onConfirm: (products: string[]) => void;
}

export default function AddProductsDialog({
  DialogProps,
  products,
  defaultSelection,
  onConfirm,
}: AddProductsDialogProps) {
  const [selection, setSection] = useState<string[]>(defaultSelection);

  const isSelected = (id: string) => selection.includes(id);

  const handleToggle = useCallback(
    (id: string) => {
      return () => {
        if (isSelected(id)) {
          setSection((selection) => selection.filter((s) => s !== id));
        } else {
          setSection((selection) => [...selection, id]);
        }
      };
    },
    [isSelected],
  );

  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog maxWidth="sm" fullWidth {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="add.products" defaultMessage="Add Products" />
        }
        onClose={handleClose}
      />
      <DialogContent sx={{ p: 0 }} dividers>
        <List disablePadding>
          {products.map((product, index, arr) => (
            <ListItem divider={index < arr.length - 1} key={product.id}>
              <ListItemAvatar>
                <Avatar src={product.imageUrl ?? ''} variant="rounded" />
              </ListItemAvatar>
              <ListItemText
                primary={product.name}
                secondary={
                  <FormattedNumber
                    style="currency"
                    maximumFractionDigits={2}
                    currency="usd"
                    value={new Decimal(product.price).div('100').toNumber()}
                  />
                }
              />
              <ListItemSecondaryAction>
                <Checkbox
                  checked={isSelected(product.id ?? '')}
                  onClick={handleToggle(product.id ?? '')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button onClick={() => onConfirm(selection)} variant="contained">
          <FormattedMessage id="add" defaultMessage="Add" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
