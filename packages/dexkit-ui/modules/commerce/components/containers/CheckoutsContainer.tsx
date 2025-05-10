import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import ShareDialogV2 from "@dexkit/ui/components/dialogs/ShareDialogV2";
import Add from "@mui/icons-material/Add";
import dynamic from "next/dynamic";
import { useState } from "react";
import CheckoutsTable from "../CheckoutsTable";
import DashboardLayout from "../layouts/DashboardLayout";
import useParams from "./hooks/useParams";

import { Formik } from "formik";
import useCreateCheckout from "../../hooks/useCreateCheckout";
import { CheckoutFormType } from "../../types";

import { useSnackbar } from "notistack";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { CheckoutSchema } from "../../schemas";
import { ShareType } from "./types";
import { generateShareLink } from "./utils";

const AddCheckoutDialog = dynamic(() => import("./dialogs/AddCheckoutDialog"));

export default function CheckoutsContainer() {
  const [url, setUrl] = useState<string>();

  const handleShare = (url: string) => {
    setUrl(url);
  };

  const handleClose = () => {
    setUrl(undefined);
  };

  const handleShareContent = (value: string) => {
    const msg = `There is the checkout link: ${url}`;

    let link = "";

    if (
      ["telegram", "whatsapp", "facebook", "email", "pinterest", "x"].includes(
        value
      ) &&
      url
    ) {
      link = generateShareLink(msg, url, value as ShareType);

      window.open(link, "_blank");
    }
  };

  const { setContainer } = useParams();

  const [showCreate, setShowCreate] = useState(false);

  const handleCloseCreate = () => {
    setShowCreate(false);
  };

  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync, isLoading } = useCreateCheckout();

  const handleSubmit = async (values: CheckoutFormType) => {
    try {
      const result = await mutateAsync({
        title: values.title,
        description: values.description,
      });

      enqueueSnackbar(
        <FormattedMessage
          id="checkout.created"
          defaultMessage="Checkout created"
        />,
        {
          variant: "success",
        }
      );

      setContainer("commerce.checkouts.edit", { id: result.id });
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  return (
    <>
      {url && (
        <ShareDialogV2
          url={url}
          DialogProps={{
            open: true,
            maxWidth: "sm",
            fullWidth: true,
            onClose: handleClose,
          }}
          onClick={handleShareContent}
        />
      )}

      {showCreate && (
        <Formik
          onSubmit={handleSubmit}
          initialValues={{ title: "", description: "" }}
          validationSchema={toFormikValidationSchema(CheckoutSchema)}
        >
          {({ errors }) => (
            <AddCheckoutDialog
              DialogProps={{ open: showCreate, onClose: handleCloseCreate }}
              isLoading={isLoading}
            />
          )}
        </Formik>
      )}

      <DashboardLayout page="checkouts">
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6">
              <FormattedMessage id="checkouts" defaultMessage="Checkouts" />
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <FormattedMessage
                id="create.and.share.product.checkouts.with.your.customers"
                defaultMessage="Create and share product checkouts with your customers."
              />
            </Typography>
          </Box>
          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setShowCreate(true);
              }}
            >
              <FormattedMessage
                id="new.checkout"
                defaultMessage="New Checkout"
              />
            </Button>
          </Stack>
          <CheckoutsTable onShare={handleShare} />
        </Stack>
      </DashboardLayout>
    </>
  );
}
