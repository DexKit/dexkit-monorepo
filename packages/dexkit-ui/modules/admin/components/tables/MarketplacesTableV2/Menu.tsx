import { useIsMobile } from "@dexkit/core";
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu as MuiMenu,
  useTheme
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { ADMIN_TABLE_LIST } from "../../../constants";

export interface MenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

export default function Menu({ anchorEl, open, onClose, onAction }: MenuProps) {
  const isMobile = useIsMobile();
  const theme = useTheme();

  const handleAction = (action: string) => {
    return () => {
      onAction(action);
      onClose();
    };
  };

  return (
    <MuiMenu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            minWidth: isMobile ? theme.spacing(25) : theme.spacing(27.5),
            '& .MuiList-root': {
              padding: isMobile ? theme.spacing(0.5, 0) : theme.spacing(1, 0),
            }
          }
        }
      }}
    >
      {ADMIN_TABLE_LIST.map((item, index) => {
        return (
          <MenuItem
            key={index}
            onClick={handleAction(item.value)}
            sx={{
              py: isMobile ? theme.spacing(1.5) : theme.spacing(1),
              px: isMobile ? theme.spacing(2) : theme.spacing(1.5)
            }}
          >
            <ListItemIcon sx={{ minWidth: isMobile ? theme.spacing(4.5) : theme.spacing(5) }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={
                <FormattedMessage
                  id={item.text.id}
                  defaultMessage={item.text.defaultMessage}
                />
              }
              slotProps={{
                primary: {
                  sx: {
                    fontSize: isMobile ? theme.typography.body2.fontSize : 'inherit'
                  }
                }
              }}
            />
          </MenuItem>
        );
      })}
    </MuiMenu>
  );
}
