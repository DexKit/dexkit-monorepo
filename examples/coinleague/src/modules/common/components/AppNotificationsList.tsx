import { List } from '@mui/material';
import { AppNotification } from '../types/app';
import AppNotificationsListItem from './AppNotificationsListItem';

interface Props {
  notifications: AppNotification[];
}

export default function AppNotificationsList({ notifications }: Props) {
  return (
    <List disablePadding>
      {notifications.map((n, index) => (
        <AppNotificationsListItem key={index} notification={n} />
      ))}
    </List>
  );
}
