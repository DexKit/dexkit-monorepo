import {
  ClickAwayListener,
  Divider,
  Paper,
  Popper,
  PopperProps,
  TablePagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useState } from "react";
import useNotifications from "../hooks/useNotifications";
import useNotificationsCountUnread from "../hooks/useNotificatonsCountUnread";
import NotificationsList from "./NotificationsList";
import NotificationsListTabs from "./NotificationsListTabs";

export interface NotificationsListPopperProps {
  PopperProps: PopperProps;
  onClose: () => void;
}

export default function NotificationsListPopper({
  PopperProps,
  onClose,
}: NotificationsListPopperProps) {
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

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Popper {...PopperProps}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={(theme) => ({ width: theme.breakpoints.values.sm * 0.75 })}>
          <NotificationsListTabs
            unreadCount={unread?.count ?? 0}
            onChange={(tab) =>
              setFilter((values) => ({ ...values, status: tab }))
            }
            value={filter.status}
          />
          <Divider />
          <NotificationsList
            onRefetch={handleRefetch}
            notifications={notifications?.items ?? []}
          />
          <Divider />
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
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
