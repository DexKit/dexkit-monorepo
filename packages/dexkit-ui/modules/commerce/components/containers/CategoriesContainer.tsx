import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { useState } from "react";

import CreateCategoryFormDialog from "@dexkit/ui/modules/commerce/components/dialogs/CreateCategoryFormDialog";
import Add from "@mui/icons-material/Add";
import { useQueryClient } from "@tanstack/react-query";
import { GET_CATEGORY_LIST } from "../../hooks/useCategoryList";
import CategoriesTable from "../CategoriesTable";
import DashboardLayout from "../layouts/DashboardLayout";

export default function CategoriesContainer() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const queryClient = useQueryClient();

  return (
    <>
      <DashboardLayout page="categories">
        {open && (
          <CreateCategoryFormDialog
            DialogProps={{ open, onClose: handleClose }}
            onRefetch={async () => {
              await queryClient.refetchQueries([GET_CATEGORY_LIST]);
            }}
          />
        )}
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6">
              <FormattedMessage id="categories" defaultMessage="Categories" />
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <FormattedMessage
                id="create.categories.description.text"
                defaultMessage="Create categories to organize your products for easier management."
              />
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Button
              startIcon={<Add />}
              onClick={handleOpen}
              variant="contained"
            >
              <FormattedMessage
                id="new.category"
                defaultMessage="New category"
              />
            </Button>
          </Box>
          <CategoriesTable />
        </Stack>
      </DashboardLayout>
    </>
  );
}
