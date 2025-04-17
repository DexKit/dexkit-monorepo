import {
  notificationsAtom,
  transactionsAtom,
  uncheckedNotificationsAtom,
} from '@/modules/common/atoms/index';

import { Notifications } from '@mui/icons-material';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useAtom, useAtomValue } from 'jotai';
import { FormattedMessage } from 'react-intl';

import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';

import AppNotificationsList from '../AppNotificationsList';

interface Props {
  dialogProps: DialogProps;
}

export default function AppNotificationsDialog({ dialogProps }: Props) {
  const { onClose } = dialogProps;
  const { chainId } = useWeb3React();
  const [notifications, updateNotifications] = useAtom(notificationsAtom);
  const [transactions, updateTransactions] = useAtom(transactionsAtom);

  const uncheckedNotifications = useAtomValue(uncheckedNotificationsAtom);

  const handleClearNotifications = () => {
    updateNotifications([]);
    updateTransactions({});
  };

  const renderNotificationsList = () => {
    if (notifications.length === 0) {
      return (
        <Stack sx={{ py: 2 }} alignItems="center" justifyContent="center">
          <Typography variant="body1">
            <FormattedMessage
              id="nothing.to.see.here"
              defaultMessage="Nothing to see here"
            />
          </Typography>
        </Stack>
      );
    }

    return <AppNotificationsList notifications={notifications.reverse()} />;
  };

  const handleClose = () => {
    if (uncheckedNotifications.length > 0) {
      updateNotifications((n) => n.map((n) => ({ ...n, checked: true })));
    }

    onClose!({}, 'backdropClick');
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        icon={<Notifications />}
        title={
          <FormattedMessage
            id="notifications"
            defaultMessage="Notifications"
            description="Notifications"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>{renderNotificationsList()}</DialogContent>
      <DialogActions>
        {notifications.length > 0 && (
          <Button onClick={handleClearNotifications}>
            <FormattedMessage
              id="clear"
              defaultMessage="Clear"
              description="Clear button label"
            />
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
