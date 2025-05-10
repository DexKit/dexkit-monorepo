import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import React, { useEffect } from 'react';

import { Home, Person } from '@mui/icons-material';

import Footer from '@/modules/common/components/Footer';
import {
  AccountType,
  WalletConnectType,
} from '@/modules/wallet/constants/enums';
import { useAccounts } from '@/modules/wallet/hooks';
import { useWalletActivate } from '@dexkit/core/hooks';
import { WalletActivateParams } from '@dexkit/core/types';
import { ConnectWalletDialog } from '@dexkit/ui/components';
import { Paper } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {
  firstVisitAtom,
  selectedWalletAtom,
  showConnectWalletAtom,
  showNotificationsAtom,
  showWelcomeAtom,
} from '../../atoms';
import { MagicConnector } from '../../connectors/magic';
import { isAddressEqual } from '../../utils';
import AppNavbar from '../AppNavbar';
import CoinLeague from '../icons/CoinLeague';
import Ranking from '../icons/Ranking';
import Settings from '../icons/Settings';
import UserOctagon from '../icons/UserOctagon';
import SidebarListItem from './sidebar/SidebarListItem';
import SidebarListSubheader from './sidebar/SidebarListSubheader';

const AppConnectWalletDialog = dynamic(
  () => import('../dialogs/AppConnectWalletDialog')
);
const AppNotificationsDialog = dynamic(
  () => import('../dialogs/AppNotificationsDialog')
);
const WelcomeDialog = dynamic(() => import('../dialogs/WelcomeDialog'));

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  [theme.breakpoints.down('sm')]: {
    zIndex: theme.zIndex.drawer,
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    height: '100%',
  },
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
    width: 0,
    zIndex: theme.zIndex.drawer,
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface Props {
  children: React.ReactNode | React.ReactNode[];
  renderBottomNavigation?: () => React.ReactNode;
}

export default function MainLayout({
  children,
  renderBottomNavigation,
}: Props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [isFirstVisit, setIsFirstVisit] = useAtom(firstVisitAtom);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [showNotifications, setShowNotifications] = useAtom(
    showNotificationsAtom
  );

  const [showConnectWallet, setShowConnectWallet] = useAtom(
    showConnectWalletAtom
  );

  const handleCloseNotifications = () =>
    setShowNotifications((value) => !value);

  const handleCloseConnectWallet = () =>
    setShowConnectWallet((value) => !value);

  const [showWelcome, setShowWelcome] = useAtom(showWelcomeAtom);

  const handleCloseWelcomeDialog = () => {
    setShowWelcome(false);
  };

  const { connector, account, isActive } = useWeb3React();

  const isWindowDefined = typeof window !== 'undefined';
  const router = useRouter();

  useEffect(() => {
    if (isWindowDefined && connector) {
      if (connector.connectEagerly) {
        connector.connectEagerly();
      }
    }
  }, [connector, isWindowDefined]);

  const { accounts, addAccount, updateConnector } = useAccounts({});

  useEffect(() => {
    if (account && connector) {
      if (connector instanceof MetaMask) {
        if (accounts.find((a) => isAddressEqual(a.address, account))) {
          updateConnector(account, WalletConnectType.MetaMask);
        } else {
          addAccount(
            {
              address: account,
              type: AccountType.EVM,
              connector: WalletConnectType.MetaMask,
            },
            true
          );
        }
      } else if (connector instanceof MagicConnector) {
        if (accounts.find((a) => isAddressEqual(a.address, account))) {
          updateConnector(account, WalletConnectType.Magic);
        } else {
          addAccount(
            {
              address: account,
              type: AccountType.EVM,
              connector: WalletConnectType.Magic,
              loginType: connector?.loginType,
            },
            true
          );
        }
      }
    }
  }, [account, connector]);

  const walletActivate = useWalletActivate({
    magicRedirectUrl: process.env.NEXT_PUBLIC_MAGIC_REDIRECT_URL || '',
    selectedWalletAtom,
  });

  const handleActivate = (params: WalletActivateParams) =>
    walletActivate.mutation.mutateAsync(params);

  return (
    <>
      <Box>
        {showNotifications && (
          <AppNotificationsDialog
            dialogProps={{
              open: showNotifications,
              maxWidth: 'sm',
              fullWidth: true,
              onClose: handleCloseNotifications,
            }}
          />
        )}

        {showConnectWallet && (
          <ConnectWalletDialog
            DialogProps={{
              open: showConnectWallet,
              maxWidth: 'xs',
              fullWidth: true,
              onClose: handleCloseConnectWallet,
            }}
            activate={handleActivate}
            isActive={isActive}
            activeConnectorName={walletActivate.connectorName}
            isActivating={walletActivate.mutation.isLoading}
          />
        )}

        {showWelcome && (
          <WelcomeDialog
            DialogProps={{
              maxWidth: 'sm',
              fullWidth: true,
              open: showWelcome,
              onClose: handleCloseWelcomeDialog,
            }}
          />
        )}

        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppNavbar onOpenDrawer={handleDrawerOpen} open={open} />
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              <SidebarListSubheader
                open={open}
                messageId="general"
                defaultMessage="General"
              />
              <SidebarListItem
                open={open}
                icon={<Home />}
                messageId="home"
                defaultMessage="Home"
                href="/"
              />
              <SidebarListItem
                open={open}
                icon={<Person />}
                messageId="profile"
                defaultMessage="Profile"
                href="/profile"
              />
              <SidebarListItem
                open={open}
                icon={<Home />}
                messageId="kittygotchi"
                defaultMessage="Kittygotchi"
                href="/kittygotchi"
              />
              <SidebarListSubheader
                open={open}
                messageId="coin.league"
                defaultMessage="Coin League"
              />
              <SidebarListItem
                open={open}
                icon={<CoinLeague />}
                messageId="coin.league"
                defaultMessage="Coin League"
                href="/coinleague"
              />
              <SidebarListItem
                open={open}
                icon={<Ranking />}
                messageId="ranking"
                defaultMessage="Ranking"
                href="/coinleague/ranking"
              />
              <SidebarListItem
                open={open}
                icon={<UserOctagon />}
                messageId="affiliate"
                defaultMessage="Affiliate"
                href="/coinleague/affiliates"
              />
              <SidebarListSubheader
                open={open}
                messageId="more"
                defaultMessage="More"
              />
              <SidebarListItem
                open={open}
                icon={<Settings />}
                messageId="settings"
                defaultMessage="Settings"
                href="/settings"
              />
            </List>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3, pb: { xs: 6 } }}>
            <DrawerHeader />
            {children}
            <Footer />
          </Box>
        </Box>
        <Paper
          sx={{
            display: { sm: 'none' },
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
          }}
          elevation={3}
        >
          {renderBottomNavigation && renderBottomNavigation()}
        </Paper>
      </Box>
    </>
  );
}
