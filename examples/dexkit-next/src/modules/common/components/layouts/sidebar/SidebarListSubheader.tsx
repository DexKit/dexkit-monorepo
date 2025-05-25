import { ListSubheader } from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface Props {
  open: boolean;
  messageId: string;
  defaultMessage: string;
}

export default function SidebarListSubheader({
  open,
  messageId,
  defaultMessage,
}: Props) {
  return (
    <ListSubheader sx={{ display: open ? 'flex' : 'none' }} disableSticky>
      <FormattedMessage id={messageId} defaultMessage={defaultMessage} />
    </ListSubheader>
  );
}
