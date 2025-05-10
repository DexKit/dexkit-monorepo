import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Box, Button, Stack, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import CollectionsTable from '@/modules/commerce/components/CollectionsTable';
import NextLink from 'next/link';
import { useState } from 'react';

export default function CommerceCategoriesPage() {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const { formatMessage } = useIntl();

  return (
    <>
      <DashboardLayout page="collections">
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
                  <FormattedMessage
                    id="collections"
                    defaultMessage="Collections"
                  />
                ),
                uri: '/u/account/commerce/collections',
                active: true,
              },
            ]}
          />
          <Box>
            <Typography variant="h6">
              <FormattedMessage id="collections" defaultMessage="Collections" />
            </Typography>
            <Typography color="text.secondary" variant="body1">
              <FormattedMessage
                id="create.collections.description.text"
                defaultMessage="Create collections to showcase themed or promotional product groups."
              />
            </Typography>
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              LinkComponent={NextLink}
              href="/u/account/commerce/collections/create"
              variant="contained"
            >
              <FormattedMessage id="create" defaultMessage="Create" />
            </Button>
          </Stack>
          <CollectionsTable />
        </Stack>
      </DashboardLayout>
    </>
  );
}
