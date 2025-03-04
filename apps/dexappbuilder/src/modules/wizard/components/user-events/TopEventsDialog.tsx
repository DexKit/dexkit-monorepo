import { AppDialogTitle } from '@dexkit/ui';
import { USER_EVENT_NAMES } from '@dexkit/ui/constants/userEventNames';
import { CountFilter, useTopUserEvents } from '@dexkit/ui/hooks/userEvents';
import { Dialog, DialogContent, DialogProps, Divider } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import TopEventsList from './TopEventsList';

export interface TopEventsDialogProps {
  filters: CountFilter;
  DialogProps: DialogProps;
}

export default function TopEventsDialog({
  filters,
  DialogProps,
}: TopEventsDialogProps) {
  const topUserEventsQuery = useTopUserEvents({
    filters,
  });

  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  };

  const { formatMessage } = useIntl();

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="user.events" defaultMessage="User events" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <TopEventsList
          events={
            topUserEventsQuery.data
              ? topUserEventsQuery.data.map((e) => {
                  return {
                    count: e.count,
                    name: USER_EVENT_NAMES[e.name]
                      ? formatMessage({
                          id: USER_EVENT_NAMES[e.name].id,
                          defaultMessage:
                            USER_EVENT_NAMES[e.name].defaultMessage,
                        })
                      : e.name,
                  };
                })
              : []
          }
        />
      </DialogContent>
    </Dialog>
  );
}
