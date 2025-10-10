import {
  Box,
  Button,
  Divider,
  Stack,
  Tab,
  TablePagination,
  Tabs,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

import NotificationsList from "@dexkit/ui/modules/commerce/components/NotificationsList";

import useNotifications from "@dexkit/ui/modules/commerce/hooks/useNotifications";
import useNotificationsCountUnread from "@dexkit/ui/modules/commerce/hooks/useNotificatonsCountUnread";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { AppConfirmDialog } from "../../../../components";
import useNotificationsMarkAllAsRead from "../../hooks/useNotificatonsMarkAllAsRead";
import DashboardLayout from "../layouts/DashboardLayout";

function Notifications() {
  const [filter, setFilter] = useState({ page: 0, pageSize: 10, status: "" });

  const { data: unread, refetch: refetchUnread } = useNotificationsCountUnread({
    scope: "Store",
  });

  const { mutateAsync: markAllAsRead } = useNotificationsMarkAllAsRead();

  const { data: notifications, refetch } = useNotifications({
    page: filter.page,
    limit: filter.pageSize,
    status: filter.status,
    scope: "Store",
  });

  const handleRefetch = async () => {
    await refetch();
    await refetchUnread();
  };

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilter((values) => ({
      ...values,
      pageSize: parseInt(event.target.value, 10),
    }));
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const handleClose = () => {
    setShowConfirm(false);
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleConfirm = async () => {
    try {
      await markAllAsRead({
        ids: notifications?.items.map((item: any) => item.id) ?? [],
      });
      enqueueSnackbar(
        <FormattedMessage
          id="all.notifications.are.read"
          defaultMessage="All notifications are read"
        />,
        {
          variant: "success",
        }
      );
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
    await refetch();
    setShowConfirm(false);
  };

  const handleMarkAllAsRead = async () => {
    setShowConfirm(true);
  };

  return (
    <>
      <AppConfirmDialog
        DialogProps={{
          open: showConfirm,
          onClose: handleClose,
          maxWidth: "sm",
          fullWidth: true,
        }}
        title={
          <FormattedMessage
            id="mark.all.notifications.as.read"
            defaultMessage="Mark notifications"
          />
        }
        onConfirm={handleConfirm}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="do.you.want.to.mark.all.as.read"
            defaultMessage="Do you want to mark all as read?"
          />
        </Typography>
      </AppConfirmDialog>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            <FormattedMessage
              id="notifications"
              defaultMessage="Notifications"
            />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <FormattedMessage
              id="view.all.notifications.of.actions.happening.in.your.store."
              defaultMessage="View all notifications of actions happening in your store."
            />
          </Typography>
        </Box>

        <Box>
          <Divider sx={{ mb: 2 }} />
          <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Tabs
              onChange={async (e, value) => {
                setFilter((filter) => ({ ...filter, page: 0, status: value }));
                await refetch();
              }}
              value={filter.status}
              sx={{ flex: 1 }}
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
            <Button onClick={handleMarkAllAsRead} size="small" variant="outlined">
              <FormattedMessage
                id="mark.all.as.read"
                defaultMessage="Mark all as read"
              />
            </Button>
          </Stack>
          <Divider />
        </Box>

        <Box>
          <NotificationsList
            onRefetch={handleRefetch}
            notifications={notifications?.items ?? []}
          />
        </Box>

        <Box>
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
            sx={{
              '& .MuiTablePagination-toolbar': {
                paddingLeft: 0,
                paddingRight: 0,
              }
            }}
          />
        </Box>
      </Stack>
    </>
  );
}

export default function NotificationsContainer() {
  return (
    <DashboardLayout page="notifications">
      <Notifications />
    </DashboardLayout>
  );
}
