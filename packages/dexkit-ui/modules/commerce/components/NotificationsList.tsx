import {
  Avatar,
  Box,
  Icon,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { CommerceNotification } from "../types";

import NotificationsIcon from "@mui/icons-material/Notifications";
import useNotificationsMarkAsRead from "../hooks/useNotificatonsMarkAsRead";

import { useRouter } from "next/router";

export interface NotificationListProps {
  notifications: CommerceNotification[];
  onRefetch: () => void;
}

export default function NotificationList({
  notifications,
  onRefetch,
}: NotificationListProps) {
  const { mutateAsync: markAsRead } = useNotificationsMarkAsRead();

  const router = useRouter();

  const handleClick = useCallback((n: CommerceNotification) => {
    return async () => {
      if (n.metadata) {
        if (n.scope === "Store") {
          if (n.metadata.type === "order") {
            await router.push(
              `/u/account/commerce/orders/${n.metadata.orderId}`
            );
            await markAsRead({ id: n.id });
          }
          if (n.metadata.type === "payment") {
            await router.push(
              `/u/account/commerce/orders/${n.metadata.orderId}`
            );
            await markAsRead({ id: n.id });
          }
        } else {
          if (n.metadata.type === "order") {
            await router.push(`/c/orders/${n.metadata.orderId}`);
            await markAsRead({ id: n.id });
          }
          if (n.metadata.type === "payment") {
            await router.push(`/c/orders/${n.metadata.orderId}`);
            await markAsRead({ id: n.id });
          }
        }
      }

      onRefetch();
    };
  }, []);

  const renderIcon = useCallback((n: CommerceNotification) => {
    if (n.icon) {
      if (n.icon?.type === "icon") {
        return (
          <Avatar variant="rounded">
            <Icon>{n.icon.icon}</Icon>
          </Avatar>
        );
      }

      if (n.icon?.type === "url") {
        return <Avatar variant="rounded" src={n.icon.url} />;
      }
    }
    return (
      <Avatar variant="rounded">
        <NotificationsIcon />
      </Avatar>
    );
  }, []);

  if (notifications.length === 0) {
    return (
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
    );
  }

  return (
    <List dense disablePadding>
      {notifications.map((n, index, arr) => (
        <ListItemButton
          onClick={handleClick(n)}
          divider={index < arr.length - 1}
          key={index}
          alignItems="flex-start"
        >
          <ListItemAvatar>{renderIcon(n)}</ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{ fontWeight: "600" }}
            primary={
              <FormattedMessage
                id={n.title.id}
                defaultMessage={n.title.message}
                values={n.title.values}
              />
            }
            secondaryTypographyProps={{ color: "text.primary" }}
            secondary={
              <>
                <Typography gutterBottom variant="inherit">
                  <FormattedMessage
                    id={n.subtitle.id}
                    defaultMessage={n.subtitle.message}
                    values={
                      n.subtitle.values
                        ? Object.keys(n.subtitle.values).reduce(
                            (acc: any, key) => {
                              acc[key] = (
                                <strong>
                                  {n.subtitle.values?.[key] ?? ""}
                                </strong>
                              );

                              return acc;
                            },
                            {}
                          )
                        : undefined
                    }
                  />
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {moment(n.createdAt).fromNow()}
                </Typography>
              </>
            }
          />
          {!n.readAt && (
            <FiberManualRecordIcon
              color="primary"
              sx={{ alignSelf: "center" }}
            />
          )}
        </ListItemButton>
      ))}
    </List>
  );
}
