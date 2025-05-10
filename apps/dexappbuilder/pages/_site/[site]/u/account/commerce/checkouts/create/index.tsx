import CheckoutForm from '@/modules/commerce/components/CheckoutForm';

const AddProductsDialog = dynamic(
  () => import('@/modules/commerce/components/dialogs/AddProductsDialog'),
);

import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import useCreateCheckout from '@/modules/commerce/hooks/checkout/useCreateCheckout';
import useCheckoutSettings from '@/modules/commerce/hooks/settings/useCheckoutSettings';
import { CheckoutSchema } from '@/modules/commerce/schemas';
import { CheckoutFormType } from '@/modules/commerce/types';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Alert, Button, Stack } from '@mui/material';
import { Formik } from 'formik';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';
import { toFormikValidationSchema } from 'zod-formik-adapter';

function CreateCheckoutComponent() {
  const { mutateAsync: createCheckout } = useCreateCheckout();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const handleSubmit = async (values: CheckoutFormType) => {
    try {
      await createCheckout(values);
      enqueueSnackbar(
        <FormattedMessage
          id="checkout.created"
          defaultMessage="Checkout Created"
        />,
        { variant: 'success' },
      );

      router.push('/u/account/commerce/checkouts');
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  const { data: settings, isFetched } = useCheckoutSettings();

  return (
    <>
      <Formik
        initialValues={{
          requireEmail: false,
          requireAddress: false,
          title: '',
          description: '',
          items: [],
          editable: false,
        }}
        onSubmit={handleSubmit}
        validationSchema={toFormikValidationSchema(CheckoutSchema)}
      >
        {({}) => (
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
                    <FormattedMessage
                      id="checkouts"
                      defaultMessage="Checkouts"
                    />
                  ),
                  uri: '/u/account/commerce/checkouts',
                },
                {
                  caption: (
                    <FormattedMessage id="create" defaultMessage="Create" />
                  ),
                  uri: '/u/account/commerce/checkout/create',
                  active: true,
                },
              ]}
            />
            {isFetched &&
              (!settings?.notificationEmail || !settings?.receiverAddress) && (
                <Alert
                  severity="error"
                  action={
                    <Button
                      LinkComponent={Link}
                      href="/u/account/commerce/settings"
                      variant="outlined"
                      color="inherit"
                    >
                      <FormattedMessage
                        id="settings"
                        defaultMessage="Settings"
                      />
                    </Button>
                  }
                >
                  <FormattedMessage
                    id="email.and.receiver.error.message"
                    defaultMessage="It is not possible to create a checkout without setting up the receiver's email and address."
                  />
                </Alert>
              )}

            <div>
              <CheckoutForm
                disabled={
                  !settings?.notificationEmail || !settings?.receiverAddress
                }
              />
            </div>
          </Stack>
        )}
      </Formik>
    </>
  );
}

export default function CheckoutCreatePage() {
  return (
    <DashboardLayout page="checkout">
      <CreateCheckoutComponent />
    </DashboardLayout>
  );
}
