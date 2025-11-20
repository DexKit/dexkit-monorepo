import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import AttachMoney from "@mui/icons-material/AttachMoney";
import Language from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { FormattedMessage } from "react-intl";

import DrawerMenu from "./DrawerMenu";

import { useIsMobile } from "@dexkit/core/hooks";
import WalletContent from "@dexkit/ui/components/WalletContent";
import {
  useAuthUserQuery,
  useCurrency,
  useLocale,
  useShowSelectCurrency,
  useShowSelectLocale,
} from "@dexkit/ui/hooks";
import { useSidebarVariant } from "@dexkit/ui/hooks/useSidebarVariant";
import QrCodeScanner from "@mui/icons-material/QrCodeScanner";
import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppConfig } from "../modules/wizard/types/config";
import { isMiniSidebarAtom } from "../state";
import AppDefaultMenuList from "./AppDefaultMenuList";
import Link from "./AppLink";
import { ThemeModeSelector } from "./ThemeModeSelector";

import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useWalletConnect } from "../hooks/wallet";
import { ConnectButton } from "./ConnectButton";

const ScanWalletQrCodeDialog = dynamic(
  async () => import("@dexkit/ui/components/dialogs/ScanWalletQrCodeDialog")
);

interface Props {
  open: boolean;
  onClose: () => void;
  appConfig?: AppConfig;
}

function AppDrawer({ open, onClose, appConfig }: Props) {
  const { isActive } = useWeb3React();
  const { connectWallet } = useWalletConnect();
  const theme = useTheme();
  const { mode: colorSchemeMode } = useColorScheme();
  const handleConnectWallet = () => {
    connectWallet();
    onClose();
  };

  const { locale } = useLocale();
  const { currency } = useCurrency();

  const showSelectCurrency = useShowSelectCurrency();

  const showSelectLocale = useShowSelectLocale();

  const handleShowSelectCurrencyDialog = () => {
    showSelectCurrency.setIsOpen(true);
  };

  const handleShowSelectLocaleDialog = () => {
    showSelectLocale.setIsOpen(true);
  };

  const userQuery = useAuthUserQuery();
  const user = userQuery.data;

  const isMobile = useIsMobile();
  const { isMini, isDense, isProminent, isSidebar, startExpanded } = useSidebarVariant(appConfig);

  const [isMiniSidebar, setIsMiniSidebar] = useAtom(isMiniSidebarAtom);
  const [isMounted, setIsMounted] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMini && startExpanded !== undefined && !hasInitialized.current && isMounted) {
      const storedValue = localStorage.getItem('dexkit-ui.isMiniSidebar');
      if (storedValue === null) {
        setIsMiniSidebar(!startExpanded);
      }
      hasInitialized.current = true;
    }
  }, [isMini, startExpanded, setIsMiniSidebar, isMounted]);

  const isMiniOpen = useMemo(() => {
    if (isMini) {
      if (!isMounted) {
        return startExpanded === false ? true : false;
      }
      return isMiniSidebar;
    }
    return false;
  }, [isMiniSidebar, isMini, isMounted, startExpanded]);

  const handleToggleMini = () => {
    if (isMobile) {
      onClose();
    } else {
      setIsMiniSidebar((value) => !value);
    }
  };

  const [showQrCode, setShowQrCode] = useState(false);

  const handleOpenQrCodeScannerClose = () => {
    setShowQrCode(false);
  };

  const router = useRouter();

  const handleAddressResult = (result: string) => {
    try {
      handleOpenQrCodeScannerClose();
      if (isMobile) {
        router.push(`/wallet/send/${encodeURIComponent(result)}`);
      } else {
        window.open(`/wallet/send/${encodeURIComponent(result)}`, "_blank");
      }
    } catch (err) { }
  };

  const handleOpenQrCode = () => setShowQrCode(true);

  const getSidebarWidth = () => {
    if (isMobile) {
      if (isDense) return "180px";
      if (isProminent) return "320px";
      return `${theme.breakpoints.values.sm / 2}px`;
    }
    if (isSidebar && isMini && isMiniOpen) return "64px";
    if (isDense) return "180px";
    if (isProminent) return "320px";
    return `${theme.breakpoints.values.sm / 2}px`;
  };

  const renderContent = () => {
    return (
      <Box
        sx={(theme) => ({
          display: "block",
          width: getSidebarWidth(),
          height: isSidebar && !isMobile ? "100%" : "auto",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          ...(isDense && {
            "& .MuiListItemButton-root": {
              minHeight: "32px",
              py: 0.25,
              px: 1,
            },
            "& .MuiListItemText-root": {
              "& .MuiTypography-root": {
                fontSize: "0.8rem",
              },
            },
            "& .MuiListItemIcon-root": {
              minWidth: "32px",
            },
            "& .MuiStack-root": {
              "& .MuiIcon-root": {
                fontSize: "1.1rem",
              },
              "& .MuiAvatar-root": {
                width: "1.2rem",
                height: "1.2rem",
                fontSize: "0.7rem",
              },
            },
            "& .MuiListSubheader-root": {
              fontSize: "0.75rem",
              py: 0.5,
            },
          }),
          ...(isProminent && {
            "& .MuiListItemButton-root": {
              minHeight: "56px",
              py: 1.5,
              px: 2,
            },
            "& .MuiListItemText-root": {
              "& .MuiTypography-root": {
                fontSize: "1.1rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              },
            },
            "& .MuiListItemIcon-root": {
              minWidth: "48px",
              "& .MuiSvgIcon-root": {
                fontSize: "1.5rem",
              },
            },
            "& .MuiStack-root": {
              "& .MuiIcon-root": {
                fontSize: "1.6rem",
              },
              "& .MuiAvatar-root": {
                width: "2rem",
                height: "2rem",
                fontSize: "1rem",
              },
            },
            "& .MuiListSubheader-root": {
              fontSize: "1rem",
              fontWeight: 600,
              py: 1,
            },
          }),

        })}
      >
        {isMini && !isMobile && (
          <Stack
            direction="column"
            alignItems="center"
            spacing={1}
            px={1}
            py={1}
          >
            {appConfig && !isMiniOpen && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  mb: 1,
                }}
              >
                {colorSchemeMode === 'dark' && appConfig.logoDark?.url ? (
                  <Link href="/" sx={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
                    <Image
                      src={appConfig.logoDark.url}
                      alt={appConfig.name}
                      title={appConfig.name}
                      width={Math.max(1, Number(appConfig.logoDark?.width || 48))}
                      height={Math.max(1, Number(appConfig.logoDark?.height || 48))}
                      style={{
                        objectFit: 'contain',
                        maxWidth: '100%',
                        height: 'auto',
                      }}
                    />
                  </Link>
                ) : appConfig.logo?.url ? (
                  <Link href="/" sx={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
                    <Image
                      src={appConfig.logo.url}
                      alt={appConfig.name}
                      title={appConfig.name}
                      width={Math.max(1, Number(appConfig.logo?.width || 48))}
                      height={Math.max(1, Number(appConfig.logo?.height || 48))}
                      style={{
                        objectFit: 'contain',
                        maxWidth: '100%',
                        height: 'auto',
                      }}
                    />
                  </Link>
                ) : (
                  <Link
                    href="/"
                    sx={{
                      textDecoration: 'none',
                      color: 'text.primary',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    {appConfig.name}
                  </Link>
                )}
              </Box>
            )}
            <IconButton onClick={handleToggleMini}>
              {isMiniOpen ? <MenuIcon sx={{ color: 'text.primary' }} /> : <MenuOpenIcon sx={{ color: 'text.primary' }} />}
            </IconButton>
          </Stack>
        )}
        {isMobile && (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', px: 1, py: 1 }}>
            <IconButton onClick={onClose}>
              <MenuIcon sx={{ color: 'text.primary' }} />
            </IconButton>
          </Box>
        )}

        {(isMobile || !isMiniOpen) && (
          <Box>
            {!isActive ? (
              <Box p={2}>
                <ConnectButton
                  variant="outlined"
                  color="inherit"
                  onConnectWallet={handleConnectWallet}
                  endIcon={<ChevronRightIcon />}
                  fullWidth
                />
              </Box>
            ) : (
              <Stack spacing={2}>
                <>
                  <Box sx={{ px: 2, pt: 1 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      {user ? (
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar src={user?.profileImageURL} />
                          <Link href={`/u/${user.username}`} variant="body1">
                            {user?.username}
                          </Link>
                        </Stack>
                      ) : (
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Link href={`/u/create-profile`} variant="body1">
                            <Avatar />
                          </Link>
                        </Stack>
                      )}

                      {isMobile && appConfig && (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                            maxWidth: '120px',
                          }}
                        >
                          {colorSchemeMode === 'dark' && appConfig.logoDark?.url ? (
                            <Link href="/" sx={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                              <Image
                                src={appConfig.logoDark.url}
                                alt={appConfig.name}
                                title={appConfig.name}
                                width={Math.max(1, Math.round(Number(appConfig.logoDark?.width || 48) * 0.5))}
                                height={Math.max(1, Math.round(Number(appConfig.logoDark?.height || 48) * 0.5))}
                                style={{
                                  objectFit: 'contain',
                                  maxWidth: '100%',
                                  height: 'auto',
                                }}
                              />
                            </Link>
                          ) : appConfig.logo?.url ? (
                            <Link href="/" sx={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                              <Image
                                src={appConfig.logo.url}
                                alt={appConfig.name}
                                title={appConfig.name}
                                width={Math.max(1, Math.round(Number(appConfig.logo?.width || 48) * 0.5))}
                                height={Math.max(1, Math.round(Number(appConfig.logo?.height || 48) * 0.5))}
                                style={{
                                  objectFit: 'contain',
                                  maxWidth: '100%',
                                  height: 'auto',
                                }}
                              />
                            </Link>
                          ) : (
                            <Link
                              href="/"
                              sx={{
                                textDecoration: 'none',
                                color: 'text.primary',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textAlign: 'center',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {appConfig.name}
                            </Link>
                          )}
                        </Box>
                      )}

                      <IconButton onClick={handleOpenQrCode}>
                        <QrCodeScanner sx={{ color: 'text.primary' }} />
                      </IconButton>
                    </Stack>
                  </Box>
                  <Divider />
                </>

                <WalletContent onClosePopover={onClose} />
              </Stack>
            )}
          </Box>
        )}

        {appConfig?.menuTree ? (
          <DrawerMenu
            menu={appConfig?.menuTree}
            onClose={onClose}
            isMini={isMobile ? false : isMiniOpen}
          />
        ) : (
          <AppDefaultMenuList onClose={onClose} />
        )}
        {isMobile && !isMiniOpen && (
          <List
            disablePadding
            subheader={
              <>
                <ListSubheader disableSticky component="div" sx={{ color: 'text.primary' }}>
                  <FormattedMessage id="settings" defaultMessage="Settings" />
                </ListSubheader>
                <Divider />
              </>
            }
          >
            <ListItem
              divider
              onClick={handleShowSelectLocaleDialog}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
              }}
              secondaryAction={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <ChevronRightIcon color="primary" />
                </Box>
              }
            >
              <ListItemIcon>
                <Language sx={{ color: 'text.primary' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <FormattedMessage id="language" defaultMessage="Language" />
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {locale}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem
              divider
              onClick={handleShowSelectCurrencyDialog}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
              }}
              secondaryAction={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <ChevronRightIcon color="primary" />
                </Box>
              }
            >
              <ListItemIcon>
                <AttachMoney sx={{ color: 'text.primary' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <FormattedMessage id="currency" defaultMessage="Currency" />
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {currency.toUpperCase()}
                  </Typography>
                }
              />
            </ListItem>
            <ListItemButton divider>
              <ListItemIcon />
              <ListItemText primary={<ThemeModeSelector />} />
            </ListItemButton>
          </List>
        )}
      </Box>
    );
  };

  if (appConfig?.menuSettings?.layout?.type === "sidebar") {
    if (isMobile) {
      return (
        <>
          {showQrCode && (
            <ScanWalletQrCodeDialog
              DialogProps={{
                open: showQrCode,
                maxWidth: "sm",
                fullWidth: true,
                onClose: handleOpenQrCodeScannerClose,
                fullScreen: isMobile,
              }}
              onResult={handleAddressResult}
            />
          )}
          <Drawer
            variant="temporary"
            anchor="left"
            open={open}
            onClose={onClose}
            slotProps={{
              paper: {
                variant: "elevation",
                sx: {
                  width: getSidebarWidth(),
                  transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
                }
              }
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {renderContent()}
          </Drawer>
        </>
      );
    }

    return (
      <>
        {showQrCode && (
          <ScanWalletQrCodeDialog
            DialogProps={{
              open: showQrCode,
              maxWidth: "sm",
              fullWidth: true,
              onClose: handleOpenQrCodeScannerClose,
              fullScreen: isMobile,
            }}
            onResult={handleAddressResult}
          />
        )}
        <Paper
          sx={{
            display: "block",
            height: "100%",
            width: getSidebarWidth(),
            maxWidth: getSidebarWidth(),
            minWidth: getSidebarWidth(),
          }}
          square
          variant="elevation"
        >
          {renderContent()}
        </Paper>
      </>
    );
  }

  return (
    <>
      {showQrCode && (
        <ScanWalletQrCodeDialog
          DialogProps={{
            open: showQrCode,
            maxWidth: "sm",
            fullWidth: true,
            onClose: handleOpenQrCodeScannerClose,
            fullScreen: isMobile,
          }}
          onResult={handleAddressResult}
        />
      )}
      <Drawer
        slotProps={{ paper: { variant: "elevation" } }}
        open={open}
        onClose={onClose}
      >
        {renderContent()}
      </Drawer>
    </>
  );
}

export default AppDrawer;
