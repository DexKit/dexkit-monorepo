import { Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { FormattedMessage } from "react-intl";
import { toFormikValidationSchema } from "zod-formik-adapter";
import useCheckout from "../../hooks/useCheckout";
import useUpdateCheckout from "../../hooks/useUpdateCheckout";
import { CheckoutSchema } from "../../schemas";
import { CheckoutFormType } from "../../types";
import DashboardLayout from "../layouts/DashboardLayout";
import { CommerceBreadcrumbs } from "./CommerceBreadcrumbs";
import CheckoutForm from "./forms/CheckoutForm";
import useParams from "./hooks/useParams";

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
        { variant: "success" }
      );
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
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
              <FormattedMessage id="checkouts" defaultMessage="Checkouts" />
            ),
            containerId: "commerce.checkouts",
          },
          {
            caption: checkout.title,
            containerId: `"commerce.checkouts.edit`,
            params: { id: checkout.id ?? "" },
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
  const { get } = useParams();
  const id = get("id");

  const { data: checkout, isFetchedAfterMount } = useCheckout({
    id: id as string,
  });

  return (
    checkout &&
    isFetchedAfterMount && <CheckoutEditComponent checkout={checkout} />
  );
}

export default function EditCheckoutContainer() {
  return (
    <DashboardLayout>
      <CheckoutEditData />
    </DashboardLayout>
  );
}
