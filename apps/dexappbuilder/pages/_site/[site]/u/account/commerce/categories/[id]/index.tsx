import CategoryForm from '@/modules/commerce/components/CategoryForm';
import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import useUpdateCategory from '@/modules/commerce/hooks/category/useUpdateCategory';
import useCategory from '@/modules/commerce/hooks/useCategory';
import { CategoryFormSchema } from '@/modules/commerce/schemas';
import { CategoryType } from '@/modules/commerce/types';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Stack, Typography } from '@mui/material';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';
import { toFormikValidationSchema } from 'zod-formik-adapter';

interface CategoryEditComponentProps {
  category: CategoryType;
}

function FormWrapper({ category }: CategoryEditComponentProps) {
  const { mutateAsync: update } = useUpdateCategory();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const handleSubmit = async (values: CategoryType) => {
    try {
      await update(values);
      enqueueSnackbar(
        <FormattedMessage
          id="category.updated"
          defaultMessage="Category updated"
        />,
        { variant: 'success' },
      );
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  return (
    <Formik
      initialValues={{
        id: category.id,
        name: category.name,
      }}
      onSubmit={handleSubmit}
      validationSchema={toFormikValidationSchema(CategoryFormSchema)}
    >
      <CategoryForm />
    </Formik>
  );
}

function CategoryEditComponent({ category }: CategoryEditComponentProps) {
  return (
    <Stack spacing={2}>
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
            uri: '/u/account/commerce/checkouts',
          },
          {
            caption: category.name,
            uri: `/u/account/commerce/category/${category.id}`,
            active: true,
          },
        ]}
      />
      <Typography variant="h6">{category.name}</Typography>
      <FormWrapper category={category} />
    </Stack>
  );
}

function CategoryEditData() {
  const router = useRouter();

  const { id } = router.query;
  const { data: category, isFetchedAfterMount } = useCategory({
    id: id as string,
  });

  return (
    category &&
    isFetchedAfterMount && <CategoryEditComponent category={category} />
  );
}

export default function CategoryEditPage() {
  return (
    <DashboardLayout page="categories">
      <CategoryEditData />
    </DashboardLayout>
  );
}
