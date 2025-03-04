import { ADMIN_TABLE_LIST } from '@/modules/admin/constants';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu as MuiMenu,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

export interface MenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

export default function Menu({ anchorEl, open, onClose, onAction }: MenuProps) {
  const handleAction = (action: string) => {
    return () => {
      onAction(action);
      onClose();
    };
  };

  return (
    <MuiMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      {ADMIN_TABLE_LIST.map((item, index) => {
        return (
          <MenuItem key={index} onClick={handleAction(item.value)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <Typography>
              <ListItemText
                primary={
                  <FormattedMessage
                    id={item.text.id}
                    defaultMessage={item.text.defaultMessage}
                  />
                }
              />
            </Typography>
          </MenuItem>
        );
      })}
    </MuiMenu>
  );
}
