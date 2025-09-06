export const dynamic = 'force-dynamic';

import {
  Box,
  Divider,
  Grid,
  Paper,
  Tab,
  TablePagination,
  Tabs,
  Typography
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { PageHeader } from '@dexkit/ui/components/PageHeader';

export default function NotificationsPageComponent() {
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
                  id="notifications"
                  defaultMessage="Notifications"
                />
              ),
              uri: '/u/account/commerce/notifications',
              active: true,
            },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">
          <FormattedMessage id="notifications" defaultMessage="Notifications" />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Tabs value="">
            <Tab
              value=""
              label={<FormattedMessage id="all" defaultMessage="All" />}
            />
            <Tab
              value="unread"
              label={<FormattedMessage id="unread" defaultMessage="Unread" />}
            />
            <Tab
              value="read"
              label={<FormattedMessage id="read" defaultMessage="Read" />}
            />
          </Tabs>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              <FormattedMessage id="loading.notifications" defaultMessage="Loading notifications..." />
            </Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <TablePagination
          component="div"
          count={0}
          page={0}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onPageChange={() => { }}
          rowsPerPage={10}
          onRowsPerPageChange={() => { }}
        />
      </Grid>
    </Grid>
  );
}
