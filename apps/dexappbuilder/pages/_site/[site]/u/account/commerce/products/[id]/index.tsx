import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import ProductForm from '@/modules/commerce/components/ProductForm';
import useProduct from '@/modules/commerce/hooks/useProduct';
import useUpdateProduct from '@/modules/commerce/hooks/useUpdateProduct';
import { ProductSchema } from '@/modules/commerce/schemas';
import { ProductFormType } from '@/modules/commerce/types';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Grid } from '@mui/material';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';
import { toFormikValidationSchema } from 'zod-formik-adapter';

export interface UpdateProductComponentProps {
  product: ProductFormType;
}

function UpdateProductComponent({ product }: UpdateProductComponentProps) {
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values: ProductFormType) => {
    try {
      await updateProduct(values);
      enqueueSnackbar(
        <FormattedMessage
          id="product.updated"
          defaultMessage="Product updated"
        />,
        { variant: 'success' },
      );
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
              caption: product.name,
              uri: `/u/account/commerce/checkout/${product?.id}`,
              active: true,
            },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Formik
          onSubmit={handleSubmit}
          validationSchema={toFormikValidationSchema(ProductSchema)}
          initialValues={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            publishedAt: product.publishedAt,
            category: product.category,
            digital: product.digital,
            content: product.content,
            collections: product.collections,
          }}
        >
          {({ isValid, submitForm }) => (
            <ProductForm isValid={isValid} onSubmit={submitForm} />
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

function UpdateProductPagePage() {
  const router = useRouter();

  const { id } = router.query;

  const { data: product, isFetchedAfterMount } = useProduct({
    id: id as string,
  });

  return (
    product &&
    isFetchedAfterMount && <UpdateProductComponent product={product} />
  );
}

export default function UpdateProductPage() {
  return (
    <DashboardLayout page="products">
      <UpdateProductPagePage />
    </DashboardLayout>
  );
}
