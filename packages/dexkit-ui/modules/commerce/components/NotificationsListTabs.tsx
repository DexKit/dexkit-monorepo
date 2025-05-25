import { Stack, Tab, Tabs, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

export interface NotificationsListTabsProps {
  onChange: (tab: string) => void;
  value: string;
  unreadCount: number;
}

export default function NotificationsListTabs({
  onChange,
  value,
  unreadCount,
}: NotificationsListTabsProps) {
  return (
    <Tabs onChange={(e, value) => onChange(value)} value={value}>
      <Tab
        value=""
        label={<FormattedMessage id="all" defaultMessage="All" />}
      />
      <Tab
        value="unread"
        label={
          <Stack direction="row" alignItems="center" spacing={1}>
            {unreadCount > 0 && (
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
                {unreadCount}
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
  );
}
