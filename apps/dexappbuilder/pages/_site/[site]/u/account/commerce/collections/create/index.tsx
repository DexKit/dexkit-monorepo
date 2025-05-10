import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import ProductCollectionForm from '@/modules/commerce/components/ProductCollectionForm';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { ProductCollectionSchema } from '@dexkit/ui/modules/commerce/schemas';
import { Grid, Typography } from '@mui/material';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import useCreateProductCollection from '@dexkit/ui/modules/commerce/hooks/useCreateProductCollection';
import { ProductCollectionType } from '@dexkit/ui/modules/commerce/types';

function CreateProductCollectionComponent() {
  const { mutateAsync: create } = useCreateProductCollection();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const handleSubmit = async (values: ProductCollectionType) => {
    try {
      await create(values);
      enqueueSnackbar(
        <FormattedMessage
          id="collection.created"
          defaultMessage="Collection created"
        />,
        { variant: 'success' },
      );
      router.push('/u/account/commerce/collections');
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
                <FormattedMessage
                  id="collections"
                  defaultMessage="Collections"
                />
              ),
              uri: '/u/account/commerce/collections',
            },
            {
              caption: <FormattedMessage id="create" defaultMessage="Create" />,
              uri: '/u/account/commerce/collections/create',
              active: true,
            },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">
          <FormattedMessage id="create" defaultMessage="Create" />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Formik
          onSubmit={handleSubmit}
          validationSchema={toFormikValidationSchema(ProductCollectionSchema)}
          initialValues={{
            name: '',
            items: [],
          }}
        >
          {({}) => (
            <>
              <ProductCollectionForm />
            </>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

export default function CreateProductCollectionPage() {
  return (
    <DashboardLayout page="collections">
      <CreateProductCollectionComponent />
    </DashboardLayout>
  );
}
