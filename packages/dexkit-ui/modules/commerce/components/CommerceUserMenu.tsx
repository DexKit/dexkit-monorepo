import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccountsOutlined";
import { useCallback } from "react";

import LogoutIcon from "@mui/icons-material/Logout";

export interface CommerceUserMenuProps {
  enableCommerce?: boolean;
  onAction: (params: { action: string }) => void;
}

export default function CommerceUserMenu({
  enableCommerce,
  onAction,
}: CommerceUserMenuProps) {
  const handleAction = useCallback(
    (action: string) => {
      return () => {
        onAction({ action });
      };
    },
    [onAction],
  );

  return (
    <List disablePadding>
      {enableCommerce && (
        <>
          <ListItemButton onClick={handleAction("orders")}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <FormattedMessage id="my.orders" defaultMessage="My Orders" />
              }
            />
          </ListItemButton>
          {/* <ListItemButton onClick={handleAction("wishlist")}>
            <ListItemIcon>
              <FavoriteBorder />
            </ListItemIcon>
            <ListItemText
              primary={
                <FormattedMessage id="wishlist" defaultMessage="Wishlist" />
              }
            />
          </ListItemButton>
          <Divider /> */}
        </>
      )}
      <ListItemButton onClick={handleAction("profile")}>
        <ListItemIcon>
          <ManageAccountsIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <FormattedMessage id="my.profile" defaultMessage="My Profile" />
          }
        />
      </ListItemButton>
      <ListItemButton onClick={handleAction("logout")}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText
          primary={<FormattedMessage id="log.out" defaultMessage="Log out" />}
        />
      </ListItemButton>
    </List>
  );
}
