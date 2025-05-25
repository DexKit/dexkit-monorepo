import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import { Box, Button, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import CategoriesTable from '@/modules/commerce/components/CheckoutsCategories';
import { useState } from 'react';

import { GET_CATEGORY_LIST } from '@/modules/commerce/hooks/useCategoryList';
import CreateCategoryFormDialog from '@dexkit/ui/modules/commerce/components/dialogs/CreateCategoryFormDialog';
import Add from '@mui/icons-material/Add';
import { useQueryClient } from '@tanstack/react-query';

export default function CommerceCategoriesPage() {
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
        <CreateCategoryFormDialog
          DialogProps={{ open, onClose: handleClose }}
          onRefetch={async () => {
            await queryClient.refetchQueries([GET_CATEGORY_LIST]);
          }}
        />
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6">
              <FormattedMessage id="categories" defaultMessage="Categories" />
            </Typography>
            <Typography variant="body1">
              <FormattedMessage
                id="create.categories.description.text"
                defaultMessage="Create categories to organize your products for easier management."
              />
            </Typography>
          </Box>
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
