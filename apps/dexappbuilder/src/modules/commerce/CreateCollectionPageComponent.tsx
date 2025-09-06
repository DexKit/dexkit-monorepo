import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Grid, Paper, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function CreateCollectionPageComponent() {
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
                <FormattedMessage
                  id="collections"
                  defaultMessage="Collections"
                />
              ),
              uri: '/u/account/commerce/collections',
            },
            {
              caption: <FormattedMessage id="create" defaultMessage="Create" />,
              uri: '/u/account/commerce/collections/create',
              active: true,
            },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">
          <FormattedMessage id="create" defaultMessage="Create" />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            <FormattedMessage id="loading.collection.form" defaultMessage="Loading collection creation form..." />
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
