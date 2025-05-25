import Link from '@/modules/common/components/Link';
import { Error } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {
  Avatar,
  CircularProgress,
  Icon,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import moment from 'moment';
import { transactionsAtom } from '../atoms';
import { AppNotification, AppNotificationType } from '../types/app';
import { Transaction, TransactionStatus } from '../types/transactions';
import { getBlockExplorerUrl } from '../utils';
import MomentSpan from './MomentSpan';

interface Props {
  notification: AppNotification;
}

export default function AppNotificationsListItem({ notification }: Props) {
  const transactions = useAtomValue(transactionsAtom);

  if (notification.type === AppNotificationType.Transaction) {
    const transaction: Transaction | undefined =
      transactions[notification.hash];

    if (!transaction) {
      return null;
    }

    return (
      <ListItemButton
        divider
        component={Link}
        target="_blank"
        href={`${getBlockExplorerUrl(transaction.chainId)}/tx/${
          notification.hash
        }`}
      >
        <ListItemAvatar>
          <Avatar>
            <Icon color="action">{notification.icon}</Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={<Typography>{notification.title}</Typography>}
          secondaryTypographyProps={{ component: 'div' }}
          primaryTypographyProps={{
            component: 'div',
          }}
          secondary={
            <Stack>
              <Stack spacing={0.5} direction="row" alignItems="center">
                {!notification.checked && (
                  <FiberManualRecordIcon fontSize="small" color="primary" />
                )}
                <MomentSpan from={moment(new Date(notification.created))} />
              </Stack>
            </Stack>
          }
        />
        <ListItemSecondaryAction
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          {transaction.status === TransactionStatus.Pending ? (
            <CircularProgress size="1.5rem" />
          ) : transaction.status === TransactionStatus.Confirmed ? (
            <CheckCircleIcon />
          ) : transaction.status === TransactionStatus.Failed ? (
            <Error />
          ) : null}
        </ListItemSecondaryAction>
      </ListItemButton>
    );
  }

  return null;
}
