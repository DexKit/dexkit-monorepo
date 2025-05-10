import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import ProductCollectionForm from '@/modules/commerce/components/ProductCollectionForm';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { ProductCollectionSchema } from '@dexkit/ui/modules/commerce/schemas';
import {
  ProductCollectionItemType,
  ProductCollectionType,
} from '@dexkit/ui/modules/commerce/types';
import { Stack, Typography } from '@mui/material';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import useProductCollection from '@dexkit/ui/modules/commerce/hooks/useProductCollection';
import useProductCollectionItems from '@dexkit/ui/modules/commerce/hooks/useProductCollectionItems';
import useUpdateProductCollection from '@dexkit/ui/modules/commerce/hooks/useUpdateProductCollection';

interface ProductCollectionEditComponentProps {
  collection: ProductCollectionType;
  items: ProductCollectionItemType[];
}

function FormWrapper({
  collection,
  items,
}: ProductCollectionEditComponentProps) {
  const { mutateAsync: update } = useUpdateProductCollection();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const handleSubmit = async (values: ProductCollectionType) => {
    try {
      await update(values);
      enqueueSnackbar(
        <FormattedMessage
          id="collection.updated"
          defaultMessage="Collection updated"
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
        id: collection.id,
        name: collection.name,
        items: items,
      }}
      onSubmit={handleSubmit}
      validationSchema={toFormikValidationSchema(ProductCollectionSchema)}
    >
      <ProductCollectionForm />
    </Formik>
  );
}

function ProductCollectionEditComponent({
  collection,
  items,
}: ProductCollectionEditComponentProps) {
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
              <FormattedMessage id="collections" defaultMessage="Collections" />
            ),
            uri: '/u/account/commerce/collections',
          },
          {
            caption: collection.name,
            uri: `/u/account/commerce/collections/${collection.id}`,
            active: true,
          },
        ]}
      />
      <Typography variant="h6">{collection.name}</Typography>
      <FormWrapper collection={collection} items={items} />
    </Stack>
  );
}

function ProductCollectionEditData() {
  const router = useRouter();

  const { id } = router.query;
  const { data: collection, isFetchedAfterMount } = useProductCollection({
    id: id as string,
  });

  const { data: items, isFetchedAfterMount: isFetchedAfterMountItems } =
    useProductCollectionItems({ id: id as string });

  return (
    collection &&
    items &&
    isFetchedAfterMount &&
    isFetchedAfterMountItems && (
      <ProductCollectionEditComponent
        collection={collection}
        items={items ?? []}
      />
    )
  );
}

export default function ProductCollectionEditPage() {
  return (
    <DashboardLayout page="collections">
      <ProductCollectionEditData />
    </DashboardLayout>
  );
}
