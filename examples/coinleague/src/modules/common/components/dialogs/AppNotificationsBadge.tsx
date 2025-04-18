import { Notifications } from '@mui/icons-material';
import { Badge } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  hasPendingTransactionsAtom,
  uncheckedNotificationsAtom,
} from '../../atoms';

export function AppNotificationsBadge() {
  const hasPendingTransactions = useAtomValue(hasPendingTransactionsAtom);

  const uncheckedNotifications = useAtomValue(uncheckedNotificationsAtom);

  return (
    <Badge
      variant={
        hasPendingTransactions && uncheckedNotifications.length === 0
          ? 'dot'
          : 'standard'
      }
      color="primary"
      badgeContent={
        uncheckedNotifications.length > 0
          ? uncheckedNotifications.length
          : undefined
      }
      invisible={!hasPendingTransactions && uncheckedNotifications.length === 0}
    >
      <Notifications />
    </Badge>
  );
}
