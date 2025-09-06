import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Paper, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function EditCollectionPageComponent() {
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
              <FormattedMessage id="collections" defaultMessage="Collections" />
            ),
            uri: '/u/account/commerce/collections',
          },
          {
            caption: (
              <FormattedMessage id="edit.collection" defaultMessage="Edit Collection" />
            ),
            uri: '/u/account/commerce/collections/edit',
            active: true,
          },
        ]}
      />
      <Typography variant="h6">
        <FormattedMessage id="edit.collection" defaultMessage="Edit Collection" />
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          <FormattedMessage id="loading.collection.edit" defaultMessage="Loading collection edit form..." />
        </Typography>
      </Paper>
    </Stack>
  );
}
