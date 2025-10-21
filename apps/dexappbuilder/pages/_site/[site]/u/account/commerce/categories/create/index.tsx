import CategoryForm from '@/modules/commerce/components/CategoryForm';
import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import useCreateCategory from '@/modules/commerce/hooks/category/useCreateCategory';

import { CategoryFormSchema } from '@/modules/commerce/schemas';
import { CategoryType } from '@/modules/commerce/types';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Grid, Typography } from '@mui/material';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';
import { toFormikValidationSchema } from 'zod-formik-adapter';

function CreateCategoryComponent() {
  const { mutateAsync: createCategory } = useCreateCategory();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const handleSubmit = async (values: CategoryType) => {
    try {
      await createCategory(values);
      enqueueSnackbar(
        <FormattedMessage
          id="category.created"
          defaultMessage="Category created"
        />,
        { variant: 'success' },
      );
      router.push('/u/account/commerce/categories');
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
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
                <FormattedMessage id="categories" defaultMessage="Categories" />
              ),
              uri: '/u/account/commerce/categories',
            },
            {
              caption: (
                <FormattedMessage
                  id="create.category"
                  defaultMessage="Create Category"
                />
              ),
              uri: '/u/account/commerce/categories/create',
              active: true,
            },
          ]}
        />
      </Grid>
      <Grid size={12}>
        <Typography variant="h5">
          <FormattedMessage
            id="create.category"
            defaultMessage="Create Category"
          />
        </Typography>
      </Grid>
      <Grid size={12}>
        <Formik
          onSubmit={handleSubmit}
          validationSchema={toFormikValidationSchema(CategoryFormSchema)}
          initialValues={{
            name: '',
          }}
        >
          {({ }) => (
            <>
              <CategoryForm />
            </>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

export default function CreateProductPage() {
  return (
    <DashboardLayout page="categories">
      <CreateCategoryComponent />
    </DashboardLayout>
  );
}
