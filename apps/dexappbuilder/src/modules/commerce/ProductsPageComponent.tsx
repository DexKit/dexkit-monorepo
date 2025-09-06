import { PageHeader } from '@dexkit/ui/components/PageHeader';
import Add from '@mui/icons-material/Add';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';
import { FormattedMessage } from 'react-intl';

export default function ProductsPageComponent() {
  return (
    <Stack spacing={2}>
      <PageHeader
        breadcrumbs={[
          {
            caption: <FormattedMessage id="home" defaultMessage="Home" />,
            uri: '/',
          },
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
            active: true,
          },
        ]}
      />
      <Box mb={4}>
        <Typography variant="h5" fontWeight="bold">
          <FormattedMessage id="items" defaultMessage="Items" />
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <FormattedMessage
            id="create.and.manage.your.products"
            defaultMessage="Create and manage your products."
          />
        </Typography>
      </Box>
      <Stack spacing={2} alignItems="flex-start">
        <Button
          LinkComponent={NextLink}
          startIcon={<Add />}
          variant="contained"
          href="/u/account/commerce/products/create"
        >
          <FormattedMessage id="new.product" defaultMessage="New product" />
        </Button>
        <Alert severity="info">
          <FormattedMessage
            id="product.inactive.not.display.info"
            defaultMessage={`Products with the status "Inactive" will not be displayed in your e-commerce store.`}
          />
        </Alert>
      </Stack>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          <FormattedMessage id="loading.products" defaultMessage="Loading products..." />
        </Typography>
      </Paper>
    </Stack>
  );
}
