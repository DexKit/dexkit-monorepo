import { useRef } from "react";

import Link from "@dexkit/ui/components/AppLink";
import { MenuTree } from "@dexkit/ui/modules/wizard/types/config";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Avatar,
  Collapse,
  Divider,
  Icon,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  Stack,
  alpha,
  styled,
} from "@mui/material";
import List from "@mui/material/List";
import { useState } from "react";

interface DrawerMenuProps {
  menu: MenuTree[];
  onClose: any;
  isMini?: boolean;
}

const CustomListItemSecondaryAction = styled(ListItemSecondaryAction)(
  ({ theme }) => ({
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    height: "100%",
  })
);

export interface DrawerMenuItemProps {
  menu: MenuTree;
  onClose: () => void;
  depth: number;
  isMini?: boolean;
  onlyIcon?: boolean;
  disablePadding?: boolean;
  useMenu?: boolean;
  showDivider?: boolean;
}

export function DrawerMenuItem({
  menu,
  onClose,
  depth,
  isMini,
  disablePadding,
  useMenu,
  onlyIcon,
  showDivider,
}: DrawerMenuItemProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  const handleClose = () => {
    setOpen(false);
  };

  let renderMenu;

  if (menu.type === "Page") {
    renderMenu = (
      <ListItemButton
        sx={{
          display: "flex",
          flexDirection: "row",
          pl: disablePadding ? depth * 2 : undefined,
        }}
        onClick={onClose}
        component={Link}
        href={menu.href || "/"}
      >
        <Stack
          sx={{
            alignItem: "center",
            justifyContent: "center",
            mr: isMini ? 0 : 2,
            p: 0.5,
          }}
        >
          {menu.data?.iconName && <Icon>{menu.data?.iconName}</Icon>}
          {isMini && !menu.data?.iconName && depth === 1 && (
            <Avatar sx={{ width: "1.5rem", height: "1.5rem" }}>
              {menu.name.substring(0, 1)}
            </Avatar>
          )}
        </Stack>
        {!onlyIcon && (
          <ListItemText sx={{ fontWeight: 600 }} primary={menu.name} />
        )}
        <CustomListItemSecondaryAction
          sx={(theme) => ({
            [theme.breakpoints.up("sm")]: {
              display: "none",
            },
          })}
        >
          <ChevronRight color="primary" />
        </CustomListItemSecondaryAction>
      </ListItemButton>
    );
  }

  if (menu.type === "External") {
    renderMenu = (
      <ListItemButton
        sx={{
          display: "flex",
          flexDirection: "row",
          pl: disablePadding ? depth * 2 : undefined,
        }}
        onClick={onClose}
        component={Link}
        href={menu.href || "/"}
      >
        <Stack
          sx={{
            alignItem: "center",
            justifyContent: "center",
            mr: isMini ? 0 : 2,
            p: 0.5,
          }}
        >
          {menu.data?.iconName && <Icon>{menu.data?.iconName}</Icon>}
          {isMini && !menu.data?.iconName && depth === 1 && (
            <Avatar sx={{ width: "1.5rem", height: "1.5rem" }}>
              {menu.name.substring(0, 1)}
            </Avatar>
          )}
        </Stack>

        {!isMini && (
          <ListItemText sx={{ fontWeight: 600 }} primary={menu.name} />
        )}

        <CustomListItemSecondaryAction
          sx={(theme) => ({
            [theme.breakpoints.up("sm")]: {
              display: "none",
            },
          })}
        >
          <ChevronRight color="primary" />
        </CustomListItemSecondaryAction>
      </ListItemButton>
    );
  }

  if (menu.type === "Menu") {
    renderMenu = (
      <>
        <ListItemButton
          sx={{
            display: "flex",
            flexDirection: "row",
            pl: disablePadding ? depth * 2 : undefined,
          }}
          onClick={() => setOpen((value: boolean) => !value)}
          ref={(btnRef: HTMLElement | null) => {
            ref.current = btnRef;
          }}
        >
          <Stack
            sx={{
              alignItem: "center",
              justifyContent: "center",
              mr: isMini ? 0 : 2,
              p: 0.5,
            }}
          >
            {menu.data?.iconName && <Icon>{menu.data?.iconName}</Icon>}

            {isMini && !menu.data?.iconName && depth === 1 && (
              <Avatar sx={{ width: "1.5rem", height: "1.5rem" }}>
                {menu.name.substring(0, 1)}
              </Avatar>
            )}
          </Stack>
          {!isMini && <ListItemText primary={menu.name} />}
          {!onlyIcon && (
            <CustomListItemSecondaryAction>
              {!onlyIcon && isMini ? (
                open ? (
                  <KeyboardArrowLeftIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )
              ) : open ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </CustomListItemSecondaryAction>
          )}
        </ListItemButton>
        {useMenu ? (
          <Menu
            open={open}
            anchorEl={ref.current}
            anchorOrigin={{ horizontal: "right", vertical: "center" }}
            onClose={handleClose}
            MenuListProps={{ disablePadding: true }}
          >
            {menu.children?.map((child, key, arr) => (
              <DrawerMenuItem
                menu={child}
                key={key}
                onClose={onClose}
                depth={depth + 1}
                disablePadding={disablePadding}
                useMenu={useMenu}
                showDivider={key < arr.length - 1}
              />
            ))}
          </Menu>
        ) : (
          <Collapse in={open}>
            {menu.children?.map((child, key, arr) => (
              <DrawerMenuItem
                menu={child}
                onClose={onClose}
                depth={depth + 1}
                disablePadding={disablePadding}
                showDivider={key < arr.length - 1}
                key={key}
              />
            ))}
          </Collapse>
        )}
      </>
    );
  }

  return (
    <>
      {renderMenu || null}{" "}
      {showDivider && (
        <Divider
          sx={{
            display: "block",
            borderColor: (theme) => alpha(theme.palette.text.disabled, 0.1),
          }}
        />
      )}
    </>
  );
}

export default function DrawerMenu({ menu, onClose, isMini }: DrawerMenuProps) {
  return (
    <List disablePadding sx={{ display: "block" }}>
      {menu.map((m, key, arr) => (
        <DrawerMenuItem
          menu={m}
          key={key}
          onClose={onClose}
          depth={1}
          isMini={isMini}
          useMenu={isMini}
          onlyIcon={isMini}
          disablePadding={isMini}
          showDivider={key < arr.length - 1}
        />
      ))}
    </List>
  );
}
