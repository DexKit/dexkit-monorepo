import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Grid, Paper, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function CreateProductPageComponent() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <PageHeader
          breadcrumbs={[
            {
              caption: (
                <FormattedMessage id="commerce" defaultMessage="Commerce" />
              ),
              uri: '/u/account/commerce',
            },
            {
              caption: (
                <FormattedMessage id="products" defaultMessage="Products" />
              ),
              uri: '/u/account/commerce/products',
            },
            {
              caption: (
                <FormattedMessage
                  id="create.product"
                  defaultMessage="Create product"
                />
              ),
              uri: '/u/account/commerce/products/create',
              active: true,
            },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">
          <FormattedMessage
            id="create.product"
            defaultMessage="Create product"
          />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            <FormattedMessage id="loading.product.form" defaultMessage="Loading product creation form..." />
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
