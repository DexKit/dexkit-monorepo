import { useIsMobile } from "@dexkit/core";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import React, { useCallback, useState } from "react";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark'
      ? theme.palette.action.selected
      : theme.palette.grey[100],
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.action.hover
        : theme.palette.grey[200],
    }
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? theme.palette.action.hover
      : theme.palette.grey[100],
  }
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: theme.palette.mode === 'dark'
    ? theme.palette.text.primary
    : 'inherit'
}));

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
  const isMobile = useIsMobile();

  const handleToggleMenu = useCallback((menu: string) => {
    return () => {
      setOpenMenu((value) => ({ ...value, [menu]: !Boolean(value[menu]) }));
    };
  }, []);

  const isMenuToggled = useCallback(
    (menu: string) => {
      return Boolean(openMenus[menu]);
    },
    [openMenus]
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
            <StyledListItemButton onClick={handleToggleMenu(opt.id)}>
              <StyledListItemIcon>{opt.icon}</StyledListItemIcon>
              <ListItemText primary={opt.title} />
              {isMenuToggled(opt.id) ? <ExpandLess /> : <ExpandMore />}
            </StyledListItemButton>
            <Collapse in={isMenuToggled(opt.id)} timeout="auto" unmountOnExit>
              <List disablePadding>
                {opt.options.map((o) => (
                  <StyledListItemButton
                    key={o.id}
                    selected={activeMenuId === o.id}
                    onClick={() => {
                      onSelectMenuId(o.id);
                      // En móviles, cerrar el menú después de seleccionar una opción
                      if (isMobile) {
                        onToggle();
                        // También cerramos los submenús
                        setOpenMenu({});
                      }
                    }}
                  >
                    <StyledListItemIcon />
                    <ListItemText sx={{ ml: 4 }} primary={o.title} />
                  </StyledListItemButton>
                ))}
              </List>
            </Collapse>
          </List>
        );
      }

      return (
        <StyledListItemButton
          key={opt.id}
          selected={activeMenuId === opt.id}
          onClick={() => {
            onSelectMenuId(opt.id);
            // En móviles, cerrar el menú después de seleccionar una opción
            if (isMobile) {
              onToggle();
              // También cerramos los submenús
              setOpenMenu({});
            }
          }}
        >
          <StyledListItemIcon />
          <ListItemText primary={opt.title} />
        </StyledListItemButton>
      );
    });
  };

  return (
    <List disablePadding>
      <StyledListItemButton dense={Boolean(subtitle)} onClick={onToggle}>
        <StyledListItemIcon>{icon}</StyledListItemIcon>
        <ListItemText
          primary={title}
          secondary={subtitle}
          secondaryTypographyProps={{
            variant: "caption",
            sx: {
              color: theme => theme.palette.mode === 'dark'
                ? theme.palette.text.secondary
                : 'inherit'
            }
          }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </StyledListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>{renderOptions()}</List>
      </Collapse>
    </List>
  );
}
