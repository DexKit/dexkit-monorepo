import { DRAWER_WIDTH } from '@/modules/common/constants';
import { AttachMoney, Language, Menu as MuiMenu } from '@mui/icons-material';
import Settings from '@mui/icons-material/Settings';
import {
  AppBar as MuiAppBar,
  AppBarProps,
  Avatar,
  Box,
  ButtonBase,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  NoSsr,
  Stack,
  styled,
  Toolbar,
  Typography,
} from '@mui/material';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { appStateAtom, showNotificationsAtom } from '../atoms';
import { AppNotificationsBadge } from './dialogs/AppNotificationsBadge';
import SelectCurrencyDialog from './dialogs/SelectCurrencyDialog';
import SelectLanguageDialog from './dialogs/SelectLanguageDialog';
import Link from './Link';

interface NavbarProps extends AppBarProps {
  open: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<NavbarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface Props {
  open: boolean;
  onOpenDrawer: () => void;
}

export default function AppNavbar({ open, onOpenDrawer }: Props) {
  const setOpen = useUpdateAtom(showNotificationsAtom);

  const handleOpenNotifications = () => {
    setOpen(true);
  };

  const [anchorMenuEl, setAnchorMenuEl] = useState<HTMLElement | null>(null);

  const [showSelectCurrency, setShowSelectCurrency] = useState(false);
  const [showSelectLocale, setShowSelectLocale] = useState(false);

  const handleSettingsMenuClose = () => {
    setAnchorMenuEl(null);
  };

  const handleShowSelectLocaleDialog = () => {
    setShowSelectLocale(true);
    handleSettingsMenuClose();
  };

  const handleShowSelectCurrencyDialog = () => {
    setShowSelectCurrency(true);
    handleSettingsMenuClose();
  };

  const handleCloseCurrencySelect = () => {
    setShowSelectCurrency(false);
  };

  const handleCloseLocaleSelect = () => {
    setShowSelectLocale(false);
  };

  const handleSettingsMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const { currency, locale, profileNft } = useAtomValue(appStateAtom);

  return (
    <>
      <Menu
        id="settings-menu"
        anchorEl={anchorMenuEl}
        open={Boolean(anchorMenuEl)}
        onClose={handleSettingsMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
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
      </Menu>
      <SelectCurrencyDialog
        dialogProps={{
          open: showSelectCurrency,
          onClose: handleCloseCurrencySelect,
          fullWidth: true,
          maxWidth: 'xs',
        }}
      />
      <SelectLanguageDialog
        dialogProps={{
          open: showSelectLocale,
          onClose: handleCloseLocaleSelect,
          fullWidth: true,
          maxWidth: 'xs',
        }}
      />
      <AppBar position="fixed" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={onOpenDrawer}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MuiMenu />
            </IconButton>
          </Box>

          <Stack
            spacing={1}
            direction="row"
            alignItems="center"
            alignContent="center"
          >
            <IconButton onClick={handleOpenNotifications}>
              <NoSsr>
                <AppNotificationsBadge />
              </NoSsr>
            </IconButton>
            <IconButton onClick={handleSettingsMenuClick}>
              <Settings />
            </IconButton>
            <NoSsr>
              <ButtonBase
                sx={(theme) => ({
                  borderRadius: '50%',
                  width: { xs: theme.spacing(4), sm: theme.spacing(5) },
                  height: { xs: theme.spacing(4), sm: theme.spacing(5) },
                })}
                LinkComponent={Link}
                href="/profile"
              >
                <Avatar
                  sx={(theme) => ({
                    backgroundColor: theme.palette.action.hover,
                    width: { xs: theme.spacing(4), sm: theme.spacing(5) },
                    height: { xs: theme.spacing(4), sm: theme.spacing(5) },
                  })}
                  src={profileNft?.image}
                />
              </ButtonBase>
            </NoSsr>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}
