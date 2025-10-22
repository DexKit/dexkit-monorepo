import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useMemo, useRef, useState } from "react";

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonBase,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  NoSsr,
  Popover,
  Stack,
  useColorScheme,
  useMediaQuery,
  useTheme
} from "@mui/material";

import AttachMoney from "@mui/icons-material/AttachMoney";
import Language from "@mui/icons-material/Language";
import NotificationsIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { FormattedMessage } from "react-intl";

import { WalletButton } from "@dexkit/ui/components/WalletButton";

import Wallet from "./icons/Wallet";

const SelectNetworkDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SelectNetworkDialog")
);

import { getChainLogoImage, getChainName } from "@dexkit/core/utils/blockchain";
import Link from "@dexkit/ui/components/AppLink";
import NotificationsDialog from "@dexkit/ui/components/dialogs/NotificationsDialog";
import { SearchBar } from "@dexkit/ui/components/SearchBar";
import SearchBarMobile from "@dexkit/ui/components/SearchBarMobile";
import { ThemeMode } from "@dexkit/ui/constants/enum";
import {
  useAuthUserQuery,
  useCurrency,
  useDexKitContext,
  useDrawerIsOpen,
  useLocale,
  useNavbarVariant,
  useNotifications,
  useSelectNetworkDialog,
  useShowAppTransactions,
  useShowSelectCurrency,
  useShowSelectLocale,
  useThemeMode
} from "@dexkit/ui/hooks";
import CommercePopover from "@dexkit/ui/modules/commerce/components/CommercePopover";
import { AppConfig, NavbarGlassSettings } from "@dexkit/ui/modules/wizard/types/config";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import { useSiteId } from "../hooks/useSiteId";
import CommerceCartIconButton from "../modules/commerce/components/CommerceCartIconButton";
import { ConnectWalletButton } from "./ConnectWalletButton";
import CustomNavbar from "./CustomNavbar";
import NavbarMenu from "./NavbarMenu";
import { ThemeModeSelector } from "./ThemeModeSelector";

interface Props {
  appConfig: AppConfig;
  isPreview?: boolean;
}

function Navbar({ appConfig, isPreview }: Props) {
  const { isActive, chainId } = useWeb3React();
  const siteId = useSiteId();
  const { mode } = useThemeMode();
  const { mode: colorSchemeMode } = useColorScheme();

  const buttonRef = useRef<HTMLElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [anchorMenuEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorMenuEl, setProfileMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const openMenu = Boolean(anchorMenuEl);
  const selectNetworkDialog = useSelectNetworkDialog();

  const handleCloseSelectNetworkDialog = () => {
    selectNetworkDialog.setIsOpen(false);
  };

  const handleOpenSelectNetworkDialog = () => {
    selectNetworkDialog.setIsOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const showSelectCurrency = useShowSelectCurrency();

  const showSelectLocale = useShowSelectLocale();

  const showAppTransactions = useShowAppTransactions();

  const handleOpenTransactions = () => showAppTransactions.setIsOpen(true);

  const isDrawerOpen = useDrawerIsOpen();

  const handleToggleDrawer = () => isDrawerOpen.setIsOpen(!isDrawerOpen.isOpen);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSettingsMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleSettingsMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleShowSelectCurrencyDialog = () => {
    showSelectCurrency.setIsOpen(true);
    handleSettingsMenuClose();
  };

  const handleShowSelectLocaleDialog = () => {
    showSelectLocale.setIsOpen(true);
    handleSettingsMenuClose();
  };

  const { currency } = useCurrency();

  const { locale } = useLocale();

  const {
    notifications,
    checkAllNotifications,
    transactions,
    clearNotifications,
    notificationTypes,
  } = useDexKitContext();

  const {
    filteredUncheckedTransactions,
    hasPendingTransactions,
    uncheckedTransactions,
  } = useNotifications();

  const handleCloseNotifications = () => {
    checkAllNotifications();
    showAppTransactions.setIsOpen(false);
  };

  const handleClearNotifications = () => {
    clearNotifications();
  };

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleShowProfileMenu = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setShowProfileMenu(true);
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const userQuery = useAuthUserQuery();
  const user = userQuery.data;

  const handleCloseProfileMenu = () => {
    setShowProfileMenu(false);
    setProfileMenuAnchorEl(null);
  };

  const { isCustom, customSettings } = useNavbarVariant(appConfig);

  const glassVariant =
    appConfig.menuSettings?.layout?.type === "navbar" &&
    appConfig.menuSettings?.layout?.variant === "glass";
  const glassSettings = glassVariant
    ? appConfig.menuSettings?.layout?.glassSettings || {}
    : {};

  const getGlassColorSchemeSettings = () => {
    const currentMode = colorSchemeMode === 'dark' ? 'dark' : 'light';
    return glassSettings.colorScheme?.[currentMode] || {};
  };

  const getGlassEffectiveColor = (colorKey: keyof NonNullable<NavbarGlassSettings['colorScheme']['light']>, fallback?: string): string | undefined => {
    const colorSchemeSettings = getGlassColorSchemeSettings();
    const colorValue = colorSchemeSettings[colorKey] || glassSettings[colorKey as keyof NavbarGlassSettings] || fallback;
    return typeof colorValue === 'string' ? colorValue : undefined;
  };

  const getGlassBackground = () => {
    if (!glassVariant || glassSettings.disableBackground) return 'transparent';

    const colorSchemeSettings = getGlassColorSchemeSettings();
    const { backgroundType, backgroundColor, backgroundImage, gradientStartColor, gradientEndColor, gradientDirection } = {
      ...glassSettings,
      backgroundColor: colorSchemeSettings.backgroundColor || glassSettings.backgroundColor,
      backgroundImage: colorSchemeSettings.backgroundImage || glassSettings.backgroundImage,
      gradientStartColor: colorSchemeSettings.gradientStartColor || glassSettings.gradientStartColor,
      gradientEndColor: colorSchemeSettings.gradientEndColor || glassSettings.gradientEndColor,
    };

    if (backgroundType === 'image' && backgroundImage) {
      return `url(${backgroundImage})`;
    } else if (backgroundType === 'gradient' && gradientStartColor && gradientEndColor) {
      return `linear-gradient(${gradientDirection || 'to bottom'}, ${gradientStartColor}, ${gradientEndColor})`;
    } else if (backgroundColor) {
      return backgroundColor;
    }

    const glassOpacity = glassSettings.glassOpacity ?? 0.1;
    const glassColor = colorSchemeMode === 'dark'
      ? `rgba(0,0,0,${glassOpacity})`
      : `rgba(255,255,255,${glassOpacity})`;
    return glassColor;
  };

  const glassStyles = useMemo(() => {
    if (!glassVariant) return {};

    const glassOpacity = glassSettings.glassOpacity ?? 0.1;

    return {
      background: getGlassBackground(),
      ...(glassSettings.backgroundType === 'image' && glassSettings.backgroundImage && {
        backgroundImage: getGlassBackground(),
        backgroundSize: glassSettings.backgroundSize || 'cover',
        backgroundPosition: glassSettings.backgroundPosition || 'center',
        backgroundRepeat: 'no-repeat',
      }),
      backdropFilter: `blur(${glassSettings.blurIntensity ?? 20}px)`,
      WebkitBackdropFilter: `blur(${glassSettings.blurIntensity ?? 20}px)`,
      boxShadow: `0 8px 32px 0 ${colorSchemeMode === 'dark'
        ? `rgba(31, 38, 135, ${glassOpacity * 3.7})`
        : `rgba(0, 0, 0, ${glassOpacity})`}`,
      border: `1px solid ${colorSchemeMode === 'dark'
        ? `rgba(255, 255, 255, ${glassOpacity * 1.8})`
        : `rgba(0, 0, 0, ${glassOpacity})`}`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      ...(glassSettings.borderRadius !== undefined && {
        borderRadius: `${glassSettings.borderRadius}px`,
      }),
    };
  }, [glassVariant, glassSettings, colorSchemeMode]);

  const getGlassOverlay = () => {
    if (!glassVariant || glassSettings.disableBackground) return {};

    if (glassSettings.backgroundType === 'image' && glassSettings.backgroundImage) {
      return {
        position: 'relative' as const,
        '&::before': {
          content: '""',
          position: 'absolute' as const,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: colorSchemeMode === 'dark'
            ? `rgba(0,0,0,${glassSettings.glassOpacity ?? 0.1})`
            : `rgba(255,255,255,${glassSettings.glassOpacity ?? 0.1})`,
          backdropFilter: `blur(${glassSettings.blurIntensity ?? 40}px)`,
          WebkitBackdropFilter: `blur(${glassSettings.blurIntensity ?? 40}px)`,
          pointerEvents: 'none' as const,
          zIndex: 1,
        },
        '& > *': {
          position: 'relative' as const,
          zIndex: 2,
        }
      };
    }

    return {};
  };

  const getLogoSize = () => {
    if (!glassVariant) {
      const defaultSize = isMobile ? 32 : 48;
      return {
        width: Math.max(1, Number(appConfig?.logo?.width || defaultSize)),
        height: Math.max(1, Number(appConfig?.logo?.height || defaultSize))
      };
    }

    const { logoSize, customLogoWidth, customLogoHeight } = glassSettings;

    let width, height;

    switch (logoSize) {
      case 'small':
        width = height = isMobile ? 16 : 32;
        break;
      case 'large':
        width = height = isMobile ? 32 : 64;
        break;
      case 'custom':
        width = isMobile ?
          Math.max(1, Number(customLogoWidth ? customLogoWidth / 2 : 16)) :
          Math.max(1, Number(customLogoWidth || 32));
        height = isMobile ?
          Math.max(1, Number(customLogoHeight ? customLogoHeight / 2 : 16)) :
          Math.max(1, Number(customLogoHeight || 32));
        break;
      default:
        width = height = isMobile ? 24 : 48;
        break;
    }

    return {
      width: Math.max(1, Number(width)),
      height: Math.max(1, Number(height))
    };
  };

  const organizeNavbarElements = () => {
    if (!glassVariant) return null;

    const logoSizes = getLogoSize();

    const logoElement = appConfig.logoDark && appConfig.logoDark?.url && mode === ThemeMode.dark ? (
      <Link href={isPreview ? "#" : "/"} key="logo">
        <Image
          src={appConfig?.logoDark?.url || ""}
          alt={appConfig.name}
          title={appConfig.name}
          height={logoSizes.height}
          width={logoSizes.width}
        />
      </Link>
    ) : appConfig?.logo ? (
      <Link href={isPreview ? "#" : "/"} key="logo">
        <Image
          src={appConfig?.logo.url}
          alt={appConfig.name}
          title={appConfig.name}
          width={logoSizes.width}
          height={logoSizes.height}
        />
      </Link>
    ) : (
      <Link
        sx={{ textDecoration: "none" }}
        variant="h6"
        color="primary"
        href={isPreview ? "#" : "/"}
        key="logo"
      >
        {appConfig.name}
      </Link>
    );

    const menuElement = appConfig.menuTree ? (
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        key="menu"
      >
        {appConfig.menuTree.map((m, key) =>
          m.children ? (
            <NavbarMenu
              menu={m}
              key={key}
              isPreview={isPreview}
              customStyles={{
                textColor: glassVariant ? getGlassEffectiveColor('textColor', glassSettings.textColor) : undefined,
                iconColor: glassVariant ? getGlassEffectiveColor('iconColor', glassSettings.iconColor) : undefined,
                showIcons: true,
              }}
            />
          ) : (
            <Button
              color="inherit"
              href={isPreview ? "#" : m.href || "/"}
              sx={{
                fontWeight: 600,
                textDecoration: "none",
                textTransform: "none",
                fontSize: "inherit",
                ...(glassVariant && {
                  color: getGlassEffectiveColor('textColor', glassSettings.textColor),
                }),
              }}
              key={key}
              LinkComponent={Link}
              startIcon={
                m.data?.iconName ? (
                  <Icon sx={{
                    ...(glassVariant && {
                      color: getGlassEffectiveColor('iconColor', glassSettings.iconColor),
                    }),
                  }}>{m.data?.iconName}</Icon>
                ) : undefined
              }
            >
              {m.name}
            </Button>
          )
        )}
      </Stack>
    ) : null;

    const actionsElement = (
      <Stack direction="row" alignItems="center" spacing={2} key="actions">
        {isActive && (
          <ButtonBase
            onClick={handleShowProfileMenu}
            sx={{
              borderRadius: "50%",
              ...(glassVariant && {
                color: getGlassEffectiveColor('iconColor', glassSettings.iconColor),
              }),
            }}
          >
            <Avatar
              sx={{ height: "1.5rem", width: "1.5rem" }}
              src={user?.profileImageURL}
            />
          </ButtonBase>
        )}

        {!isActive ? (
          <ConnectWalletButton />
        ) : (
          <WalletButton />
        )}

        {appConfig.commerce?.enabled && (
          <NoSsr>
            <CommerceCartIconButton
              iconColor={glassVariant ? getGlassEffectiveColor('iconColor', glassSettings.iconColor) : undefined}
            />
          </NoSsr>
        )}
        <NoSsr>
          <IconButton
            onClick={handleOpenTransactions}
            aria-label="notifications"
            sx={{
              ...(glassVariant && {
                color: getGlassEffectiveColor('iconColor', glassSettings.iconColor),
              }),
            }}
          >
            <Badge
              variant={
                hasPendingTransactions &&
                  filteredUncheckedTransactions.length === 0
                  ? "dot"
                  : "standard"
              }
              color="primary"
              badgeContent={
                filteredUncheckedTransactions.length > 0
                  ? filteredUncheckedTransactions.length
                  : undefined
              }
              invisible={
                !hasPendingTransactions &&
                filteredUncheckedTransactions.length === 0
              }
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </NoSsr>
        <IconButton
          onClick={handleSettingsMenuClick}
          aria-label="settings"
          sx={{
            ...(glassVariant && {
              color: getGlassEffectiveColor('iconColor', glassSettings.iconColor),
            }),
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Stack>
    );

    const positions: { [key: string]: any[] } = {
      left: [],
      'center-left': [],
      center: [],
      'center-right': [],
      right: []
    };

    const logoPos = (glassSettings.logoPosition || 'left') as 'left' | 'center' | 'right' | 'center-left' | 'center-right';
    const menuPos = (glassSettings.menuPosition || 'center') as 'left' | 'center' | 'right' | 'center-left' | 'center-right';
    const actionsPos = (glassSettings.actionsPosition || 'right') as 'left' | 'center' | 'right' | 'center-left' | 'center-right';

    if (logoElement) positions[logoPos].push(logoElement);
    if (menuElement) positions[menuPos].push(menuElement);
    if (actionsElement) positions[actionsPos].push(actionsElement);

    return positions;
  };

  const renderElementsInPosition = (position: string, elements: any[]) => {
    if (elements.length === 0) return null;

    const getJustifyContent = (pos: string) => {
      switch (pos) {
        case 'left':
        case 'center-left':
          return 'flex-start';
        case 'center':
          return 'center';
        case 'right':
        case 'center-right':
          return 'flex-end';
        default:
          return 'flex-start';
      }
    };

    const isCenterPosition = position === 'center';
    const flexGrow = isCenterPosition ? 2 : 1;

    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          flexGrow,
          justifyContent: getJustifyContent(position),
          px: position === 'center-left' || position === 'center-right' ? 2 : 0,
          ...(isCenterPosition && {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }),
        }}
      >
        {elements.map((element, index) => (
          <Box key={`${position}-${index}`}>{element}</Box>
        ))}
      </Stack>
    );
  };

  const positions = organizeNavbarElements();
  const { left = [], 'center-left': centerLeft = [], center = [], 'center-right': centerRight = [], right = [] } = positions || {};

  if (isCustom && customSettings) {
    return <CustomNavbar appConfig={appConfig} isPreview={isPreview} customSettings={customSettings} />;
  }

  return (
    <>
      <CommercePopover
        PopoverProps={{
          open: showProfileMenu,
          onClose: handleCloseProfileMenu,
          anchorEl: profileAnchorMenuEl,
          anchorOrigin: { horizontal: "left", vertical: "bottom" },
        }}
        enableCommerce={appConfig.commerce?.enabled}
        enableBilling={!!siteId}
      />
      <Menu
        id="settings-menu"
        anchorEl={anchorMenuEl}
        open={openMenu}
        onClose={handleSettingsMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleShowSelectLocaleDialog}>
          <ListItemIcon>
            <Language />
          </ListItemIcon>
          <ListItemText
            primary={
              <FormattedMessage id="language" defaultMessage="Language" />
            }
            secondary={
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ fontWeight: 600 }}
              >
                {locale}
              </Typography>
            }
          />
        </MenuItem>
        <MenuItem onClick={handleShowSelectCurrencyDialog}>
          <ListItemIcon>
            <AttachMoney />
          </ListItemIcon>
          <ListItemText
            primary={
              <FormattedMessage id="currency" defaultMessage="Currency" />
            }
            secondary={
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ fontWeight: 600 }}
              >
                {currency.toUpperCase()}
              </Typography>
            }
          />
        </MenuItem>
        <MenuItem>
          <ThemeModeSelector />
        </MenuItem>
      </Menu>
      {/* <AppTransactionsDialog
        dialogProps={{
          maxWidth: 'sm',
          open: showTransactions,
          fullWidth: true,
          onClose: handleCloseNotifications,
        }}
      /> */}
      {showAppTransactions.isOpen && (
        <NotificationsDialog
          DialogProps={{
            maxWidth: "sm",
            open: showAppTransactions.isOpen,
            fullWidth: true,
            onClose: handleCloseNotifications,
          }}
          notificationTypes={notificationTypes}
          transactions={transactions}
          notifications={notifications}
          onClear={handleClearNotifications}
        />
      )}
      {selectNetworkDialog.isOpen && (
        <SelectNetworkDialog
          dialogProps={{
            maxWidth: "sm",
            open: selectNetworkDialog.isOpen,
            fullWidth: true,
            onClose: handleCloseSelectNetworkDialog,
          }}
        />
      )}
      <Popover
        open={menuOpen}
        onClose={handleCloseMenu}
        anchorEl={buttonRef.current}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <Divider />
        <List disablePadding>
          <ListItem button component={Link} href={isPreview ? "#" : "/wallet"}>
            <ListItemIcon>
              <Wallet />
            </ListItemIcon>
            <ListItemText
              primary={<FormattedMessage id="wallet" defaultMessage="Wallet" />}
            />
          </ListItem>
          {/* <ListItem button onClick={handleDisconnect}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary="Disconnect" />
          </ListItem> */}
        </List>
      </Popover>
      <AppBar
        variant="elevation"
        color="default"
        position="sticky"
        sx={{
          zIndex: 10,
          backgroundColor: 'background.paper',
          ...glassStyles,
          ...(glassVariant && {
            ...getGlassOverlay(),
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: colorSchemeMode === 'dark'
                ? `linear-gradient(135deg, rgba(0, 0, 0, ${glassSettings.glassOpacity ?? 0.1}) 0%, rgba(0, 0, 0, ${(glassSettings.glassOpacity ?? 0.1) * 0.5}) 100%)`
                : `linear-gradient(135deg, rgba(255, 255, 255, ${glassSettings.glassOpacity ?? 0.1}) 0%, rgba(255, 255, 255, ${(glassSettings.glassOpacity ?? 0.1) * 0.5}) 100%)`,
              backdropFilter: `blur(${glassSettings.blurIntensity ?? 20}px)`,
              WebkitBackdropFilter: `blur(${glassSettings.blurIntensity ?? 20}px)`,
              pointerEvents: 'none',
              zIndex: 1,
            },
            '& > *': {
              position: 'relative',
              zIndex: 2,
            }
          }),
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            py: isMobile ? 0.5 : 1,
            height: isMobile ? 56 : 64,
            color: glassVariant ? getGlassEffectiveColor('textColor', glassSettings.textColor) : 'inherit',
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            minHeight: isMobile ? 56 : 64,
            ...(glassSettings.borderRadius !== undefined && glassSettings.borderRadius > 0 && {
              borderRadius: `${glassSettings.borderRadius}px`,
              overflow: 'hidden',
            }),
            ...(glassVariant && {
              background: 'transparent',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
            }),
          }}
        >
          {isMobile && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: isMobile ? '56px' : '64px'
            }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: isMobile ? 1.5 : 2,
                  minWidth: '44px',
                  minHeight: '44px',
                  color: 'text.primary',
                  ...(glassVariant && {
                    color: getGlassEffectiveColor('iconColor', glassSettings.iconColor),
                  }),
                }}
                onClick={handleToggleDrawer}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
          {!isMobile && glassVariant ? (
            <>
              {renderElementsInPosition('left', left)}
              {renderElementsInPosition('center-left', centerLeft)}
              {renderElementsInPosition('center', center)}
              {renderElementsInPosition('center-right', centerRight)}
              {renderElementsInPosition('right', right)}
            </>
          ) : glassVariant && isMobile ? (
            <>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: isMobile ? '56px' : '64px',
                maxWidth: '200px',
                overflow: 'hidden',
                '& img': {
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  verticalAlign: 'middle'
                },
                '& a': {
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%'
                }
              }}>
                {appConfig.logoDark && appConfig.logoDark?.url && mode === ThemeMode.dark ? (
                  <Link href={isPreview ? "#" : "/"}>
                    <Image
                      src={appConfig?.logoDark?.url || ""}
                      alt={appConfig.name}
                      title={appConfig.name}
                      height={getLogoSize().height}
                      width={getLogoSize().width}
                    />
                  </Link>
                ) : appConfig?.logo ? (
                  <Link href={isPreview ? "#" : "/"}>
                    <Image
                      src={appConfig?.logo.url}
                      alt={appConfig.name}
                      title={appConfig.name}
                      width={getLogoSize().width}
                      height={getLogoSize().height}
                    />
                  </Link>
                ) : (
                  <Link
                    sx={{ textDecoration: "none" }}
                    variant="h6"
                    color="primary"
                    href={isPreview ? "#" : "/"}
                  >
                    {appConfig.name}
                  </Link>
                )}
              </Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={isMobile ? 0.5 : 1}
                sx={{
                  justifyContent: 'flex-end',
                  flexGrow: 1,
                  ml: 2
                }}
              >
                {isActive && (
                  <ButtonBase
                    onClick={handleShowProfileMenu}
                    sx={{
                      borderRadius: "50%",
                      minWidth: '44px',
                      minHeight: '44px',
                      ...(glassVariant && {
                        color: getGlassEffectiveColor('iconColor', glassSettings.iconColor),
                      }),
                    }}
                  >
                    <Avatar
                      sx={{
                        height: isMobile ? "1.25rem" : "1.5rem",
                        width: isMobile ? "1.25rem" : "1.5rem"
                      }}
                      src={user?.profileImageURL}
                    />
                  </ButtonBase>
                )}
                {appConfig.commerce?.enabled && (
                  <NoSsr>
                    <CommerceCartIconButton
                      iconColor={glassVariant ? getGlassEffectiveColor('iconColor', glassSettings.iconColor) : undefined}
                    />
                  </NoSsr>
                )}
                <NoSsr>
                  <IconButton
                    onClick={handleOpenTransactions}
                    aria-label="notifications"
                    sx={{
                      minWidth: '44px',
                      minHeight: '44px',
                      ...(glassVariant && {
                        color: getGlassEffectiveColor('iconColor', glassSettings.iconColor),
                      }),
                    }}
                  >
                    <Badge
                      variant={
                        hasPendingTransactions &&
                          filteredUncheckedTransactions.length === 0
                          ? "dot"
                          : "standard"
                      }
                      color="primary"
                      badgeContent={
                        filteredUncheckedTransactions.length > 0
                          ? filteredUncheckedTransactions.length
                          : undefined
                      }
                      invisible={
                        !hasPendingTransactions &&
                        filteredUncheckedTransactions.length === 0
                      }
                    >
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </NoSsr>
                <IconButton
                  onClick={handleSettingsMenuClick}
                  aria-label="settings"
                  sx={{
                    minWidth: '44px',
                    minHeight: '44px',
                    ...(glassVariant && {
                      color: getGlassEffectiveColor('iconColor', glassSettings.iconColor),
                    }),
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Stack>
            </>
          ) : (
            <>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: '100%',
                minHeight: isMobile ? '56px' : '64px',
                maxWidth: '200px',
                overflow: 'hidden',
                '& img': {
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  verticalAlign: 'middle'
                },
                '& a': {
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%'
                }
              }}>
                {appConfig.logoDark && appConfig.logoDark?.url && mode === ThemeMode.dark ? (
                  <Link href={isPreview ? "#" : "/"}>
                    <Image
                      src={appConfig?.logoDark?.url || ""}
                      alt={appConfig.name}
                      title={appConfig.name}
                      height={isMobile ?
                        (appConfig?.logoDark?.heightMobile ?
                          Math.max(1, Number(appConfig?.logoDark?.heightMobile) || 48) :
                          Math.max(1, Number(appConfig?.logoDark?.height || appConfig?.logo?.height || 48) / 2)
                        ) :
                        (appConfig?.logoDark?.heightMobile ?
                          Math.max(1, Number(appConfig?.logoDark?.heightMobile) || 48) :
                          Math.max(1, Number(appConfig?.logoDark?.height || appConfig?.logo?.height || 48))
                        )
                      }
                      width={isMobile ?
                        (appConfig?.logoDark?.widthMobile ?
                          Math.max(1, Number(appConfig?.logoDark?.widthMobile) || 48) :
                          Math.max(1, Number(appConfig?.logoDark?.width || appConfig?.logo?.width || 48) / 2)
                        ) :
                        (appConfig?.logoDark?.widthMobile ?
                          Math.max(1, Number(appConfig?.logoDark?.widthMobile) || 48) :
                          Math.max(1, Number(appConfig?.logoDark?.width || appConfig?.logo?.width || 48))
                        )
                      }
                    />
                  </Link>
                ) : appConfig?.logo ? (
                  <Link href={isPreview ? "#" : "/"}>
                    <Image
                      src={appConfig?.logo.url}
                      alt={appConfig.name}
                      title={appConfig.name}
                      width={isMobile ?
                        (appConfig?.logo?.widthMobile ?
                          Math.max(1, Number(appConfig?.logo?.widthMobile) || 48) :
                          Math.max(1, Number(appConfig?.logo?.width || 48) / 2)
                        ) :
                        (appConfig?.logo?.widthMobile ?
                          Math.max(1, Number(appConfig?.logo?.widthMobile) || 48) :
                          Math.max(1, Number(appConfig?.logo?.width || 48))
                        )
                      }
                      height={isMobile ?
                        (appConfig?.logo?.heightMobile ?
                          Math.max(1, Number(appConfig?.logo?.heightMobile) || 48) :
                          Math.max(1, Number(appConfig?.logo?.height || 48) / 2)
                        ) :
                        (appConfig?.logo?.heightMobile ?
                          Math.max(1, Number(appConfig?.logo?.heightMobile) || 48) :
                          Math.max(1, Number(appConfig?.logo?.height || 48))
                        )
                      }
                    />
                  </Link>
                ) : (
                  <Link
                    sx={{ textDecoration: "none" }}
                    variant="h6"
                    color="primary"
                    href={isPreview ? "#" : "/"}
                  >
                    {appConfig.name}
                  </Link>
                )}
              </Box>
              {appConfig?.searchbar?.enabled && !isMobile && (
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    flexGrow: 3,
                    display: { xs: "none", md: "flex" },
                    justifyContent: "center",
                    px: 2,
                  }}
                >
                  <SearchBar
                    hideCollections={appConfig?.searchbar?.hideCollections}
                    hideTokens={appConfig?.searchbar?.hideTokens}
                    isPreview={isPreview}
                  />
                </Stack>
              )}
              {isMobile && appConfig?.searchbar?.enabled && (
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    flexGrow: 3,
                    justifyContent: "flex-end",
                    px: 2,
                  }}
                >
                  <SearchBarMobile
                    hideCollections={appConfig?.searchbar?.hideCollections}
                    hideTokens={appConfig?.searchbar?.hideTokens}
                    isPreview={isPreview}
                  />
                </Stack>
              )}

              {isMobile && (
                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                  >
                    {isActive && (
                      <>
                        <NoSsr>
                          <IconButton
                            onClick={handleOpenTransactions}
                            aria-label="notifications"
                            sx={{
                              minWidth: '44px',
                              minHeight: '44px',
                              ...(glassVariant && {
                                color: getGlassEffectiveColor('iconColor', glassSettings.iconColor),
                              }),
                            }}
                          >
                            <Badge
                              variant={
                                hasPendingTransactions &&
                                  filteredUncheckedTransactions.length === 0
                                  ? "dot"
                                  : "standard"
                              }
                              color="primary"
                              badgeContent={
                                filteredUncheckedTransactions.length > 0
                                  ? filteredUncheckedTransactions.length
                                  : undefined
                              }
                              invisible={
                                !hasPendingTransactions &&
                                filteredUncheckedTransactions.length === 0
                              }
                            >
                              <NotificationsIcon />
                            </Badge>
                          </IconButton>
                        </NoSsr>
                        <IconButton
                          onClick={handleSettingsMenuClick}
                          aria-label="settings"
                          sx={{
                            minWidth: '44px',
                            minHeight: '44px',
                            ...(glassVariant && {
                              color: getGlassEffectiveColor('iconColor', glassSettings.iconColor),
                            }),
                          }}
                        >
                          <SettingsIcon />
                        </IconButton>
                      </>
                    )}
                  </Stack>
                </Box>
              )}
              <Stack
                direction="row"
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                  center: "right",
                  justifyContent: "flex-end",
                  px: 2,
                }}
                alignItems="center"
                spacing={2}
              >
                {(appConfig.menuSettings?.layout?.type === undefined ||
                  (appConfig.menuSettings?.layout?.type === "navbar" &&
                    (appConfig.menuSettings?.layout?.variant === "default" ||
                      appConfig.menuSettings?.layout?.variant === undefined))) &&
                  appConfig.menuTree ? (
                  <Stack
                    direction="row"
                    sx={{
                      center: "right",
                      justifyContent: "flex-end",
                    }}
                    alignItems="center"
                    spacing={2}
                  >
                    {appConfig.menuTree.map((m, key) =>
                      m.children ? (
                        <NavbarMenu
                          menu={m}
                          key={key}
                          isPreview={isPreview}
                          customStyles={{
                            textColor: undefined,
                            iconColor: undefined,
                            showIcons: true,
                          }}
                        />
                      ) : (
                        <Button
                          color="inherit"
                          href={isPreview ? "#" : m.href || "/"}
                          sx={{
                            fontWeight: 600,
                            textDecoration: "none",
                            textTransform: "none",
                            fontSize: "inherit",
                          }}
                          key={key}
                          LinkComponent={Link}
                          startIcon={
                            m.data?.iconName ? (
                              <Icon sx={{
                                ...(glassVariant && {
                                  color: getGlassEffectiveColor('iconColor', glassSettings.iconColor),
                                }),
                              }}>{m.data?.iconName}</Icon>
                            ) : undefined
                          }
                        >
                          {m.name}
                        </Button>
                      )
                    )}
                  </Stack>
                ) : (
                  false && (
                    <Stack
                      direction="row"
                      sx={{
                        center: "right",
                        justifyContent: "flex-end",
                      }}
                      alignItems="center"
                      spacing={2}
                    >
                      <Link
                        color="inherit"
                        href={isPreview ? "#" : "/"}
                        sx={{ fontWeight: 600, textDecoration: "none" }}
                      >
                        <FormattedMessage id="home" defaultMessage="Home" />
                      </Link>
                      <Link
                        color="inherit"
                        href={isPreview ? "#" : "/swap"}
                        sx={{ fontWeight: 600, textDecoration: "none" }}
                      >
                        <FormattedMessage id="swap" defaultMessage="Swap" />
                      </Link>
                      {isActive && (
                        <Link
                          color="inherit"
                          href={isPreview ? "#" : "/wallet"}
                          sx={{ fontWeight: 600, textDecoration: "none" }}
                        >
                          <FormattedMessage id="wallet" defaultMessage="Wallet" />
                        </Link>
                      )}
                    </Stack>
                  )
                )}
                {isActive && (
                  <ButtonBase
                    onClick={handleShowProfileMenu}
                    sx={{ borderRadius: "50%" }}
                  >
                    <Avatar
                      sx={{ height: "1.5rem", width: "1.5rem" }}
                      src={user?.profileImageURL}
                    />
                  </ButtonBase>
                )}
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  alignContent="center"
                >
                  {/* <Button variant="outlined" color="primary">
                Buy ETH
              </Button> */}

                  {false && (
                    <ButtonBase
                      onClick={handleOpenSelectNetworkDialog}
                      sx={(theme) => ({
                        px: 2,
                        py: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: theme.spacing(1),
                      })}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          src={getChainLogoImage(chainId)}
                          sx={(theme) => ({
                            width: "auto",
                            height: theme.spacing(2),
                          })}
                          alt={getChainName(chainId) || ""}
                        />
                        <Typography variant="body1">
                          {getChainName(chainId)}
                        </Typography>
                        <KeyboardArrowDownIcon />
                      </Stack>
                    </ButtonBase>
                  )}

                  {!isActive ? (
                    <ConnectWalletButton />
                  ) : (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <WalletButton />

                      {appConfig.commerce?.enabled && (
                        <NoSsr>
                          <CommerceCartIconButton />
                        </NoSsr>
                      )}
                      <NoSsr>
                        <IconButton
                          onClick={handleOpenTransactions}
                          aria-label="notifications"
                        >
                          <Badge
                            variant={
                              hasPendingTransactions &&
                                filteredUncheckedTransactions.length === 0
                                ? "dot"
                                : "standard"
                            }
                            color="primary"
                            badgeContent={
                              filteredUncheckedTransactions.length > 0
                                ? filteredUncheckedTransactions.length
                                : undefined
                            }
                            invisible={
                              !hasPendingTransactions &&
                              filteredUncheckedTransactions.length === 0
                            }
                          >
                            <NotificationsIcon />
                          </Badge>
                        </IconButton>
                      </NoSsr>
                    </Stack>
                  )}

                  <IconButton
                    onClick={handleSettingsMenuClick}
                    aria-label="settings"
                  >
                    <SettingsIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
