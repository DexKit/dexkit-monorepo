import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { alpha, Divider, Icon, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { MenuTree } from "../modules/wizard/types/config";
import Link from "./AppLink";

import LaunchIcon from "@mui/icons-material/Launch";

interface Props {
  menu: MenuTree;
  isPreview?: boolean;
  anchor?: HTMLElement | null;
  child?: boolean;
  ref?: (ref: HTMLElement | null) => void;
  customStyles?: {
    textColor?: string;
    hoverColor?: string;
    iconColor?: string;
    iconSize?: string;
    showIcons?: boolean;
  };
}

export interface MenuItemProps {
  item: MenuTree;
  customStyles?: {
    textColor?: string;
    hoverColor?: string;
    iconColor?: string;
    iconSize?: string;
    showIcons?: boolean;
  };
}

export function MenuItem({ item, customStyles }: MenuItemProps) {
  const menuRef = React.useRef<HTMLElement | null>(null);

  return (
    <NavbarMenu
      ref={(ref) => (menuRef.current = ref)}
      menu={item}
      anchor={menuRef.current}
      child
      customStyles={customStyles}
    />
  );
}

export default function NavbarMenu(props: Props) {
  const { menu, isPreview, anchor, child, customStyles } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (item: MenuTree, key: number) => {
    if (item.type === "Page") {
      return (
        <ListItemButton
          dense
          key={key}
          disabled={isPreview}
          LinkComponent={Link}
          href={item.href || ""}
        >
          {(customStyles?.showIcons !== false) && item.data?.iconName && (
            <ListItemIcon>
              <Icon
                sx={{
                  color: customStyles?.iconColor || 'inherit',
                  fontSize: customStyles?.iconSize === 'small' ? '1rem' : customStyles?.iconSize === 'large' ? '1.5rem' : '1.25rem',
                }}
              >
                {item.data?.iconName}
              </Icon>
            </ListItemIcon>
          )}

          <ListItemText primary={item.name} />
        </ListItemButton>
      );
    }

    if (item.type === "External") {
      return (
        <ListItemButton
          dense
          key={key}
          target="_blank"
          disabled={isPreview}
          LinkComponent={Link}
          href={item.href || ""}
        >
          <LaunchIcon fontSize="inherit" sx={{ mr: 2 }} />
          <ListItemText primary={item.name} />
        </ListItemButton>
      );
    }

    if (item.type === "Menu" && item.children) {
      return <MenuItem item={item} key={key} customStyles={customStyles} />;
    }
  };

  return (
    <>
      {child ? (
        <ListItemButton
          dense
          aria-controls={open ? "navbar-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          {(customStyles?.showIcons !== false) && menu.data?.iconName && (
            <ListItemIcon>
              <Icon
                sx={{
                  color: customStyles?.iconColor || 'inherit',
                  fontSize: customStyles?.iconSize === 'small' ? '1rem' : customStyles?.iconSize === 'large' ? '1.5rem' : '1.25rem',
                }}
              >
                {menu.data?.iconName}
              </Icon>
            </ListItemIcon>
          )}

          <ListItemText primary={menu.name} />
          <ExpandMoreIcon />
        </ListItemButton>
      ) : (
        <Button
          id="navbar-menu"
          aria-controls={open ? "navbar-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{
            fontWeight: 600,
            textDecoration: "none",
            color: customStyles?.textColor || "text.primary",
            textTransform: "none",
            fontSize: "inherit",
            '&:hover': {
              color: customStyles?.hoverColor || undefined,
            },
          }}
          startIcon={
            (customStyles?.showIcons !== false) && menu.data?.iconName ? (
              <Icon
                sx={{
                  color: customStyles?.iconColor || 'inherit',
                  fontSize: customStyles?.iconSize === 'small' ? '1rem' : customStyles?.iconSize === 'large' ? '1.5rem' : '1.25rem',
                }}
              >
                {menu.data?.iconName}
              </Icon>
            ) : undefined
          }
          endIcon={<ExpandMoreIcon />}
          onClick={handleClick}
        >
          <FormattedMessage
            id={menu.name.toLowerCase()}
            defaultMessage={menu.name}
          />
        </Button>
      )}
      <Menu
        id="navbar-menu"
        anchorEl={anchor ? anchor : anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={
          child
            ? { horizontal: "right", vertical: "center" }
            : { vertical: "bottom", horizontal: "left" }
        }
        MenuListProps={{
          "aria-labelledby": "navbar-menu",
          disablePadding: true,
        }}
      >
        {menu.children?.map((m, k, arr) => (
          <div key={k}>
            {renderMenu(m, k)}
            {k < arr.length - 1 && (
              <Divider
                sx={{
                  display: "block",
                  borderColor: (theme) =>
                    alpha(theme.palette.text.disabled, 0.1),
                }}
              />
            )}
          </div>
        ))}
      </Menu>
    </>
  );
}
