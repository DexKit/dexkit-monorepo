import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Grid, Paper, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function CreateCategoryPageComponent() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
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
                <FormattedMessage
                  id="create.category"
                  defaultMessage="Create Category"
                />
              ),
              uri: '/u/account/commerce/categories/create',
              active: true,
            },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">
          <FormattedMessage
            id="create.category"
            defaultMessage="Create Category"
          />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            <FormattedMessage id="loading.category.form" defaultMessage="Loading category creation form..." />
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
