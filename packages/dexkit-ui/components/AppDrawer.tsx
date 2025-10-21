import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  styled,
  Typography,
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
import { useEffect, useMemo, useState } from "react";
import { AppConfig } from "../modules/wizard/types/config";
import { isMiniSidebarAtom } from "../state";
import AppDefaultMenuList from "./AppDefaultMenuList";
import Link from "./AppLink";
import { ThemeModeSelector } from "./ThemeModeSelector";

import { useRouter } from "next/router";
import { useWalletConnect } from "../hooks/wallet";
import { ConnectButton } from "./ConnectButton";

const ScanWalletQrCodeDialog = dynamic(
  async () => import("@dexkit/ui/components/dialogs/ScanWalletQrCodeDialog")
);

const CustomListItemSecondaryAction = styled(ListItemSecondaryAction)({
  display: "flex",
  alignItems: "center",
  alignContent: "center",
  justifyContent: "center",
  height: "100%",
});

interface Props {
  open: boolean;
  onClose: () => void;
  appConfig?: AppConfig;
}

function AppDrawer({ open, onClose, appConfig }: Props) {
  const { isActive } = useWeb3React();
  const { connectWallet } = useWalletConnect();
  const theme = useTheme();
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

  const isMiniOpen = useMemo(() => {
    if (isMini) {
      if (startExpanded !== undefined) {
        return !startExpanded;
      }
      return isMiniSidebar;
    }
    return false;
  }, [isMiniSidebar, isMini, startExpanded]);

  useEffect(() => {
    if (isMini && startExpanded !== undefined && isMiniSidebar !== !startExpanded) {
      setIsMiniSidebar(!startExpanded);
    }
  }, [isMini, startExpanded, isMiniSidebar, setIsMiniSidebar]);

  const handleToggleMini = () => {
    setIsMiniSidebar((value) => !value);
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
    if (!isMobile && isSidebar && isMiniOpen) return "auto";
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
        {isMini && (
          <Stack
            direction="row"
            justifyContent={isMiniOpen ? "center" : "flex-end"}
            px={1}
            py={1}
          >
            <IconButton onClick={handleToggleMini}>
              {isMiniOpen ? <MenuIcon sx={{ color: 'text.primary' }} /> : <MenuOpenIcon sx={{ color: 'text.primary' }} />}
            </IconButton>
          </Stack>
        )}

        {isMobile && (
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

                      <IconButton onClick={handleOpenQrCode}>
                        <QrCodeScanner sx={{ color: 'text.primary' }} />
                      </IconButton>
                    </Stack>
                  </Box>
                  <Divider />
                </>

                {isMobile && <WalletContent onClosePopover={onClose} />}
              </Stack>
            )}
          </Box>
        )}

        {appConfig?.menuTree ? (
          <DrawerMenu
            menu={appConfig?.menuTree}
            onClose={onClose}
            isMini={!isMobile && isMiniOpen}
          />
        ) : (
          <AppDefaultMenuList onClose={onClose} />
        )}
        {isMobile && (
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
            <ListItemButton divider onClick={handleShowSelectLocaleDialog}>
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
              <CustomListItemSecondaryAction>
                <ChevronRightIcon color="primary" />
              </CustomListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton divider onClick={handleShowSelectCurrencyDialog}>
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
              <CustomListItemSecondaryAction>
                <ChevronRightIcon color="primary" />
              </CustomListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemIcon />
              <ListItemText primary={<ThemeModeSelector />} />
            </ListItemButton>
          </List>
        )}
      </Box>
    );
  };

  if (!isMobile && appConfig?.menuSettings?.layout?.type === "sidebar") {
    return (
      <Paper
        sx={{
          display: "block",
          height: "100%",
        }}
        square
        variant="elevation"
      >
        {renderContent()}
      </Paper>
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
        PaperProps={{ variant: "elevation" }}
        open={open}
        onClose={onClose}
      >
        {renderContent()}
      </Drawer>
    </>
  );
}

export default AppDrawer;
