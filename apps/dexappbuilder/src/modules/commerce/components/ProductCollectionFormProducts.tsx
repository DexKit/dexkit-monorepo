import useProductList from '@dexkit/ui/modules/commerce/hooks/useProductList';
import { ProductCollectionType } from '@dexkit/ui/modules/commerce/types';
import { Box, Button, Grid } from '@mui/material';
import { useFormikContext } from 'formik';
import { useSnackbar } from 'notistack';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ProductCollectionFormProductsItem from './ProductCollectionFormProductsItem';
import AddProductsDialog from './dialogs/AddProductsDialog';

export interface ProductCollectionFormProductsProps {}

export default function ProductCollectionFormProducts({}: ProductCollectionFormProductsProps) {
  const { values, setFieldValue } = useFormikContext<ProductCollectionType>();

  const { formatMessage } = useIntl();

  const handleChange = () => {};

  const { enqueueSnackbar } = useSnackbar();

  const { data } = useProductList({ limit: 50, page: 0 });

  const [showAdd, setShowAdd] = useState(false);

  const [selection, setSelection] = useState<{ [key: string]: boolean }>({});

  const isSelected = (id: string) => {
    return selection[id];
  };

  const handleClose = () => {
    setShowAdd(false);
  };

  const handleShowAdd = () => {
    setShowAdd(true);
  };

  const handleConfirm = (products: string[]) => {
    const newItems = products.filter((x) => {
      return values.items?.find((i) => i.productId === x) === undefined;
    });

    setFieldValue('items', [
      ...(values.items ?? []),
      ...newItems.map((p) => ({ productId: p, id: undefined })),
    ]);

    handleClose();
    enqueueSnackbar(
      <FormattedMessage
        id="product.list.updated"
        defaultMessage="Product list updated"
      />,
      { variant: 'success' },
    );
  };

  const handleSelect = useCallback((id: string) => {
    return () => {
      setSelection((values) => ({ ...values, [id]: !Boolean(values[id]) }));
    };
  }, []);

  const hasSelection = useMemo(() => {
    return Object.keys(selection)
      .map((key) => selection[key])
      .includes(true);
  }, [selection]);

  const handleRemove = () => {
    const newItems = [...(values.items ?? [])].filter(
      (i) => !Boolean(selection[i.id ?? '']),
    );

    setFieldValue('items', newItems);
  };

  return (
    <>
      {showAdd && (
        <AddProductsDialog
          DialogProps={{ open: showAdd, onClose: handleClose }}
          products={data?.items ?? []}
          onConfirm={handleConfirm}
          defaultSelection={(values.items ?? []).map((i) => i.productId ?? '')}
        />
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box>
            <Grid container spacing={2}>
              <Grid item>
                <Button onClick={handleShowAdd} variant="outlined" size="small">
                  <FormattedMessage id="add" defaultMessage="Add" />
                </Button>
              </Grid>
              <Grid item xs>
                <Button
                  disabled={!hasSelection}
                  onClick={handleRemove}
                  color="error"
                  variant="outlined"
                  size="small"
                >
                  <FormattedMessage id="remove" defaultMessage="Remove" />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {values.items?.map((item, index) => (
          <Grid item xs={12} sm={3} key={index}>
            <ProductCollectionFormProductsItem
              key={index}
              name={`items.${index}`}
              onSelect={handleSelect(item.id ?? '')}
              selected={isSelected(item.id ?? '')}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
