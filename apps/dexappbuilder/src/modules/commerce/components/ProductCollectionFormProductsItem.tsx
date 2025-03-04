import { ProductCollectionItemType } from '@dexkit/ui/modules/commerce/types';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import Decimal from 'decimal.js';
import { useField } from 'formik';
import { FormattedNumber } from 'react-intl';
import useProduct from '../hooks/useProduct';

export interface ProductCollectionFormProductsProps {
  name: string;
  selected?: boolean;
  onSelect: () => void;
}

export default function ProductCollectionFormProductsItem({
  name,
  onSelect,
  selected,
}: ProductCollectionFormProductsProps) {
  const [props, meta, helpers] = useField<ProductCollectionItemType>(name);

  const { productId } = props.value;

  const { data: product } = useProduct({ id: productId });

  return (
    <Card variant="elevation" sx={{ position: 'relative' }}>
      {product?.imageUrl ? (
        <CardMedia
          image={product?.imageUrl}
          sx={{ aspectRatio: '1/1', height: '100%', width: '100%' }}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          sx={{ aspectRatio: '1/1', height: '100%', width: '100%' }}
        />
      )}
      <CardContent>
        <Typography fontWeight="bold" variant="body1">
          {product?.name ?? <Skeleton />}
        </Typography>
        <Typography variant="body2" color="success.main">
          {product ? (
            <FormattedNumber
              style="currency"
              currency="usd"
              maximumFractionDigits={18}
              minimumFractionDigits={2}
              value={new Decimal(product.price).toNumber()}
            />
          ) : (
            <Skeleton />
          )}
        </Typography>
      </CardContent>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          p: 1,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <Checkbox checked={Boolean(selected)} onClick={onSelect} />
        </Stack>
      </Box>
    </Card>
  );
}
