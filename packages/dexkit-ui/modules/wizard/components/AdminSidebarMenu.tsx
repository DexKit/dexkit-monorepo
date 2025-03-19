import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useCallback, useState } from "react";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export interface AdminSidebarMenuProps {
  onToggle: () => void;
  open: boolean;
  icon: React.ReactNode;
  title: React.ReactNode;
  activeMenuId: string;
  isSiteOwner?: boolean;
  subtitle?: React.ReactNode;
  onSelectMenuId: (id: string) => void;
  options: {
    id: string;
    title: React.ReactNode;
    onlyOwner?: boolean;
    icon?: React.ReactNode;
    options?: {
      id: string;
      title: React.ReactNode;
      onlyOwner?: boolean;
    }[];
  }[];
}

export default function AdminSidebarMenu({
  icon,
  title,
  subtitle,
  open,
  onToggle,
  onSelectMenuId,
  activeMenuId,
  isSiteOwner,
  options,
}: AdminSidebarMenuProps) {
  const [openMenus, setOpenMenu] = useState<{ [key: string]: boolean }>({});

  const handleToggleMenu = useCallback((menu: string) => {
    return () => {
      setOpenMenu((value) => ({ ...value, [menu]: !Boolean(value[menu]) }));
    };
  }, []);

  const isMenuToggled = useCallback(
    (menu: string) => {
      return Boolean(openMenus[menu]);
    },
    [openMenus],
  );

  const renderOptions = () => {
    let opts = options;

    if (!isSiteOwner) {
      opts = opts.filter((o) => !Boolean(o.onlyOwner));
    }

    return options.map((opt) => {
      if (opt.options) {
        return (
          <List key={opt.id} disablePadding>
            <ListItemButton onClick={handleToggleMenu(opt.id)}>
              <ListItemIcon>{opt.icon}</ListItemIcon>
              <ListItemText primary={opt.title} />
              {isMenuToggled(opt.id) ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={isMenuToggled(opt.id)} timeout="auto" unmountOnExit>
              <List disablePadding>
                {opt.options.map((o) => (
                  <ListItemButton
                    key={o.id}
                    selected={activeMenuId === o.id}
                    onClick={() => onSelectMenuId(o.id)}
                  >
                    <ListItemIcon></ListItemIcon>
                    <ListItemText sx={{ ml: 4 }} primary={o.title} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>
        );
      }

      return (
        <ListItemButton
          key={opt.id}
          selected={activeMenuId === opt.id}
          onClick={() => onSelectMenuId(opt.id)}
        >
          <ListItemIcon></ListItemIcon>
          <ListItemText primary={opt.title} />
        </ListItemButton>
      );
    });
  };

  return (
    <List disablePadding>
      <ListItemButton dense={Boolean(subtitle)} onClick={onToggle}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={title}
          secondary={subtitle}
          secondaryTypographyProps={{ variant: "caption" }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>{renderOptions()}</List>
      </Collapse>
    </List>
  );
}
