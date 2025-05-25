import { Alert, Box, Button, Divider, Stack, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import Add from "@mui/icons-material/Add";
import NextLink from "next/link";
import { useMemo } from "react";
import useCheckoutSettings from "../../hooks/useCheckoutSettings";
import SettingsAlertDialog from "../dialogs/SettingsAlertDialog";
import DashboardLayout from "../layouts/DashboardLayout";
import ProductsTable from "../ProductsTable";
import useParams from "./hooks/useParams";

export default function ProductsContainer() {
  const { setContainer } = useParams();

  const { data: settings } = useCheckoutSettings();

  const showBackdrop = useMemo(() => {
    return !settings?.receiverAddress || !settings.notificationEmail;
  }, [settings]);

  const handleClose = () => {};

  return (
    <DashboardLayout page="products">
      <Box sx={{ position: "relative", p: showBackdrop ? 2 : 0 }}>
        <SettingsAlertDialog
          BackdropProps={{
            open: showBackdrop,
            sx: {
              position: "absolute",
              zIndex: (theme) => theme.zIndex.drawer,
            },
          }}
        />
        <Stack spacing={2}>
          <Box mb={4}>
            <Typography variant="h5" fontWeight="bold">
              <FormattedMessage id="items" defaultMessage="Items" />
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <FormattedMessage
                id="create.and.manage.your.products"
                defaultMessage="Create and manage your products."
              />
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={2} alignItems="flex-start">
            <Button
              LinkComponent={NextLink}
              startIcon={<Add />}
              variant="contained"
              onClick={() => {
                setContainer("commerce.products.create");
              }}
            >
              <FormattedMessage id="new.product" defaultMessage="New product" />
            </Button>
            <Alert severity="info">
              <FormattedMessage
                id="product.inactive.not.display.info"
                defaultMessage="Products with visibility set to 'Inactive' will not be displayed in your e-commerce store."
              />
            </Alert>
          </Stack>
          <ProductsTable />
        </Stack>
      </Box>
    </DashboardLayout>
  );
}
