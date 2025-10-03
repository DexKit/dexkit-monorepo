import { useIsMobile } from "@dexkit/core";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useColorScheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useState } from "react";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isDarkMode',
})<{ isDarkMode?: boolean }>(({ theme, isDarkMode }) => ({
  backgroundColor: isDarkMode ? '#212529' : 'transparent',
  color: isDarkMode ? '#ffffff' : theme.palette.text.primary,
  "&.Mui-selected": {
    backgroundColor: isDarkMode ? '#404040' : theme.palette.grey[100],
    "&:hover": {
      backgroundColor: isDarkMode ? '#404040' : theme.palette.grey[200],
    },
  },
  "&:hover": {
    backgroundColor: isDarkMode ? '#404040' : theme.palette.action.hover,
  },
}));

const StyledListItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== 'isDarkMode',
})<{ isDarkMode?: boolean }>(({ theme, isDarkMode }) => ({
  color: isDarkMode ? '#ffffff' : theme.palette.text.primary,
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
  const { mode } = useColorScheme();
  const isDarkMode = mode === 'dark';

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
            <StyledListItemButton isDarkMode={isDarkMode} onClick={handleToggleMenu(opt.id)}>
              <StyledListItemIcon isDarkMode={isDarkMode}>{opt.icon}</StyledListItemIcon>
              <ListItemText primary={opt.title} />
              {isMenuToggled(opt.id) ? <ExpandLess /> : <ExpandMore />}
            </StyledListItemButton>
            <Collapse in={isMenuToggled(opt.id)} timeout="auto" unmountOnExit>
              <List disablePadding>
                {opt.options.map((o) => (
                  <StyledListItemButton
                    key={o.id}
                    isDarkMode={isDarkMode}
                    selected={activeMenuId === o.id}
                    onClick={() => {
                      onSelectMenuId(o.id);
                      if (isMobile) {
                        onToggle();
                        setOpenMenu({});
                      }
                    }}
                  >
                    <StyledListItemIcon isDarkMode={isDarkMode} />

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
          isDarkMode={isDarkMode}
          selected={activeMenuId === opt.id}
          onClick={() => {
            onSelectMenuId(opt.id);
            if (isMobile) {
              onToggle();
              setOpenMenu({});
            }
          }}
        >
          <StyledListItemIcon isDarkMode={isDarkMode} />
          <ListItemText primary={opt.title} />
          {opt.icon && <StyledListItemIcon isDarkMode={isDarkMode}>{opt.icon}</StyledListItemIcon>}
        </StyledListItemButton>
      );
    });
  };

  return (
    <List disablePadding>
      <StyledListItemButton isDarkMode={isDarkMode} dense={Boolean(subtitle)} onClick={onToggle}>
        <StyledListItemIcon isDarkMode={isDarkMode}>{icon}</StyledListItemIcon>
        <ListItemText
          primary={title}
          secondary={subtitle}
          secondaryTypographyProps={{
            variant: "caption",
            sx: {
              color: isDarkMode ? '#737372' : 'inherit',
            },
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
