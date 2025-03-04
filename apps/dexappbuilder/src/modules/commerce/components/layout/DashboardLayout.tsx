import {
  Badge,
  Box,
  Button,
  Collapse,
  Container,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

import { DexkitApiProvider } from '@dexkit/core/providers';
import { myAppsApi } from '@dexkit/ui/constants/api';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Settings from '@mui/icons-material/Settings';
import React, { useState } from 'react';
import AuthMainLayout from 'src/components/layouts/authMain';

import ChevronRight from '@mui/icons-material/ChevronRight';
import Wallet from '@mui/icons-material/Wallet';
import { useConnectWalletDialog } from 'src/hooks/app';

import NotificationsIcon from '@mui/icons-material/Notifications';

import useNotificationsCountUnread from '@dexkit/ui/modules/commerce/hooks/useNotificatonsCountUnread';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import AppsIcon from '@mui/icons-material/Apps';
import InventoryIcon from '@mui/icons-material/Inventory';

import LabelIcon from '@mui/icons-material/Label';

import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import DashboardIcon from '@mui/icons-material/Dashboard';

import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  page?: string;
}

function RequireLogin({
  page,
  children,
}: {
  page: string;
  children: React.ReactNode;
}) {
  const { isActive } = useWeb3React();

  const connectWalletDialog = useConnectWalletDialog();

  const { data } = useNotificationsCountUnread({ scope: 'Store' });

  const [open, setOpen] = useState(
    ['categories', 'products', 'collections'].includes(page),
  );

  const handleToggleMenu = () => {
    setOpen((value) => !value);
  };

  if (isActive) {
    return (
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Paper>
              <List disablePadding>
                <ListItemButton
                  LinkComponent={Link}
                  href="/u/account/commerce"
                  selected={page === 'home'}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="dashboard"
                        defaultMessage="Dashboard"
                      />
                    }
                  />
                </ListItemButton>
                <ListItemButton
                  LinkComponent={Link}
                  href="/u/account/commerce/notifications"
                  selected={page === 'notifications'}
                >
                  <ListItemIcon>
                    <Badge
                      badgeContent={data?.count}
                      variant="standard"
                      color="primary"
                    >
                      <NotificationsIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="notifications"
                        defaultMessage="Notifications"
                      />
                    }
                  />
                </ListItemButton>
                <ListItemButton
                  LinkComponent={Link}
                  href="/u/account/commerce/orders"
                  selected={page === 'orders'}
                >
                  <ListItemIcon>
                    <ReceiptLongIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage id="Orders" defaultMessage="Orders" />
                    }
                  />
                </ListItemButton>

                <ListItemButton
                  LinkComponent={Link}
                  href="/u/account/commerce/settings"
                  selected={page === 'settings'}
                >
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="settings"
                        defaultMessage="Settings"
                      />
                    }
                  />
                </ListItemButton>

                <ListItemButton onClick={handleToggleMenu}>
                  <ListItemIcon>
                    <ShoppingBagIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage id="product" defaultMessage="Product" />
                    }
                  />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open}>
                  <List disablePadding>
                    <ListItemButton
                      LinkComponent={Link}
                      href="/u/account/commerce/products"
                      selected={page === 'products'}
                      sx={{ pl: 5 }}
                    >
                      <ListItemIcon>
                        <InventoryIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <FormattedMessage id="items" defaultMessage="Items" />
                        }
                      />
                    </ListItemButton>

                    <ListItemButton
                      LinkComponent={Link}
                      href="/u/account/commerce/categories"
                      selected={page === 'categories'}
                      sx={{ pl: 5 }}
                    >
                      <ListItemIcon>
                        <AppsIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <FormattedMessage
                            id="categories"
                            defaultMessage="Categories"
                          />
                        }
                      />
                    </ListItemButton>
                    <ListItemButton
                      LinkComponent={Link}
                      href="/u/account/commerce/collections"
                      selected={page === 'collections'}
                      sx={{ pl: 5 }}
                    >
                      <ListItemIcon>
                        <LabelIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <FormattedMessage
                            id="collections"
                            defaultMessage="Collections"
                          />
                        }
                      />
                    </ListItemButton>
                  </List>
                </Collapse>

                <ListItemButton
                  LinkComponent={Link}
                  href="/u/account/commerce/checkouts"
                  selected={page === 'checkouts'}
                >
                  <ListItemIcon>
                    <ShoppingCartCheckoutIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="checkouts"
                        defaultMessage="Checkouts"
                      />
                    }
                  />
                </ListItemButton>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9}>
            {children}
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Box py={4}>
      <Stack
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        spacing={2}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          alignContent="center"
        >
          <Typography variant="h5">
            <FormattedMessage
              id="no.wallet.connected"
              defaultMessage="No Wallet connected"
            />
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <FormattedMessage
              id="connect.wallet.to.see.apps.associated.with.your.account"
              defaultMessage="Connect wallet to see apps associated with your account"
            />
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => connectWalletDialog.setOpen(true)}
          startIcon={<Wallet />}
          endIcon={<ChevronRight />}
        >
          <FormattedMessage
            id="connect.wallet"
            defaultMessage="Connect Wallet"
            description="Connect wallet button"
          />
        </Button>
      </Stack>
    </Box>
  );
}

export default function DashboardLayout({
  children,
  page,
}: DashboardLayoutProps) {
  return (
    <AuthMainLayout noSsr>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        <RequireLogin page={page ?? ''}>
          <Container>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12}>
                {children}
              </Grid>
            </Grid>
          </Container>
        </RequireLogin>
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
}
