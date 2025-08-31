import { PageHeader } from '@dexkit/ui/components/PageHeader';
import Add from '@mui/icons-material/Add';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function CategoriesPageComponent() {
  return (
    <Stack spacing={2}>
      <PageHeader
        breadcrumbs={[
          {
            caption: <FormattedMessage id="home" defaultMessage="Home" />,
            uri: '/',
          },
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
            active: true,
          },
        ]}
      />
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
          variant="contained"
        >
          <FormattedMessage
            id="new.category"
            defaultMessage="New category"
          />
        </Button>
      </Box>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          <FormattedMessage id="loading.categories" defaultMessage="Loading categories..." />
        </Typography>
      </Paper>
    </Stack>
  );
}
