import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import ProductForm from '@/modules/commerce/components/ProductForm';
import useCreateProduct from '@/modules/commerce/hooks/useCreateProduct';
import { ProductSchema } from '@/modules/commerce/schemas';
import { ProductFormType } from '@/modules/commerce/types';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Grid, Typography } from '@mui/material';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';
import { toFormikValidationSchema } from 'zod-formik-adapter';

function CreateProductComponent() {
  const { mutateAsync: createProduct } = useCreateProduct();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const handleSubmit = async (values: ProductFormType) => {
    try {
      await createProduct(values);
      enqueueSnackbar(
        <FormattedMessage
          id="product.created"
          defaultMessage="Product created"
        />,
        { variant: 'success' },
      );
      router.push('/u/account/commerce/products');
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

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
        <Formik
          onSubmit={handleSubmit}
          validationSchema={toFormikValidationSchema(ProductSchema)}
          initialValues={{
            name: '',
            price: '0.01',
            digital: false,
            description: '',
            collections: [],
          }}
        >
          {({ isValid, submitForm, errors }) => (
            <>
              <ProductForm isValid={isValid} onSubmit={submitForm} />
            </>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

export default function CreateProductPage() {
  return (
    <DashboardLayout page="products">
      <CreateProductComponent />
    </DashboardLayout>
  );
}
