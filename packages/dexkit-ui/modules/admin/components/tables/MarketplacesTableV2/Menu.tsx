import { useIsMobile } from "@dexkit/core";
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu as MuiMenu,
  Typography,
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
            minWidth: isMobile ? 200 : 220,
            '& .MuiList-root': {
              padding: isMobile ? '4px 0' : '8px 0',
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
              py: isMobile ? 1.5 : 1,
              px: isMobile ? 2 : 1.5
            }}
          >
            <ListItemIcon sx={{ minWidth: isMobile ? 36 : 40 }}>{item.icon}</ListItemIcon>
            <Typography>
              <ListItemText
                primary={
                  <FormattedMessage
                    id={item.text.id}
                    defaultMessage={item.text.defaultMessage}
                  />
                }
                primaryTypographyProps={{
                  sx: {
                    fontSize: isMobile ? '0.9rem' : 'inherit'
                  }
                }}
              />
            </Typography>
          </MenuItem>
        );
      })}
    </MuiMenu>
  );
}
