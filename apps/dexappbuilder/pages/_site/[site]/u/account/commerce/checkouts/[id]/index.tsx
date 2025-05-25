import CheckoutForm from '@/modules/commerce/components/CheckoutForm';
import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import useCheckout from '@/modules/commerce/hooks/checkout/useCheckout';
import useUpdateCheckout from '@/modules/commerce/hooks/checkout/useUpdateCheckout';
import { CheckoutSchema } from '@/modules/commerce/schemas';
import { CheckoutFormType } from '@/modules/commerce/types';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Stack, Typography } from '@mui/material';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';
import { toFormikValidationSchema } from 'zod-formik-adapter';

interface CheckoutEditComponentProps {
  checkout: CheckoutFormType;
}

function FormWrapper({ checkout }: CheckoutEditComponentProps) {
  const { mutateAsync: update } = useUpdateCheckout();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const handleSubmit = async (values: CheckoutFormType) => {
    try {
      await update(values);
      enqueueSnackbar(
        <FormattedMessage
          id="checkout.updated"
          defaultMessage="Checkout updated"
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
        id: checkout.id,
        requireEmail: checkout.requireEmail,
        requireAddress: checkout.requireAddress,
        title: checkout.title,
        description: checkout.description,
        items: checkout.items,
        editable: checkout.editable,
      }}
      onSubmit={handleSubmit}
      validationSchema={toFormikValidationSchema(CheckoutSchema)}
    >
      <CheckoutForm />
    </Formik>
  );
}

function CheckoutEditComponent({ checkout }: CheckoutEditComponentProps) {
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
              <FormattedMessage id="checkouts" defaultMessage="Checkouts" />
            ),
            uri: '/u/account/commerce/checkouts',
          },
          {
            caption: checkout.title,
            uri: `/u/account/commerce/checkout/${checkout.id}`,
            active: true,
          },
        ]}
      />
      <Typography variant="h6">{checkout.title}</Typography>
      <FormWrapper checkout={checkout} />
    </Stack>
  );
}

function CheckoutEditData() {
  const router = useRouter();

  const { id } = router.query;
  const { data: checkout, isFetchedAfterMount } = useCheckout({
    id: id as string,
  });

  return (
    checkout &&
    isFetchedAfterMount && <CheckoutEditComponent checkout={checkout} />
  );
}

export default function CheckoutEditPage() {
  return (
    <DashboardLayout>
      <CheckoutEditData />
    </DashboardLayout>
  );
}
