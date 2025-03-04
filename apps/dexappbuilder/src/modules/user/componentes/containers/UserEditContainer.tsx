import Box from '@mui/material/Box';

import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import { UserOptions } from '@dexkit/ui/types/ai';
import Close from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
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
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useAuthUserQuery, useUpsertUserMutation } from '../../hooks';
import UpsertUserDialog from '../dialogs/UpsertuserDialog';
import UserGeneralForm from '../forms/UserGeneralForm';
import { UserAccounts } from '../UserAccounts';
import { UserSocials } from '../UserSocials';

export enum ActiveMenu {
  General = 'general',
  Accounts = 'accounts',
  Socials = 'socials',
}

interface Props {
  initialActiveMenu?: ActiveMenu;
  hideSideBar?: boolean;
  hideHeader?: boolean;
  hideTitle?: boolean;
}

const ListSubheaderCustom = styled(ListSubheader)({
  fontWeight: 'bold',
});

export function UserEditContainer({
  initialActiveMenu,
  hideSideBar,
  hideHeader,
  hideTitle,
}: Props) {
  const userQuery = useAuthUserQuery();
  const router = useRouter();
  const { tab } = router.query as { tab?: ActiveMenu };
  const user = userQuery.data;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [userForm, setUserForm] = useState<UserOptions>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeMenu = tab || initialActiveMenu || ActiveMenu.General;

  const handleChangetab = (mn: ActiveMenu) => {
    router.replace({
      pathname: '/u/edit',
      query: { tab: mn },
    });
  };

  const upsertUserMutation = useUpsertUserMutation();
  const [showUpsertUser, setShowUpsertUser] = useState(false);

  const [showConfirmUpsertUser, setShowConfirmUpsertUser] = useState(false);
  const handleCloseConfirmSendConfig = () => {
    setShowConfirmUpsertUser(false);
  };

  const handleConfirmSendConfig = async () => {
    setShowConfirmUpsertUser(false);
    setShowUpsertUser(true);
    upsertUserMutation.mutate(userForm);
  };

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
              onClick={() => handleChangetab(ActiveMenu.General)}
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
              onClick={() => handleChangetab(ActiveMenu.Accounts)}
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
              selected={activeMenu === ActiveMenu.Socials}
              onClick={() => handleChangetab(ActiveMenu.Socials)}
            >
              <ListItemText
                primary={
                  <FormattedMessage id="socials" defaultMessage={'Socials'} />
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
      <AppConfirmDialog
        DialogProps={{
          open: showConfirmUpsertUser,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseConfirmSendConfig,
        }}
        onConfirm={handleConfirmSendConfig}
      >
        <Stack>
          <Typography variant="h5" align="center">
            <FormattedMessage
              id="create.user.profile"
              defaultMessage="Create user profile"
            />
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            <FormattedMessage
              id="do.you.really.want.to.create.your.user.profile"
              defaultMessage="Do you really want to create your user profile?"
            />
          </Typography>
        </Stack>
      </AppConfirmDialog>
      <UpsertUserDialog
        dialogProps={{
          open: showUpsertUser,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: () => setShowUpsertUser(false),
        }}
        isLoading={upsertUserMutation.isLoading}
        isSuccess={upsertUserMutation.isSuccess}
        error={upsertUserMutation.error}
        isEdit={user !== undefined}
      />
      <Container maxWidth={'xl'}>
        <Grid container spacing={2}>
          {hideHeader !== true && (
            <Grid item xs={12}>
              <Stack
                direction="row"
                alignItems="center"
                alignContent="center"
                justifyContent="space-between"
              >
                {user && (
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
                            defaultMessage="User: {username}"
                            values={{
                              username: user.username,
                            }}
                          />
                        ),
                        uri: `/u/${user.username}`,
                      },
                      {
                        caption: (
                          <FormattedMessage
                            id="edit.profile"
                            defaultMessage="Edit profile"
                          />
                        ),
                        uri: `/u/${user.username}/edit`,
                        active: true,
                      },
                    ]}
                  />
                )}
              </Stack>
            </Grid>
          )}

          {hideTitle !== true && (
            <Grid item xs={12} sm={12}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Box display={'flex'} alignItems={'center'}>
                  <Typography variant="h5">
                    {user && (
                      <FormattedMessage
                        id="edit.user.profile"
                        defaultMessage="Edit user profile: {username}"
                        values={{
                          username: user.username,
                        }}
                      />
                    )}
                  </Typography>
                  <Tooltip
                    title={
                      <FormattedMessage
                        id="view.public.profile"
                        defaultMessage="View public profile"
                      />
                    }
                  >
                    <IconButton href={`/u/${user?.username}`}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </Box>

                {isMobile && hideSideBar !== true && (
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
          )}
          {hideSideBar !== true && (
            <Grid item xs={12} sm={2}>
              {!isMobile && renderMenu()}
            </Grid>
          )}
          <Grid item xs={12} sm={10}>
            <Stack spacing={2}>
              {activeMenu === ActiveMenu.General && user && (
                <>
                  <Typography variant="h5">
                    <FormattedMessage
                      id={'general'}
                      defaultMessage={'General'}
                    />
                  </Typography>
                  <UserGeneralForm
                    initialValues={user}
                    onSubmit={(val) => {
                      setUserForm(val);
                      setShowConfirmUpsertUser(true);
                    }}
                  />
                </>
              )}
              {activeMenu === ActiveMenu.Accounts && user && (
                <UserAccounts accounts={user.accounts} />
              )}
              {activeMenu === ActiveMenu.Socials && user && (
                <UserSocials credentials={user.credentials} />
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
