import { Box, MenuItem } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface AIOptionsMenuProps {
  MenuProps: {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onBillingClick?: () => void;
  };
}

export default function AIOptionsMenu({ MenuProps }: AIOptionsMenuProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (menuRef.current) {
      if (MenuProps.open && MenuProps.anchorEl) {
        setTimeout(() => {
          const anchorRect = MenuProps.anchorEl!.getBoundingClientRect();
          const menu = menuRef.current!;
          
          menu.style.position = 'fixed';
          menu.style.top = `${anchorRect.bottom + 8}px`;
          menu.style.left = `${anchorRect.left}px`;
          menu.style.zIndex = '99999';
          menu.style.display = 'block';
          menu.style.backgroundColor = 'background.paper';
          menu.style.border = '1px solid divider';
          menu.style.borderRadius = '4px';
          menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          menu.style.minWidth = '200px';
          menu.style.width = 'auto';
          menu.style.height = 'auto';
        }, 100);
      } else {
        const menu = menuRef.current!;
        menu.style.display = 'none';
      }
    }
  }, [MenuProps.open, MenuProps.anchorEl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (MenuProps.open && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        MenuProps.onClose();
      }
    };

    if (MenuProps.open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [MenuProps.open, MenuProps.onClose]);
  
  if (!MenuProps.open || !MenuProps.anchorEl) {
    return null;
  }
  
  const menuContent = (
    <Box
      ref={menuRef}
      sx={{
        position: 'fixed',
        backgroundColor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: 3,
        minWidth: 200,
        zIndex: 99999,
        display: 'none',
      }}
    >
      <MenuItem 
        onClick={() => {
          if (MenuProps.onBillingClick) {
            MenuProps.onBillingClick();
          } else {
            MenuProps.onClose();
            router.push("/u/settings?section=billing");
          }
        }}
        sx={{
          py: 1.5,
          px: 2,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <FormattedMessage
          id="billing.and.usage"
          defaultMessage="Billing & Usage"
        />
      </MenuItem>
    </Box>
  );
  
  return createPortal(menuContent, document.body);
}
