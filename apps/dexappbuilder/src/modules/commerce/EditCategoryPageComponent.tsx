import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Paper, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function EditCategoryPageComponent() {
  return (
    <Stack spacing={2}>
      <PageHeader
        breadcrumbs={[
          {
            caption: (
              <FormattedMessage id="commerce" defaultMessage="Commerce" />
            ),
            uri: '/u/account/commerce',
          },
          {
            caption: (
              <FormattedMessage id="categories" defaultMessage="Categories" />
            ),
            uri: '/u/account/commerce/categories',
          },
          {
            caption: (
              <FormattedMessage id="edit.category" defaultMessage="Edit Category" />
            ),
            uri: '/u/account/commerce/category/edit',
            active: true,
          },
        ]}
      />
      <Typography variant="h6">
        <FormattedMessage id="edit.category" defaultMessage="Edit Category" />
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          <FormattedMessage id="loading.category.edit" defaultMessage="Loading category edit form..." />
        </Typography>
      </Paper>
    </Stack>
  );
}
