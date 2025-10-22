import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import AttachMoney from "@mui/icons-material/AttachMoney";
import Language from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  ButtonBase,
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  NoSsr,
  Stack,
  Toolbar,
  Typography,
  useColorScheme,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Image from "next/legacy/image";
import React, { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import Link from "@dexkit/ui/components/AppLink";
import {
  useAuthUserQuery,
  useCurrency,
  useDrawerIsOpen,
  useLocale,
  useNotifications,
  useShowAppTransactions,
  useShowSelectCurrency,
  useShowSelectLocale
} from "@dexkit/ui/hooks";
import { useSiteId } from "@dexkit/ui/hooks/useSiteId";
import { AppConfig, NavbarCustomSettings } from "@dexkit/ui/modules/wizard/types/config";
import CommerceCartIconButton from "../modules/commerce/components/CommerceCartIconButton";
import CommercePopover from "../modules/commerce/components/CommercePopover";
import { ConnectWalletButton } from "./ConnectWalletButton";
import NavbarMenu from "./NavbarMenu";
import { ThemeModeSelector } from "./ThemeModeSelector";
import { WalletButton } from "./WalletButton";

interface Props {
  appConfig: AppConfig;
  isPreview?: boolean;
  customSettings: NavbarCustomSettings;
}

function CustomNavbar({ appConfig, isPreview, customSettings }: Props) {
  const { isActive } = useWeb3React();
  const { mode: colorSchemeMode } = useColorScheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDrawerOpen = useDrawerIsOpen();
  const userQuery = useAuthUserQuery();
  const user = userQuery.data;
  const siteId = useSiteId();
  const { filteredUncheckedTransactions, hasPendingTransactions } = useNotifications();
  const showAppTransactions = useShowAppTransactions();
  const showSelectCurrency = useShowSelectCurrency();
  const showSelectLocale = useShowSelectLocale();
  const { currency } = useCurrency();
  const { locale } = useLocale();
  const [profileAnchorMenuEl, setProfileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const openMenu = Boolean(menuAnchorEl);

  const handleToggleDrawer = () => isDrawerOpen.setIsOpen(!isDrawerOpen.isOpen);

  const handleShowProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowProfileMenu(true);
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setShowProfileMenu(false);
    setProfileMenuAnchorEl(null);
  };

  const handleOpenTransactions = () => showAppTransactions.setIsOpen(true);

  const handleSettingsMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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

  const getColorSchemeSettings = useMemo(() => {
    const currentMode = colorSchemeMode === 'dark' ? 'dark' : 'light';
    return customSettings.colorScheme?.[currentMode] || {};
  }, [colorSchemeMode, customSettings.colorScheme]);

  const getEffectiveColor = useMemo(() => {
    return (colorKey: keyof NonNullable<NavbarCustomSettings['colorScheme']['light']>, fallback?: string): string | undefined => {
      const colorSchemeSettings = getColorSchemeSettings;
      const colorValue = colorSchemeSettings[colorKey] || customSettings[colorKey as keyof NavbarCustomSettings] || fallback;
      return typeof colorValue === 'string' ? colorValue : undefined;
    };
  }, [getColorSchemeSettings, customSettings]);

  const getBackgroundStyles = useMemo(() => {
    const colorSchemeSettings = getColorSchemeSettings;

    const {
      backgroundType,
      backgroundColor,
      backgroundImage,
      gradientStartColor,
      gradientEndColor,
      gradientDirection,
      opacity,
      blurIntensity
    } = {
      ...customSettings,
      backgroundColor: colorSchemeSettings.backgroundColor || customSettings.backgroundColor,
      backgroundImage: colorSchemeSettings.backgroundImage || customSettings.backgroundImage,
      gradientStartColor: colorSchemeSettings.gradientStartColor || customSettings.gradientStartColor,
      gradientEndColor: colorSchemeSettings.gradientEndColor || customSettings.gradientEndColor,
    };

    let backgroundStyles: any = {};

    if (backgroundType === 'image' && backgroundImage) {
      backgroundStyles = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: customSettings.backgroundSize || 'cover',
        backgroundPosition: customSettings.backgroundPosition || 'center',
        backgroundRepeat: customSettings.backgroundRepeat || 'no-repeat',
        backgroundAttachment: customSettings.backgroundAttachment || 'scroll',
      };

      if (opacity !== undefined && opacity < 1) {
        backgroundStyles.position = 'relative';
        backgroundStyles['&::before'] = {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          ...(customSettings.borderRadius !== undefined && customSettings.borderRadius > 0 && {
            borderRadius: `${customSettings.borderRadius}px`,
          }),
          backgroundColor: colorSchemeMode === 'dark'
            ? `rgba(0, 0, 0, ${1 - opacity})`
            : `rgba(255, 255, 255, ${1 - opacity})`,
          pointerEvents: 'none',
          zIndex: 1,
        };
      }

      if (blurIntensity && blurIntensity > 0) {
        if (!backgroundStyles.position) {
          backgroundStyles.position = 'relative';
        }

        if (backgroundStyles['&::before']) {
          backgroundStyles['&::before'] = {
            ...backgroundStyles['&::before'],
            backdropFilter: `blur(${blurIntensity}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity}px)`,
          };
        } else {
          backgroundStyles['&::before'] = {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            ...(customSettings.borderRadius !== undefined && customSettings.borderRadius > 0 && {
              borderRadius: `${customSettings.borderRadius}px`,
            }),
            backdropFilter: `blur(${blurIntensity}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity}px)`,
            pointerEvents: 'none',
            zIndex: 1,
          };
        }
      }
    } else if (backgroundType === 'gradient' && gradientStartColor && gradientEndColor) {
      let gradientBackground = `linear-gradient(${gradientDirection || 'to right'}, ${gradientStartColor}, ${gradientEndColor})`;

      if (opacity !== undefined && opacity < 1) {
        const adjustOpacity = (color: string) => {
          if (color.startsWith('rgba')) {
            return color.replace(/,\s*[\d.]+\)$/, `, ${opacity})`);
          } else if (color.startsWith('rgb')) {
            return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
          } else {
            return color;
          }
        };

        const adjustedStartColor = adjustOpacity(gradientStartColor);
        const adjustedEndColor = adjustOpacity(gradientEndColor);

        if (adjustedStartColor !== gradientStartColor || adjustedEndColor !== gradientEndColor) {
          gradientBackground = `linear-gradient(${gradientDirection || 'to right'}, ${adjustedStartColor}, ${adjustedEndColor})`;
        } else {
          backgroundStyles.position = 'relative';
          backgroundStyles['&::before'] = {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            ...(customSettings.borderRadius !== undefined && customSettings.borderRadius > 0 && {
              borderRadius: `${customSettings.borderRadius}px`,
            }),
            backgroundColor: (theme) => theme.palette.mode === 'dark'
              ? `rgba(0, 0, 0, ${1 - opacity})`
              : `rgba(255, 255, 255, ${1 - opacity})`,
            pointerEvents: 'none',
            zIndex: 1,
          };
        }
      }

      backgroundStyles.background = gradientBackground;

      if (blurIntensity && blurIntensity > 0) {
        if (!backgroundStyles.position) {
          backgroundStyles.position = 'relative';
        }

        if (backgroundStyles['&::before']) {
          backgroundStyles['&::before'] = {
            ...backgroundStyles['&::before'],
            backdropFilter: `blur(${blurIntensity}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity}px)`,
          };
        } else {
          backgroundStyles['&::before'] = {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            ...(customSettings.borderRadius !== undefined && customSettings.borderRadius > 0 && {
              borderRadius: `${customSettings.borderRadius}px`,
            }),
            backdropFilter: `blur(${blurIntensity}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity}px)`,
            pointerEvents: 'none',
            zIndex: 1,
          };
        }
      }
    } else if ((backgroundType === 'solid' || !backgroundType) && backgroundColor) {
      let finalBackgroundColor = backgroundColor;

      if (opacity !== undefined && opacity < 1) {
        if (backgroundColor.startsWith('rgba')) {
          finalBackgroundColor = backgroundColor.replace(/,\s*[\d.]+\)$/, `, ${opacity})`);
        } else if (backgroundColor.startsWith('rgb')) {
          finalBackgroundColor = backgroundColor.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
        } else {
          backgroundStyles.position = 'relative';
          backgroundStyles['&::before'] = {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: (theme) => theme.palette.mode === 'dark'
              ? `rgba(0, 0, 0, ${1 - opacity})`
              : `rgba(255, 255, 255, ${1 - opacity})`,
            pointerEvents: 'none',
            zIndex: 1,
          };
        }
      }

      backgroundStyles.backgroundColor = finalBackgroundColor;

      if (blurIntensity && blurIntensity > 0) {
        if (!backgroundStyles.position) {
          backgroundStyles.position = 'relative';
        }

        if (backgroundStyles['&::before']) {
          backgroundStyles['&::before'] = {
            ...backgroundStyles['&::before'],
            backdropFilter: `blur(${blurIntensity}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity}px)`,
          };
        } else {
          backgroundStyles['&::before'] = {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            ...(customSettings.borderRadius !== undefined && customSettings.borderRadius > 0 && {
              borderRadius: `${customSettings.borderRadius}px`,
            }),
            backdropFilter: `blur(${blurIntensity}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity}px)`,
            pointerEvents: 'none',
            zIndex: 1,
          };
        }
      }
    } else if (blurIntensity && blurIntensity > 0) {
      backgroundStyles.position = 'relative';
      backgroundStyles.backgroundColor = 'background.paper';
      backgroundStyles['&::before'] = {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        ...(customSettings.borderRadius !== undefined && customSettings.borderRadius > 0 && {
          borderRadius: `${customSettings.borderRadius}px`,
        }),
        backdropFilter: `blur(${blurIntensity}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity}px)`,
        pointerEvents: 'none',
        zIndex: 1,
      };
    }

    return backgroundStyles;
  }, [customSettings, colorSchemeMode]);

  const getLogoSize = () => {
    const { logoSize, customLogoWidth, customLogoHeight, mobileLogoSize, mobileCustomLogoWidth, mobileCustomLogoHeight } = customSettings;

    if (isMobile) {
      let width, height;
      switch (mobileLogoSize || logoSize) {
        case 'small':
          width = height = 32;
          break;
        case 'large':
          width = height = 64;
          break;
        case 'custom':
          width = Math.max(1, Number(mobileCustomLogoWidth || customLogoWidth || 48));
          height = Math.max(1, Number(mobileCustomLogoHeight || customLogoHeight || 48));
          break;
        default:
          width = height = 48;
          break;
      }
      return { width: Number(width), height: Number(height) };
    }

    let width, height;
    switch (logoSize) {
      case 'small':
        width = height = 32;
        break;
      case 'large':
        width = height = 64;
        break;
      case 'custom':
        width = Math.max(1, Number(customLogoWidth || 48));
        height = Math.max(1, Number(customLogoHeight || 48));
        break;
      default:
        width = height = 48;
        break;
    }

    return { width: Number(width), height: Number(height) };
  };

  const getElementPositions = () => {
    const { logoPosition = 'left', menuPosition = 'center', actionsPosition = 'right' } = customSettings;

    const positions: { [key: string]: string[] } = {
      left: [],
      'center-left': [],
      center: [],
      'center-right': [],
      right: []
    };

    if (customSettings.showLogo !== false) {
      positions[logoPosition].push('logo');
    }

    if (appConfig.menuTree) {
      positions[menuPosition].push('menu');
    }

    positions[actionsPosition].push('actions');

    return positions;
  };

  const renderLogo = () => {
    if (customSettings.showLogo === false) return null;

    const logoSizes = getLogoSize();
    const logoStyles = {
      color: getEffectiveColor('textColor', customSettings.textColor),
      textDecoration: "none",
    };

    if (appConfig.logoDark && appConfig.logoDark?.url && colorSchemeMode === 'dark') {
      return (
        <Link href={isPreview ? "#" : "/"} sx={logoStyles}>
          <Image
            src={appConfig.logoDark.url}
            alt={appConfig.name}
            title={appConfig.name}
            height={logoSizes.height}
            width={logoSizes.width}
          />
        </Link>
      );
    } else if (appConfig.logo) {
      return (
        <Link href={isPreview ? "#" : "/"} sx={logoStyles}>
          <Image
            src={appConfig.logo.url}
            alt={appConfig.name}
            title={appConfig.name}
            width={logoSizes.width}
            height={logoSizes.height}
          />
        </Link>
      );
    } else {
      return (
        <Link
          sx={{
            textDecoration: "none",
            color: getEffectiveColor('textColor', customSettings.textColor) || theme.palette.text.primary,
            fontSize: customSettings.menuFontSize || '1.25rem',
            fontWeight: customSettings.menuFontWeight || 600,
          }}
          variant="h6"
          href={isPreview ? "#" : "/"}
        >
          {appConfig.name}
        </Link>
      );
    }
  };

  const renderMenu = () => {
    if (!appConfig.menuTree) return null;

    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={customSettings.menuSpacing || 2}
      >
        {appConfig.menuTree.map((m, key) =>
          m.children ? (
            <NavbarMenu
              menu={m}
              key={key}
              isPreview={isPreview}
              customStyles={{
                textColor: getEffectiveColor('textColor', customSettings.textColor),
                hoverColor: getEffectiveColor('menuHoverColor', customSettings.menuHoverColor),
                iconColor: getEffectiveColor('iconColor', customSettings.iconColor),
                iconSize: customSettings.iconSize,
                showIcons: customSettings.showIcons,
              }}
            />
          ) : (
            <Button
              color="inherit"
              href={isPreview ? "#" : m.href || "/"}
              sx={{
                fontWeight: customSettings.menuFontWeight || 600,
                textDecoration: "none",
                textTransform: "none",
                fontSize: customSettings.menuFontSize || 'inherit',
                color: getEffectiveColor('textColor', customSettings.textColor),
                '&:hover': {
                  color: getEffectiveColor('menuHoverColor', customSettings.menuHoverColor),
                },
              }}
              key={key}
              LinkComponent={Link}
              startIcon={
                customSettings.showIcons !== false && m.data?.iconName ? (
                  <Icon
                    sx={{
                      color: getEffectiveColor('iconColor', customSettings.iconColor) || 'inherit',
                      fontSize: customSettings.iconSize === 'small' ? '1rem' : customSettings.iconSize === 'large' ? '1.5rem' : '1.25rem',
                    }}
                  >
                    {m.data.iconName}
                  </Icon>
                ) : undefined
              }
            >
              {m.name}
            </Button>
          )
        )}
      </Stack>
    );
  };

  const renderActions = () => {
    const iconColor = getEffectiveColor('iconColor', customSettings.iconColor) || getEffectiveColor('textColor', customSettings.textColor);
    const iconSize = customSettings.iconSize === 'small' ? 'small' : customSettings.iconSize === 'large' ? 'large' : 'medium';
    const actionSpacing = isMobile ? 0.5 : 2;

    return (
      <Stack direction="row" alignItems="center" spacing={actionSpacing}>
        {isActive && !isMobile && (
          <ButtonBase
            onClick={handleShowProfileMenu}
            sx={{
              borderRadius: "50%",
              color: iconColor,
              '&:hover': {
                color: getEffectiveColor('iconHoverColor', customSettings.iconHoverColor) || iconColor,
              },
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

        {!isActive && !isMobile ? (
          <Box sx={{
            '& .MuiButton-root': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiButton-root span': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiButton-root .MuiTypography-root': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiButtonBase-root': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiButtonBase-root .MuiTypography-root': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiButtonBase-root span': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiButtonBase-root .MuiTypography-caption': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiTypography-root': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiTypography-caption': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& button': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& button span': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& button .MuiTypography-root': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& *': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            }
          }}>
            <ConnectWalletButton />
          </Box>
        ) : !isMobile && (
          <Box sx={{
            '& .MuiButton-root': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiButton-root span': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiButton-root .MuiTypography-root': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiButtonBase-root': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiButtonBase-root .MuiTypography-root': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiButtonBase-root span': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiButtonBase-root .MuiTypography-caption': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiTypography-root': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& .MuiTypography-caption': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& button': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& button span': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& button .MuiTypography-root': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            },
            '& *': {
              ...(getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor) && {
                color: `${getEffectiveColor('walletButtonTextColor', customSettings.walletButtonTextColor)} !important`,
              }),
            }
          }}>
            <WalletButton />
          </Box>
        )}

        {appConfig.commerce?.enabled && (
          <NoSsr>
            <CommerceCartIconButton iconColor={iconColor} />
          </NoSsr>
        )}

        {customSettings.showIcons !== false && (
          <NoSsr>
            <IconButton
              onClick={handleOpenTransactions}
              aria-label="notifications"
              size={isMobile ? 'small' : iconSize}
              sx={{
                color: iconColor,
                '&:hover': {
                  color: getEffectiveColor('iconHoverColor', customSettings.iconHoverColor) || iconColor,
                },
              }}
            >
              <Badge
                variant={
                  hasPendingTransactions && filteredUncheckedTransactions.length === 0
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
                  !hasPendingTransactions && filteredUncheckedTransactions.length === 0
                }
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </NoSsr>
        )}

        {customSettings.showIcons !== false && (
          <IconButton
            onClick={handleSettingsMenuClick}
            aria-label="settings"
            size={isMobile ? 'small' : iconSize}
            sx={{
              color: iconColor,
              '&:hover': {
                color: getEffectiveColor('iconHoverColor', customSettings.iconHoverColor) || iconColor,
              },
            }}
          >
            <SettingsIcon />
          </IconButton>
        )}
      </Stack>
    );
  };

  const renderElementsInPosition = (position: string, elements: string[]) => {
    const justifyContent = position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center';
    const flexGrow = position === 'center' ? 1 : 0;

    const elementSpacing = elements.includes('menu') ? (customSettings.menuSpacing || 2) : 2;

    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={elementSpacing}
        sx={{
          flexGrow,
          justifyContent,
          ...(position === 'center' && { px: 2 }),
        }}
      >
        {elements.map((element, index) => {
          switch (element) {
            case 'logo':
              return <Box key={`${position}-logo-${index}`} sx={{
                maxWidth: '200px',
                overflow: 'hidden',
                '& img': {
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }
              }}>{renderLogo()}</Box>;
            case 'menu':
              return <Box key={`${position}-menu-${index}`}>{renderMenu()}</Box>;
            case 'actions':
              return <Box key={`${position}-actions-${index}`}>{renderActions()}</Box>;
            default:
              return null;
          }
        })}
      </Stack>
    );
  };

  const positions = getElementPositions();

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
      <AppBar
        variant="elevation"
        color="default"
        position="sticky"
        sx={{
          zIndex: 10,
          ...getBackgroundStyles,
          '&.MuiAppBar-root': {
            ...getBackgroundStyles,
          },
          '&.MuiAppBar-colorDefault': {
            ...getBackgroundStyles,
          },
          ...(customSettings.borderRadius !== undefined && customSettings.borderRadius > 0 && {
            borderRadius: `${customSettings.borderRadius}px`,
            overflow: 'hidden',
          }),
          ...(customSettings.showShadow && {
            boxShadow: customSettings.shadowColor
              ? `0 4px ${customSettings.shadowIntensity || 16}px 0 ${customSettings.shadowColor}`
              : (theme) => `0 4px ${customSettings.shadowIntensity || 16}px 0 ${theme.palette.divider}`,
          }),
          ...(customSettings.showBorder && {
            ...(customSettings.borderPosition === 'top' && {
              borderTop: `${customSettings.borderWidth || 1}px solid ${customSettings.borderColor || theme.palette.divider}`,
            }),
            ...(customSettings.borderPosition === 'bottom' && {
              borderBottom: `${customSettings.borderWidth || 1}px solid ${customSettings.borderColor || theme.palette.divider}`,
            }),
            ...(customSettings.borderPosition === 'both' && {
              borderTop: `${customSettings.borderWidth || 1}px solid ${customSettings.borderColor || theme.palette.divider}`,
              borderBottom: `${customSettings.borderWidth || 1}px solid ${customSettings.borderColor || theme.palette.divider}`,
            }),
          }),
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            py: customSettings.padding || 1,
            height: isMobile ? customSettings.mobileHeight || customSettings.height : customSettings.height,
            color: getEffectiveColor('textColor', customSettings.textColor),
            position: 'relative',
            zIndex: 2,
            ...(customSettings.borderRadius !== undefined && customSettings.borderRadius > 0 && {
              borderRadius: `${customSettings.borderRadius}px`,
              overflow: 'hidden',
            }),
            ...(isMobile && customSettings.mobilePadding !== undefined && {
              py: customSettings.mobilePadding,
            }),
          }}
        >
          {isMobile && (
            <IconButton
              edge="start"
              aria-label="menu"
              size="small"
              sx={{
                mr: 1,
                color: getEffectiveColor('iconColor', customSettings.iconColor) || getEffectiveColor('textColor', customSettings.textColor) || 'text.primary',
                '&:hover': {
                  color: getEffectiveColor('iconHoverColor', customSettings.iconHoverColor) || getEffectiveColor('iconColor', customSettings.iconColor) || getEffectiveColor('textColor', customSettings.textColor) || 'text.primary',
                },
              }}
              onClick={handleToggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          )}

          {!isMobile ? (
            <>
              {renderElementsInPosition('left', positions.left)}
              {renderElementsInPosition('center-left', positions['center-left'])}
              {renderElementsInPosition('center', positions.center)}
              {renderElementsInPosition('center-right', positions['center-right'])}
              {renderElementsInPosition('right', positions.right)}
            </>
          ) : (
            <>
              <Box sx={{
                flexGrow: 1,
                maxWidth: '200px',
                overflow: 'hidden',
                '& img': {
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }
              }}>
                {renderLogo()}
              </Box>
              {renderActions()}
            </>
          )}
        </Toolbar>

        <Menu
          id="settings-menu"
          anchorEl={menuAnchorEl}
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
      </AppBar>
    </>
  );
}

export default CustomNavbar; 