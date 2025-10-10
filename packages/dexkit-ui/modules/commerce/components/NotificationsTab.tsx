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
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import useNotifications from "../hooks/useNotifications";
import useNotificationsCountUnread from "../hooks/useNotificatonsCountUnread";

import NotificationsList from "@dexkit/ui/modules/commerce/components/NotificationsList";
import { useSnackbar } from "notistack";
import { AppConfirmDialog } from "../../../components";
import useNotificationsMarkAllAsRead from "../hooks/useNotificatonsMarkAllAsRead";

export default function NotificationsTab() {
  const [filter, setFilter] = useState({ page: 0, pageSize: 10, status: "" });

  const { data: unread, refetch: refetchUnread } = useNotificationsCountUnread({
    scope: "Customer",
  });

  const { data: notifications, refetch } = useNotifications({
    page: filter.page,
    limit: filter.pageSize,
    status: filter.status,
    scope: "Customer",
  });

  const { mutateAsync: markAllAsRead } = useNotificationsMarkAllAsRead();

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
      await refetch();
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }

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
      <Box>
        <Stack alignItems="center" direction="row">
          <Tabs
            onChange={async (e, value) => {
              setFilter((filter) => ({ ...filter, page: 0, status: value }));

              await refetch();
            }}
            value={filter.status}
            sx={{
              mr: 2,
              '& .MuiTab-root': {
                color: 'text.primary',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
            }}
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
          <Button onClick={handleMarkAllAsRead} size="small">
            <FormattedMessage
              id="mark.all.as.read"
              defaultMessage="Mark all as read"
            />
          </Button>
        </Stack>
        <Divider />
        <NotificationsList
          onRefetch={handleRefetch}
          notifications={notifications?.items ?? []}
        />
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
            '& .MuiTablePagination-actions': {
              '& .MuiIconButton-root': {
                color: 'text.primary',
              },
            },
            '& .MuiTablePagination-selectLabel': {
              color: 'text.primary',
            },
            '& .MuiTablePagination-displayedRows': {
              color: 'text.primary',
            },
            '& .MuiTablePagination-select': {
              color: 'text.primary',
              '& .MuiSelect-icon': {
                color: 'text.primary',
              },
            },
          }}
        />
      </Box>
    </>
  );
}
