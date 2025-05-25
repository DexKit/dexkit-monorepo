import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import {
  Divider,
  Grid,
  Paper,
  Stack,
  Tab,
  TablePagination,
  Tabs,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import NotificationsList from '@dexkit/ui/modules/commerce/components/NotificationsList';

import useNotifications from '@dexkit/ui/modules/commerce/hooks/useNotifications';
import useNotificationsCountUnread from '@dexkit/ui/modules/commerce/hooks/useNotificatonsCountUnread';
import { useState } from 'react';

function NotificationsPageComponent() {
  const [filter, setFilter] = useState({ page: 0, pageSize: 10, status: '' });

  const { data: unread, refetch: refetchUnread } = useNotificationsCountUnread({
    scope: 'Store',
  });

  const { data: notifications, refetch } = useNotifications({
    page: filter.page,
    limit: filter.pageSize,
    status: filter.status,
    scope: 'Store',
  });

  const handleRefetch = async () => {
    await refetch();
    await refetchUnread();
  };

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFilter((values) => ({
      ...values,
      pageSize: parseInt(event.target.value, 10),
    }));
  };

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
          <Tabs
            onChange={async (e, value) => {
              setFilter((filter) => ({ ...filter, page: 0, status: value }));

              await refetch();
            }}
            value={filter.status}
          >
            <Tab
              value=""
              label={<FormattedMessage id="all" defaultMessage="All" />}
            />
            <Tab
              value="unread"
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  {unread?.count !== undefined && unread?.count > 0 && (
                    <Stack
                      justifyContent="center"
                      alignItems="center"
                      component="span"
                      sx={(theme) => ({
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                        px: 0.75,
                        py: 0.25,
                        borderRadius: theme.shape.borderRadius,
                      })}
                    >
                      {unread?.count}
                    </Stack>
                  )}
                  <Typography>
                    <FormattedMessage id="unread" defaultMessage="Unread" />
                  </Typography>
                </Stack>
              }
            />
            <Tab
              value="read"
              label={<FormattedMessage id="read" defaultMessage="Read" />}
            />
          </Tabs>
          <Divider />
          <NotificationsList
            onRefetch={handleRefetch}
            notifications={notifications?.items ?? []}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <TablePagination
          component="div"
          count={notifications?.totalItems ?? 0}
          page={notifications?.currentPage ?? 0}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onPageChange={(e, value) => {
            setFilter((values) => ({ ...values, page: value }));
          }}
          rowsPerPage={filter.pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </Grid>
  );
}

export default function NotificationsPage() {
  return (
    <DashboardLayout page="notifications">
      <NotificationsPageComponent />
    </DashboardLayout>
  );
}
