import { Divider, Grid, Typography } from "@mui/material";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import { FormattedMessage } from "react-intl";
import { toFormikValidationSchema } from "zod-formik-adapter";
import useCreateProduct from "../../hooks/useCreateProduct";
import { ProductSchema } from "../../schemas";
import { ProductFormType } from "../../types";
import DashboardLayout from "../layouts/DashboardLayout";
import { CommerceBreadcrumbs } from "./CommerceBreadcrumbs";
import ProductForm from "./forms/ProductForm";
import useParams from "./hooks/useParams";

function CreateProductComponent() {
  const { mutateAsync: createProduct } = useCreateProduct();

  const { enqueueSnackbar } = useSnackbar();

  const { setContainer } = useParams();

  const handleSubmit = async (values: ProductFormType) => {
    try {
      await createProduct(values);
      enqueueSnackbar(
        <FormattedMessage
          id="product.created"
          defaultMessage="Product created"
        />,
        { variant: "success" }
      );
      setContainer("commerce.products.items");
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <FormattedMessage id="items" defaultMessage="Items" />
        </Typography>
        <Typography>
          <FormattedMessage
            id="create.and.manage.your.products"
            defaultMessage="Create and manage your products"
          />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
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
                <FormattedMessage id="products" defaultMessage="Products" />
              ),
              containerId: "commerce.products.items",
            },
            {
              caption: (
                <FormattedMessage
                  id="new.product"
                  defaultMessage="New Product"
                />
              ),
              containerId: "commerce.products.create",
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
            name: "",
            price: "0.01",
            digital: false,
            description: "",
            collections: [],
          }}
        >
          {({ isValid, submitForm, errors }) => (
            <>
              <ProductForm isValid={isValid} onSubmit={submitForm} />
            </>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

export default function CreateProductContainer() {
  return (
    <DashboardLayout page="products">
      <CreateProductComponent />
    </DashboardLayout>
  );
}
