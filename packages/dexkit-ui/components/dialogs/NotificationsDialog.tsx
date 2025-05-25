import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  alpha,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../AppDialogTitle";
import NotificationsList from "../NotificationsList";

import { AppTransaction } from "@dexkit/core/types";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { useState } from "react";
import { useNotifications } from "../../hooks";
import NotificationsTab from "../../modules/commerce/components/NotificationsTab";
import useNotificationsCountUnread from "../../modules/commerce/hooks/useNotificatonsCountUnread";
import { AppNotification, AppNotificationType } from "../../types/index";

import Inbox from "@mui/icons-material/Inbox";

export interface NotificationsDialogProps {
  DialogProps: DialogProps;
  onClear: () => void;
  notifications: AppNotification[];
  transactions: { [key: string]: AppTransaction };
  notificationTypes: { [key: string]: AppNotificationType };
}

export default function NotificationsDialog({
  DialogProps,
  notifications,
  transactions,
  notificationTypes,
  onClear,
}: NotificationsDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const [tab, setTab] = useState("app");

  const {
    filteredUncheckedTransactions,
    hasPendingTransactions,
    uncheckedTransactions,
  } = useNotifications();

  const { data: unread, refetch: refetchUnread } = useNotificationsCountUnread({
    scope: "Store",
  });

  return (
    <Dialog {...DialogProps} onClose={handleClose}>
      <AppDialogTitle
        icon={<NotificationsIcon />}
        title={
          <FormattedMessage id="notifications" defaultMessage="Notifications" />
        }
        onClose={handleClose}
      />
      <Divider />
      <Box sx={{ px: 2, py: 1 }}>
        <Tabs
          value={tab}
          sx={{
            "& .MuiTabs-indicator": { display: "none", height: 30 },
            minHeight: "auto",
          }}
          onChange={(e, value) => setTab(value)}
        >
          <Tab
            label={<FormattedMessage id="app" defaultMessage="App" />}
            icon={
              hasPendingTransactions &&
              filteredUncheckedTransactions.length === 0 ? (
                <Box sx={{ p: 1 }}>
                  <Badge
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    color="primary"
                    variant={
                      hasPendingTransactions &&
                      filteredUncheckedTransactions.length === 0
                        ? "dot"
                        : "standard"
                    }
                    badgeContent={
                      filteredUncheckedTransactions.length > 0
                        ? filteredUncheckedTransactions.length
                        : undefined
                    }
                    invisible={
                      !hasPendingTransactions &&
                      filteredUncheckedTransactions.length === 0
                    }
                  ></Badge>
                </Box>
              ) : (
                <Inbox fontSize="small" />
              )
            }
            iconPosition="start"
            value="app"
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius / 2,
              "&.Mui-selected": {
                background: (theme) => alpha(theme.palette.primary.main, 0.1),
              },
              minHeight: (theme) => theme.spacing(5),
              mr: 2,
              py: 0.5,
              px: 1,
            }}
          />
          <Tab
            value="commerce"
            icon={
              unread?.count ? (
                <Box sx={{ p: 1 }}>
                  <Badge
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    color="primary"
                    badgeContent={
                      unread?.count ? unread.count.toString() : undefined
                    }
                    invisible={Boolean(unread?.count || unread?.count === 0)}
                  ></Badge>
                </Box>
              ) : (
                <ShoppingCart />
              )
            }
            iconPosition="start"
            label={<FormattedMessage id="commerce" defaultMessage="Commerce" />}
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius / 2,
              "&.Mui-selected": {
                background: (theme) => alpha(theme.palette.primary.main, 0.1),
              },
              minHeight: (theme) => theme.spacing(5),
              py: 0.5,
              px: 1,
            }}
          />
        </Tabs>
      </Box>
      <DialogContent dividers sx={{ p: 0 }}>
        {tab === "app" && (
          <>
            {notifications.length > 0 ? (
              <NotificationsList
                notifications={notifications}
                transactions={transactions}
                notificationTypes={notificationTypes}
              />
            ) : (
              <Box sx={{ p: 2 }}>
                <Stack spacing={1} alignItems="center">
                  <NotificationsIcon fontSize="large" />
                  <Box>
                    <Typography textAlign="center" variant="h5">
                      <FormattedMessage
                        id="nothing.here"
                        defaultMessage="Nothing Here"
                      />
                    </Typography>
                    <Typography
                      textAlign="center"
                      variant="body1"
                      color="text.secondary"
                    >
                      <FormattedMessage
                        id="well.let.you.know.if.anything.comes.up."
                        defaultMessage="We'll let you know if anything comes up."
                      />
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}
          </>
        )}
        {tab === "commerce" && <NotificationsTab />}
      </DialogContent>
      {tab === "app" && (
        <DialogActions>
          <Button onClick={onClear} color="primary">
            <FormattedMessage id="clear" defaultMessage="Clear" />
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
