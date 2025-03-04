import Box from '@mui/material/Box';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import Close from '@mui/icons-material/Close';
import {
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import UserGeneralForm from './forms/UserGeneralForm';

interface Props {
  username?: string;
  name?: string;
  profileImageURL?: string;
  backgroundImageURL?: string;
  bio?: string;
  shortBio?: string;
  createdBy?: string;
}

enum ActiveMenu {
  General,
  Accounts,
  Airdrop,
}

const ListSubheaderCustom = styled(ListSubheader)({
  fontWeight: 'bold',
});

export function UserEdit(props: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(ActiveMenu.General);

  const renderMenu = () => (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="settings">
        <List
          disablePadding
          subheader={
            <ListSubheaderCustom>
              <FormattedMessage id="settings" defaultMessage={'Settings'} />
            </ListSubheaderCustom>
          }
        >
          <ListItem disablePadding>
            <ListItemButton
              selected={activeMenu === ActiveMenu.General}
              onClick={() => setActiveMenu(ActiveMenu.General)}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="general" defaultMessage={'General'} />
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeMenu === ActiveMenu.Accounts}
              onClick={() => setActiveMenu(ActiveMenu.Accounts)}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="accounts" defaultMessage={'Accounts'} />
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeMenu === ActiveMenu.Airdrop}
              onClick={() => setActiveMenu(ActiveMenu.Airdrop)}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="Airdrop" defaultMessage={'Airdrop'} />
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );

  return (
    <>
      <Drawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <Box
          sx={(theme) => ({ minWidth: `${theme.breakpoints.values.sm / 2}px` })}
        >
          <Box sx={{ p: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <Typography sx={{ fontWeight: 600 }} variant="subtitle1">
                <FormattedMessage id="menu" defaultMessage="Menu" />
              </Typography>
              <IconButton onClick={() => setIsMenuOpen(false)}>
                <Close />
              </IconButton>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>{renderMenu()}</Box>
        </Box>
      </Drawer>
      <Container maxWidth={'xl'}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage id="home" defaultMessage="Home" />
                    ),
                    uri: '/',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="user.name.variable"
                        defaultMessage="User: "
                      />
                    ),
                    uri: '/user/profile',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="user.edit"
                        defaultMessage="User Edit"
                      />
                    ),
                    uri: '/user/profile/edit',
                  },
                ]}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              {!isMobile && (
                <Typography variant="h5">
                  <FormattedMessage id="user.edit" defaultMessage="User Edit" />
                </Typography>
              )}

              {isMobile && (
                <Button
                  onClick={() => setIsMenuOpen(true)}
                  size="small"
                  variant="outlined"
                >
                  <FormattedMessage id="menu" defaultMessage="Menu" />
                </Button>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={2}>
            {!isMobile && renderMenu()}
          </Grid>
          <Grid item xs={12} sm={10}>
            <Stack spacing={2}>
              {activeMenu === ActiveMenu.General && <UserGeneralForm />}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
