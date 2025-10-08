import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Icon,
  Paper,
  Typography,
  useTheme
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { FormattedMessage } from "react-intl";
import { AppConfig } from "../modules/wizard/types/config";
import Link from "./AppLink";

interface Props {
  appConfig?: AppConfig;
  isPreview?: boolean;
}

export default function BottomBar({ appConfig, isPreview }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const [value, setValue] = React.useState(0);

  const bottomBarSettings = appConfig?.menuSettings?.layout?.bottomBarSettings || {};
  const menuTree = appConfig?.menuTree || [];

  const {
    showText = true,
    backgroundColor = theme.palette.background.paper,
    textColor = theme.palette.text.primary,
    activeColor = theme.palette.primary.main,
    iconSize = "medium",
    customIconSize,
    fontSize = 12,
    showBorder = true,
    borderColor = theme.palette.divider,
    elevation = 3,
  } = bottomBarSettings;

  const getIconSize = () => {
    if (customIconSize) return `${customIconSize}px`;
    switch (iconSize) {
      case "small":
        return "20px";
      case "large":
        return "32px";
      default:
        return "24px";
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const menuItem = menuTree[newValue];
    if (menuItem && !isPreview) {
      router.push(menuItem.href || "/");
    }
  };

  if (!menuTree.length) {
    return null;
  }

  const showAppSignature = !appConfig?.hide_powered_by;

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor,
        ...(showBorder && {
          borderTop: `1px solid ${borderColor}`,
        }),
      }}
      elevation={elevation}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        sx={{
          backgroundColor: "transparent",
          "& .MuiBottomNavigationAction-root": {
            color: textColor,
            minWidth: "auto",
            padding: "6px 12px 8px",
            "&.Mui-selected": {
              color: activeColor,
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: `${fontSize}px !important`,
              lineHeight: 1.2,
              marginTop: "2px",
              fontWeight: 500,
              color: `${textColor} !important`, // Force text color for all labels
              opacity: "1 !important", // Override MUI's opacity behavior
              ...(showText ? {} : { display: "none !important" }),
            },
            "&.Mui-selected .MuiBottomNavigationAction-label": {
              color: `${activeColor} !important`, // Active state for label
              opacity: "1 !important",
            },
            "& .MuiSvgIcon-root, & .MuiIcon-root": {
              fontSize: getIconSize(),
              color: `${textColor} !important`, // Force icon color
            },
            "&.Mui-selected .MuiSvgIcon-root, &.Mui-selected .MuiIcon-root": {
              color: `${activeColor} !important`, // Active state for icons
            },
          },
        }}
      >
        {menuTree.slice(0, 5).map((menuItem, index) => (
          <BottomNavigationAction
            key={index}
            label={
              showText ? (
                <FormattedMessage
                  id={menuItem.name.toLowerCase()}
                  defaultMessage={menuItem.name}
                />
              ) : undefined
            }
            icon={
              menuItem.data?.iconName ? (
                <Icon>{menuItem.data.iconName}</Icon>
              ) : null
            }
            component={isPreview ? "button" : Link}
            href={isPreview ? undefined : menuItem.href || "/"}
            sx={{
              ...(menuItem.href === router.pathname && {
                color: `${activeColor} !important`,
              }),
            }}
          />
        ))}
      </BottomNavigation>

      {showAppSignature && (
        <Box
          sx={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1001,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "10px",
              color: textColor,
              opacity: 0.7,
              whiteSpace: "nowrap",
            }}
          >
            <Link
              href={isPreview ? "#" : "https://www.dexkit.com"}
              target="_blank"
              color="inherit"
              sx={{
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Powered by DexKit
            </Link>
          </Typography>
        </Box>
      )}
    </Paper>
  );
} 