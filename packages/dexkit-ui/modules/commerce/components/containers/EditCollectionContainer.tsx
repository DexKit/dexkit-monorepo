import { ProductCollectionSchema } from "@dexkit/ui/modules/commerce/schemas";
import {
  ProductCollectionItemType,
  ProductCollectionType,
} from "@dexkit/ui/modules/commerce/types";
import { Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import { FormattedMessage } from "react-intl";
import { toFormikValidationSchema } from "zod-formik-adapter";

import useProductCollection from "@dexkit/ui/modules/commerce/hooks/useProductCollection";
import useProductCollectionItems from "@dexkit/ui/modules/commerce/hooks/useProductCollectionItems";
import useUpdateProductCollection from "@dexkit/ui/modules/commerce/hooks/useUpdateProductCollection";
import DashboardLayout from "../layouts/DashboardLayout";
import { CommerceBreadcrumbs } from "./CommerceBreadcrumbs";
import ProductCollectionForm from "./forms/PorductCollectionForm";
import useParams from "./hooks/useParams";

interface ProductCollectionEditComponentProps {
  collection: ProductCollectionType;
  items: ProductCollectionItemType[];
}

function FormWrapper({
  collection,
  items,
}: ProductCollectionEditComponentProps) {
  const { mutateAsync: update } = useUpdateProductCollection();

  const { setContainer } = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values: ProductCollectionType) => {
    try {
      await update(values);
      enqueueSnackbar(
        <FormattedMessage
          id="collection.updated"
          defaultMessage="Collection updated"
        />,
        { variant: "success" }
      );
      setContainer("commerce.products.collections");
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
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
              <FormattedMessage id="collections" defaultMessage="Collections" />
            ),
            containerId: "commerce.products.collections",
          },
          {
            caption: collection.name,
            containerId: "commerce.products.collection.edit",
            params: { id: collection.id ?? "" },
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
  const { get } = useParams();

  const id = get("id");

  const { data: collection, isFetchedAfterMount } = useProductCollection({
    id: id,
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

export default function EditCollectionContainer() {
  return (
    <DashboardLayout page="collections">
      <ProductCollectionEditData />
    </DashboardLayout>
  );
}
