import { Grid } from "@mui/material";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import { FormattedMessage } from "react-intl";
import { toFormikValidationSchema } from "zod-formik-adapter";
import useProduct from "../../hooks/useProduct";
import useUpdateProduct from "../../hooks/useUpdateProduct";
import { ProductSchema } from "../../schemas";
import { ProductFormType } from "../../types";
import DashboardLayout from "../layouts/DashboardLayout";
import { CommerceBreadcrumbs } from "./CommerceBreadcrumbs";
import ProductForm from "./forms/ProductForm";
import useParams from "./hooks/useParams";

export interface EditProductComponentProps {
  product: ProductFormType;
}

function EditProductComponentWrapper({ product }: EditProductComponentProps) {
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values: ProductFormType) => {
    try {
      await updateProduct(values);
      enqueueSnackbar(
        <FormattedMessage
          id="product.updated"
          defaultMessage="Product updated"
        />,
        { variant: "success" }
      );
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
                <FormattedMessage id="products" defaultMessage="Products" />
              ),
              containerId: "commerce.products.items",
            },
            {
              caption: product.name,
              params: { id: product?.id ?? "" },
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
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            publishedAt: product.publishedAt,
            category: product.category,
            digital: product.digital,
            content: product.content,
            collections: product.collections,
          }}
        >
          {({ isValid, submitForm }) => (
            <ProductForm isValid={isValid} onSubmit={submitForm} />
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

function EditProductComponent() {
  const { params } = useParams();

  const { data: product, isFetchedAfterMount } = useProduct({
    id: params["id"] as string,
  });

  return (
    product &&
    isFetchedAfterMount && <EditProductComponentWrapper product={product} />
  );
}

export default function EditProductContainer() {
  return (
    <DashboardLayout page="products">
      <EditProductComponent />
    </DashboardLayout>
  );
}
