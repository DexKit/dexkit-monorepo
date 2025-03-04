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
}

export default function PageSectionMenu({
  hideMobile,
  hideDesktop,
  isVisible,
  anchorEl,
  onClose,
}: PageSectionMenuProps) {
  const menuArr = useMemo(() => {
    return SECTION_MENU_OPTIONS({ hideMobile, hideDesktop, isVisible });
  }, [hideMobile, hideDesktop, isVisible]);

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      {menuArr.map((menu, index) => (
        <MenuItem value={menu.value} key={index}>
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
