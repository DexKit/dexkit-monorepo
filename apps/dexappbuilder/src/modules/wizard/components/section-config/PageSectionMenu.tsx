import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { SECTION_MENU_OPTIONS } from '../../constants/sections';

export interface PageSectionMenuProps {
  hideMobile?: boolean;
  isVisible?: boolean;
  hideDesktop?: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onAction: (action: string) => void;
}

export default function PageSectionMenu({
  hideMobile,
  hideDesktop,
  isVisible,
  anchorEl,
  onClose,
  onAction,
}: PageSectionMenuProps) {
  const menuArr = useMemo(() => {
    return SECTION_MENU_OPTIONS({ hideMobile, hideDesktop, isVisible });
  }, [hideMobile, hideDesktop, isVisible]);

  const handleMenuItemClick = (action: string) => {
    onAction(action);
    onClose();
  };

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      {menuArr.map((menu: any, index: any) => (
        <MenuItem
          value={menu.value}
          key={index}
          onClick={() => handleMenuItemClick(menu.value)}
        >
          <ListItemIcon>{menu.icon}</ListItemIcon>
          <ListItemText
            primary={
              <FormattedMessage
                key={menu.title.id}
                id={menu.title.id}
                defaultMessage={menu.title.defaultMessage}
              />
            }
          />
        </MenuItem>
      ))}
    </Menu>
  );
}
