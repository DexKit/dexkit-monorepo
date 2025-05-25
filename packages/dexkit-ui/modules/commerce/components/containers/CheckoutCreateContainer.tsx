import { Alert, Button, Stack } from "@mui/material";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import { FormattedMessage } from "react-intl";
import { toFormikValidationSchema } from "zod-formik-adapter";
import useCheckoutSettings from "../../hooks/useCheckoutSettings";
import useCreateCheckout from "../../hooks/useCreateCheckout";
import { CheckoutSchema } from "../../schemas";
import { CheckoutFormType } from "../../types";
import DashboardLayout from "../layouts/DashboardLayout";
import { CommerceBreadcrumbs } from "./CommerceBreadcrumbs";
import CheckoutForm from "./forms/CheckoutForm";
import useParams from "./hooks/useParams";

function CreateCheckoutComponent() {
  const { mutateAsync: createCheckout } = useCreateCheckout();

  const { enqueueSnackbar } = useSnackbar();

  const { setContainer } = useParams();

  const handleSubmit = async (values: CheckoutFormType) => {
    try {
      await createCheckout(values);
      enqueueSnackbar(
        <FormattedMessage
          id="checkout.created"
          defaultMessage="Checkout Created"
        />,
        { variant: "success" }
      );
      setContainer("commerce.checkouts");
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  const { data: settings, isFetched } = useCheckoutSettings();

  return (
    <>
      <Formik
        initialValues={{
          requireEmail: false,
          requireAddress: false,
          title: "",
          description: "",
          items: [],
          editable: false,
        }}
        onSubmit={handleSubmit}
        validationSchema={toFormikValidationSchema(CheckoutSchema)}
      >
        {({}) => (
          <Stack spacing={2}>
            <CommerceBreadcrumbs
              breadcrumbs={[
                {
                  caption: (
                    <FormattedMessage id="commerce" defaultMessage="Commerce" />
                  ),
                  containerId: "commerce.dashboard",
                },
                {
                  caption: (
                    <FormattedMessage
                      id="checkouts"
                      defaultMessage="Checkouts"
                    />
                  ),
                  containerId: "commerce.checkouts",
                },
                {
                  caption: (
                    <FormattedMessage id="create" defaultMessage="Create" />
                  ),
                  containerId: "commerce.checkouts.create",
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
                      onClick={() => {
                        setContainer("commerce.settings");
                      }}
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

export default function CheckoutCreateContainer() {
  return (
    <DashboardLayout page="checkout">
      <CreateCheckoutComponent />
    </DashboardLayout>
  );
}
