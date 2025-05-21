import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccountsOutlined";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useCallback } from "react";

export interface CommerceUserMenuProps {
  enableCommerce?: boolean;
  enableBilling?: boolean;
  onAction: (params: { action: string }) => void;
}

export default function CommerceUserMenu({
  enableCommerce,
  onAction,
  enableBilling,
}: CommerceUserMenuProps) {
  const handleAction = useCallback(
    (action: string) => {
      return () => {
        onAction({ action });
      };
    },
    [onAction]
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
      {enableBilling && (
        <ListItemButton onClick={handleAction("billing")}>
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText
            primary={<FormattedMessage id="billing" defaultMessage="Billing" />}
          />
        </ListItemButton>
      )}
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
