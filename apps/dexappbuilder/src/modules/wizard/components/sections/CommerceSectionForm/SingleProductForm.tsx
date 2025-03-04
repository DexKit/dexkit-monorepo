import { Grid } from '@mui/material';

import ProductAutocomplete from '@dexkit/ui/modules/commerce/components/ProductAutocomplete';

export default function SingleProductForm() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ProductAutocomplete name="id" />
      </Grid>
    </Grid>
  );
}
