import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';

import Link from '@/modules/common/components/Link';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { FormattedMessage } from 'react-intl';

interface Props {
  open: boolean;
  icon: React.ReactNode | React.ReactNode[];
  messageId: string;
  defaultMessage: string;
  href: string;
}

export default function SidebarListItem({
  open,
  icon,
  messageId,
  defaultMessage,
  href,
}: Props) {
  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        LinkComponent={Link}
        href={href}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
        }}
      >
        <ListItemAvatar
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          <Avatar
            sx={{
              backgroundColor: (theme) => theme.palette.background.default,
              color: (theme) => theme.palette.primary.main,
            }}
          >
            {icon}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <FormattedMessage id={messageId} defaultMessage={defaultMessage} />
          }
          sx={{ opacity: open ? 1 : 0 }}
        />
        <ListItemSecondaryAction
          sx={{
            opacity: open ? 1 : 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          <ChevronRightIcon />
        </ListItemSecondaryAction>
      </ListItemButton>
    </ListItem>
  );
}
