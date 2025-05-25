import { ProductCollectionSchema } from "@dexkit/ui/modules/commerce/schemas";
import { Grid, Typography } from "@mui/material";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { FormattedMessage } from "react-intl";
import { toFormikValidationSchema } from "zod-formik-adapter";

import useCreateProductCollection from "@dexkit/ui/modules/commerce/hooks/useCreateProductCollection";
import { ProductCollectionType } from "@dexkit/ui/modules/commerce/types";
import DashboardLayout from "../layouts/DashboardLayout";
import { CommerceBreadcrumbs } from "./CommerceBreadcrumbs";
import ProductCollectionForm from "./forms/PorductCollectionForm";
import useParams from "./hooks/useParams";

function CreateProductCollectionComponent() {
  const { mutateAsync: create } = useCreateProductCollection();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const { setContainer } = useParams();

  const handleSubmit = async (values: ProductCollectionType) => {
    try {
      await create(values);
      enqueueSnackbar(
        <FormattedMessage
          id="collection.created"
          defaultMessage="Collection created"
        />,
        { variant: "success" }
      );
      setContainer("commerce.products.collections");
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
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
                  id="collections"
                  defaultMessage="Collections"
                />
              ),
              containerId: "commerce.products.collections",
            },
            {
              caption: <FormattedMessage id="create" defaultMessage="Create" />,
              containerId: "commerce.products.collection.create",
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
            name: "",
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

export default function CreateCollectionContainer() {
  return (
    <DashboardLayout page="collections">
      <CreateProductCollectionComponent />
    </DashboardLayout>
  );
}
