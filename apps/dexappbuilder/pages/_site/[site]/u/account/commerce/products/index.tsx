import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import ProductsTable from '@/modules/commerce/components/ProductsTable';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import Add from '@mui/icons-material/Add';
import NextLink from 'next/link';

export default function CommerceProductsPage() {
  return (
    <DashboardLayout page="products">
      <Stack spacing={2}>
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
        <ProductsTable />
      </Stack>
    </DashboardLayout>
  );
}
