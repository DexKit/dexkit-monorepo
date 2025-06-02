import {
  Box,
  Button,
  Container,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import ApiIcon from '@mui/icons-material/Api';
import Close from '@mui/icons-material/Close';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  QUERY_ADMIN_WHITELABEL_CONFIG_NAME,
  useSendConfigMutation,
} from '../../../../hooks/whitelabel';

import { SiteResponse } from '../../../../types/whitelabel';
import { useAppWizardConfig } from '../../hooks';

import { isAddressEqual } from '@dexkit/core/utils';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useAuth } from '@dexkit/ui/hooks/auth';
import { AppConfig, AppPage } from '@dexkit/ui/modules/wizard/types/config';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DatasetIcon from '@mui/icons-material/Dataset';
import SettingsIcon from '@mui/icons-material/Settings';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import TourIcon from '@mui/icons-material/Tour';
import { TourProvider, useTour } from '@reactour/tour';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { BuilderKit } from '../../constants';
import { OnboardBuilderSteps } from '../../constants/onboard/steps';
import SiteWizardProvider from '../../providers/SiteWizardProvider';
import { isFirstVisitOnEditWizardAtom } from '../../state';
import BuilderKitMenu from '../BuilderKitMenu';
import { ConfirmationEmailMessage } from '../ConfirmationEmailMessage';
import { PreviewAppButton } from '../PreviewAppButton';
import { WelcomeMessage } from '../WelcomeMessage';
import SignConfigDialog from '../dialogs/SignConfigDialog';
import RankingWizardContainer from './RankingWizardContainer';

const NetworksWizardContainer = dynamic(
  () => import('./NetworksWizardContainer'),
);

const IntegrationsWizardContainer = dynamic(
  () => import('./IntegrationsWizardContainer'),
);

const UserEventAnalyticsContainer = dynamic(
  () => import('./UserEventAnalyticsContainer'),
);

const OwnershipWizardContainer = dynamic(
  () => import('./OwnershipWizardContainer'),
);
const CollectionWizardContainer = dynamic(
  () => import('./CollectionWizardContainer'),
);
const DomainWizardContainer = dynamic(() => import('./DomainWizardContainer'));
const FooterMenuWizardContainer = dynamic(
  () => import('./FooterMenuWizardContainer'),
);
const GeneralWizardContainer = dynamic(
  () => import('./GeneralWizardContainer'),
);
const MarketplaceFeeWizardContainer = dynamic(
  () => import('./MarketplaceFeeWizardContainer'),
);
const PagesMenuWizardContainer = dynamic(
  () => import('./NavbarWizardContainer'),
);
const PagesWizardContainer = dynamic(() => import('./PagesWizardContainer'));
const SeoWizardContainer = dynamic(() => import('./SeoWizardContainer'));
const SocialWizardContainer = dynamic(() => import('./SocialWizardContainer'));
const SwapFeeWizardContainer = dynamic(
  () => import('./SwapFeeWizardContainer'),
);
const ThemeWizardContainer = dynamic(() => import('./ThemeWizardContainer'));
const TokenWizardContainer = dynamic(() => import('./TokenWizardContainer'));
const TeamWizardContainer = dynamic(() => import('./TeamWizardContainer'));
const AppVersionWizardContainer = dynamic(
  () => import('./AppVersionWizardContainer'),
);
const AnalyticsWizardContainer = dynamic(
  () => import('./AnalyticsWizardContainer'),
);

interface Props {
  site?: SiteResponse | null;
}

export enum ActiveMenu {
  General = 'general',
  Domain = 'domain',
  Social = 'social',
  Team = 'team',
  Theme = 'theme',
  Pages = 'pages',
  Menu = 'menu',
  FooterMenu = 'footer-menu',
  Seo = 'seo',
  Analytics = 'analytics',
  UserEventAnalytics = 'user-event-analytics',
  MarketplaceFees = 'marketplace-fees',
  AppVersion = 'app-version',
  SwapFees = 'swap-fees',
  Collections = 'collections',
  Tokens = 'tokens',
  Ownership = 'ownership',
  Integrations = 'integrations',
  Rankings = 'rankings',
  Networks = 'networks',
}

export type PagesContextType = {
  selectedKey?: string;
  setSelectedKey: (key?: string) => void;
  setOldPage: (appPage: AppPage) => void;
  oldPage?: AppPage;
  isEditPage: boolean;
  setIsEditPage: (value: boolean) => void;
  handleCancelEdit: (hasChanges?: boolean) => void;
};

export const PagesContext = React.createContext<PagesContextType>({
  setSelectedKey: () => {},
  setIsEditPage: () => {},
  setOldPage: () => {},
  isEditPage: false,
  handleCancelEdit: (hasChanges?: boolean) => {},
});

function TourButton() {
  const { setIsOpen } = useTour();
  const [isFirstVisit, setIsFirstVisit] = useAtom(isFirstVisitOnEditWizardAtom);
  useEffect(() => {
    if (isFirstVisit) {
      setTimeout(() => {
        setIsFirstVisit(false);
        setIsOpen(true);
      }, 2000);
    }
  }, [isFirstVisit]);

  return (
    <IconButton onClick={() => setIsOpen(true)}>
      <TourIcon />
    </IconButton>
  );
}

export function EditWizardContainer({ site }: Props) {
  const config = useMemo(() => {
    if (site?.config) {
      return JSON.parse(site?.config);
    }
  }, [site?.config]);

  const router = useRouter();
  const { tab } = router.query as { tab?: ActiveMenu };
  const [hasChanges, setHasChanges] = useState(false);
  const [openHasChangesConfirm, setOpenHasChangesConfirm] = useState(false);

  const { setWizardConfig, wizardConfig } = useAppWizardConfig();

  const [selectedKey, setSelectedKey] = useState<string>();
  const [isEditPage, setIsEditPage] = useState(false);
  const [oldPage, setOldPage] = useState<AppPage>();

  const handleCancelEdit = (hasChanges?: boolean) => {
    if (hasChanges) {
      return setOpenHasChangesConfirm(true);
    }

    setSelectedKey(undefined);
    setIsEditPage(false);
    setWizardConfig({ ...config });
    setHasChanges(false);
  };

  const { formatMessage } = useIntl();
  const [openMenu, setOpenMenu] = useState({
    settings: true,
    layout: false,
    fees: false,
    data: false,
    analytics: false,
    integrations: false,
  });
  const handleClickSettings = () => {
    setOpenMenu({ ...openMenu, settings: !openMenu.settings });
  };

  const handleClickLayout = () => {
    setOpenMenu({ ...openMenu, layout: !openMenu.layout });
  };

  const handleClickFees = () => {
    setOpenMenu({ ...openMenu, fees: !openMenu.fees });
  };

  const handleClickData = () => {
    setOpenMenu({ ...openMenu, data: !openMenu.data });
  };

  const handleClickAnalytics = () => {
    setOpenMenu({ ...openMenu, analytics: !openMenu.analytics });
  };

  const handleClickIntegrations = () => {
    setOpenMenu({ ...openMenu, integrations: !openMenu.integrations });
  };

  const { isLoggedIn, user } = useAuth();

  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(
    tab || ActiveMenu.General,
  );
  const [activeMenuWithChanges, setActiveMenuWithChanges] =
    useState<ActiveMenu>(tab || ActiveMenu.General);
  const [activeBuilderKit, setActiveBuilderKit] = useState<BuilderKit>(
    BuilderKit.ALL,
  );

  const handleChangeTab = (mn: ActiveMenu) => {
    if (hasChanges) {
      setActiveMenuWithChanges(mn);
      setOpenHasChangesConfirm(true);
    } else {
      setActiveMenu(mn);
    }

    /*const url = new URL(location);
    url.searchParams.set('tab', mn);
    history.pushState({}, '', url);*/
    /*router.push(
      {
        pathname: `/admin/edit/${site?.slug}`,
        query: { tab: mn, slug: site?.slug },
      },
      `/admin/edit/${site?.slug}?tab=${mn}`,
      { shallow: true },
    );*/
  };

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sendConfigMutation = useSendConfigMutation({ slug: site?.slug });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showPreview, setShowPreview] = useState(false);

  const [showSendingConfig, setShowSendingConfig] = useState(false);

  const [showConfirmSendConfig, setShowConfirmSendConfig] = useState(false);
  const { account } = useWeb3React();

  useEffect(() => {
    if (config) {
      setWizardConfig({ ...config });
    }
  }, [activeMenu, config]);

  // Pages forms
  const handleCloseConfirmSendConfig = () => {
    setShowConfirmSendConfig(false);
  };

  const queryClient = useQueryClient();

  const handleConfirmSendConfig = async () => {
    setShowConfirmSendConfig(false);
    const newSite = { ...site, config: wizardConfig };

    await sendConfigMutation.mutateAsync(newSite, {
      onSuccess: () => {
        setHasChanges(false);
        queryClient.invalidateQueries([QUERY_ADMIN_WHITELABEL_CONFIG_NAME]);
      },
    });

    setShowSendingConfig(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleShowMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseSendingConfig = () => {
    setShowSendingConfig(false);
    sendConfigMutation.reset();
  };

  const handleSave = (_config: AppConfig) => {
    setShowConfirmSendConfig(true);

    const newConfig = { ...wizardConfig, ..._config };

    setWizardConfig(newConfig);
  };

  const handleChange = useCallback(
    (_config: AppConfig) => {
      const newConfig = { ..._config };

      setWizardConfig(newConfig);
    },

    [wizardConfig, setWizardConfig],
  );

  const renderMenu = () => (
    <Box
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        position: 'sticky',
        top: 0,
      }}
    >
      <nav aria-label="settings">
        <List disablePadding>
          <ListItemButton onClick={handleClickSettings}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>

            <ListItemText
              primary={
                <FormattedMessage id="settings" defaultMessage={'Settings'} />
              }
            />
            {openMenu.settings ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openMenu.settings} timeout="auto" unmountOnExit>
            <List component="div" sx={{ pl: 4 }}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeMenu === ActiveMenu.General}
                  onClick={() => handleChangeTab(ActiveMenu.General)}
                >
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="general"
                        defaultMessage={'General'}
                      />
                    }
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeMenu === ActiveMenu.Domain}
                  onClick={() => handleChangeTab(ActiveMenu.Domain)}
                >
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="domains"
                        defaultMessage={'Domain'}
                      />
                    }
                  />
                </ListItemButton>
              </ListItem>

              {site?.owner?.toLowerCase() === user?.address?.toLowerCase() && (
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeMenu === ActiveMenu.Team}
                    onClick={() => handleChangeTab(ActiveMenu.Team)}
                  >
                    <ListItemText
                      primary={
                        <FormattedMessage id="team" defaultMessage={'Team'} />
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )}
              {site?.owner?.toLowerCase() === user?.address?.toLowerCase() && (
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeMenu === ActiveMenu.AppVersion}
                    onClick={() => handleChangeTab(ActiveMenu.AppVersion)}
                  >
                    <ListItemText
                      primary={
                        <FormattedMessage
                          id="version"
                          defaultMessage={'Version'}
                        />
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeMenu === ActiveMenu.Ownership}
                  onClick={() => handleChangeTab(ActiveMenu.Ownership)}
                >
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="ownership"
                        defaultMessage={'Ownership'}
                      />
                    }
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeMenu === ActiveMenu.Social}
                  onClick={() => handleChangeTab(ActiveMenu.Social)}
                >
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="social.media"
                        defaultMessage={'Social Media'}
                      />
                    }
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </nav>
      <Divider />
      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItemButton onClick={handleClickLayout}>
            <ListItemIcon>
              <SpaceDashboardIcon />
            </ListItemIcon>

            <ListItemText
              primary={
                <FormattedMessage id="layout" defaultMessage={'Layout'} />
              }
            />
            {openMenu.layout ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openMenu.layout} timeout="auto" unmountOnExit>
            <List component="div" sx={{ pl: 4 }}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeMenu === ActiveMenu.Theme}
                  onClick={() => handleChangeTab(ActiveMenu.Theme)}
                >
                  <ListItemText
                    primary={
                      <FormattedMessage id="theme" defaultMessage={'Theme'} />
                    }
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleChangeTab(ActiveMenu.Pages)}
                  selected={activeMenu === ActiveMenu.Pages}
                >
                  <ListItemText
                    primary={
                      <FormattedMessage id="pages" defaultMessage={'Pages'} />
                    }
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleChangeTab(ActiveMenu.Menu)}
                  selected={activeMenu === ActiveMenu.Menu}
                >
                  <ListItemText
                    primary={
                      <FormattedMessage id="navbar" defaultMessage={'Navbar'} />
                    }
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleChangeTab(ActiveMenu.FooterMenu)}
                  selected={activeMenu === ActiveMenu.FooterMenu}
                >
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="footer.menu"
                        defaultMessage={'Footer Menu'}
                      />
                    }
                  />
                </ListItemButton>
              </ListItem>
              <ListItem
                disablePadding
                onClick={() => handleChangeTab(ActiveMenu.Seo)}
                selected={activeMenu === ActiveMenu.Seo}
              >
                <ListItemButton>
                  <ListItemText
                    primary={
                      <FormattedMessage id="seo" defaultMessage={'SEO'} />
                    }
                  />
                </ListItemButton>
              </ListItem>
              <ListItem
                disablePadding
                onClick={() => handleChangeTab(ActiveMenu.Analytics)}
                selected={activeMenu === ActiveMenu.Analytics}
              >
                <ListItemButton>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="analytics"
                        defaultMessage={'Analytics'}
                      />
                    }
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </nav>
      <Divider />
      <nav aria-label="fees">
        <List>
          <ListItemButton onClick={handleClickFees}>
            <ListItemIcon>
              <CurrencyExchangeIcon />
            </ListItemIcon>

            <ListItemText
              primary={<FormattedMessage id="fee" defaultMessage={'Fees'} />}
            />
            {openMenu.fees ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openMenu.fees} timeout="auto" unmountOnExit>
            <List component="div" sx={{ pl: 4 }}>
              {activeBuilderKit !== BuilderKit.Swap && (
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeMenu === ActiveMenu.MarketplaceFees}
                    onClick={() => handleChangeTab(ActiveMenu.MarketplaceFees)}
                  >
                    <ListItemText
                      primary={
                        <FormattedMessage
                          id="marketplace.fees.menu.container"
                          defaultMessage={'Marketplace Fees'}
                        />
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )}
              {activeBuilderKit !== BuilderKit.NFT && (
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeMenu === ActiveMenu.SwapFees}
                    onClick={() => handleChangeTab(ActiveMenu.SwapFees)}
                  >
                    <ListItemText
                      primary={
                        <FormattedMessage
                          id="swap.fees.menu.container"
                          defaultMessage={'Swap Fees'}
                        />
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </Collapse>
        </List>
      </nav>
      <Divider />
      <nav aria-label="data">
        <List>
          <ListItemButton onClick={handleClickData}>
            <ListItemIcon>
              <DatasetIcon />
            </ListItemIcon>

            <ListItemText
              primary={<FormattedMessage id="data" defaultMessage={'Data'} />}
            />
            {openMenu.data ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openMenu.data} timeout="auto" unmountOnExit>
            <List component="div" sx={{ pl: 4 }}>
              {activeBuilderKit !== BuilderKit.Swap && (
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeMenu === ActiveMenu.Collections}
                    onClick={() => handleChangeTab(ActiveMenu.Collections)}
                  >
                    <ListItemText
                      primary={
                        <FormattedMessage
                          id="collections"
                          defaultMessage={'Collections'}
                        />
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeMenu === ActiveMenu.Tokens}
                  onClick={() => handleChangeTab(ActiveMenu.Tokens)}
                >
                  <ListItemText
                    primary={
                      <FormattedMessage id="tokens" defaultMessage={'Tokens'} />
                    }
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeMenu === ActiveMenu.Networks}
                  onClick={() => handleChangeTab(ActiveMenu.Networks)}
                >
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="networks"
                        defaultMessage="Networks"
                      />
                    }
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </nav>
      {true && (
        <nav aria-label="analytics">
          <List>
            <ListItemButton onClick={handleClickAnalytics}>
              <ListItemIcon>
                <AnalyticsIcon />
              </ListItemIcon>

              <ListItemText
                primary={
                  <FormattedMessage
                    id="analytics"
                    defaultMessage={'Analytics'}
                  />
                }
              />
              {openMenu.analytics ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openMenu.analytics} timeout="auto" unmountOnExit>
              <List component="div" sx={{ pl: 4 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeMenu === ActiveMenu.UserEventAnalytics}
                    onClick={() =>
                      handleChangeTab(ActiveMenu.UserEventAnalytics)
                    }
                  >
                    <ListItemText
                      primary={
                        <FormattedMessage
                          id="events"
                          defaultMessage={'Events'}
                        />
                      }
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem
                  disablePadding
                  onClick={() => handleChangeTab(ActiveMenu.Rankings)}
                  selected={activeMenu === ActiveMenu.Rankings}
                >
                  <ListItemButton>
                    <ListItemText
                      primary={
                        <FormattedMessage
                          id="leaderboard"
                          defaultMessage={'Leaderboard'}
                        />
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </List>
        </nav>
      )}
      {isAddressEqual(site?.owner, account) && (
        <nav aria-label="integrations">
          <List>
            <ListItemButton onClick={handleClickIntegrations}>
              <ListItemIcon>
                <ApiIcon />
              </ListItemIcon>

              <ListItemText
                primary={
                  <FormattedMessage
                    id="integrations"
                    defaultMessage="Integrations"
                  />
                }
              />
              {openMenu.integrations ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openMenu.integrations} timeout="auto" unmountOnExit>
              <List component="div" sx={{ pl: 4 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={activeMenu === ActiveMenu.Integrations}
                    onClick={() => handleChangeTab(ActiveMenu.Integrations)}
                  >
                    <ListItemText
                      primary={
                        <FormattedMessage
                          id="general"
                          defaultMessage="General"
                        />
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </List>
        </nav>
      )}
      {/*  <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2 }}>
        <Typography>v{AppVersion.version}</Typography>
                    </Box>*/}
    </Box>
  );

  return (
    <TourProvider
      steps={OnboardBuilderSteps({
        onChangeMenu: handleChangeTab,
        onChangeSidebar: setOpenMenu,
      })}
      styles={{
        popover: (base) => ({
          ...base,
          background: theme.palette.background.default,
        }),
        maskWrapper: (base) => ({
          ...base,
          zIndex: 20000,
        }),
        badge: (base) => ({ ...base, color: 'blue' }),
      }}
    >
      <Drawer open={isMenuOpen} onClose={handleCloseMenu}>
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
              <IconButton onClick={handleClosePreview}>
                <Close />
              </IconButton>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>{renderMenu()}</Box>
        </Box>
      </Drawer>

      <NextSeo
        title={formatMessage({
          id: 'app.builder.setup',
          defaultMessage: 'App Builder Setup',
        })}
      />
      <AppConfirmDialog
        DialogProps={{
          open: openHasChangesConfirm,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: () => setOpenHasChangesConfirm(false),
        }}
        onConfirm={() => {
          setHasChanges(false);
          setOpenHasChangesConfirm(false);
          setActiveMenu(activeMenuWithChanges);
          setWizardConfig(config);
          setIsEditPage(false);
          setSelectedKey(undefined);
        }}
        title={
          <FormattedMessage
            id="Leave.without.saving"
            defaultMessage="Leave Without Saving "
          />
        }
        actionCaption={<FormattedMessage id="leave" defaultMessage="Leave" />}
        cancelCaption={<FormattedMessage id="stay" defaultMessage="Stay" />}
      >
        <Typography variant="body1">
          <FormattedMessage
            id="you.have.unsaved.changes."
            defaultMessage="You have unsaved changes."
          />
        </Typography>
        <Typography variant="body1">
          <FormattedMessage
            id="are.you.sure.you.want.to.leave.without.saving"
            defaultMessage="Are you sure you want to leave without saving?"
          />
        </Typography>
      </AppConfirmDialog>

      <AppConfirmDialog
        DialogProps={{
          open: showConfirmSendConfig,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseConfirmSendConfig,
        }}
        onConfirm={handleConfirmSendConfig}
        actionCaption={<FormattedMessage id="save" defaultMessage="Save" />}
        title={
          <FormattedMessage id="save.changes" defaultMessage="Save Changes" />
        }
      >
        <Stack spacing={1}>
          <Typography variant="body1">
            <FormattedMessage
              id="are.you.sure.you.want.to.save.your.changes"
              defaultMessage="Are you sure you want to save your changes?"
            />
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <FormattedMessage
              id="your.settings.will.be.sent.to.the.server"
              defaultMessage="Your settings will be sent to the server."
            />
          </Typography>
        </Stack>
      </AppConfirmDialog>
      <SignConfigDialog
        dialogProps={{
          open: showSendingConfig,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseSendingConfig,
        }}
        isLoading={sendConfigMutation.isLoading}
        isSuccess={sendConfigMutation.isSuccess}
        error={sendConfigMutation.error}
        isEdit={true}
      />
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
                      <FormattedMessage id="admin" defaultMessage="Admin" />
                    ),
                    uri: '/admin',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="manage.apps"
                        defaultMessage="Manage Apps"
                      />
                    ),
                    uri: '/admin',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="edit.app"
                        defaultMessage="Edit App"
                      />
                    ),
                    uri: '/admin/edit',
                    active: true,
                  },
                ]}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12}>
            <div className={'welcome-dex-app-builder'}>
              <WelcomeMessage />
            </div>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              {!isMobile && (
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                  <Typography variant="h5">
                    <FormattedMessage id="edit.app" defaultMessage="Edit App" />
                  </Typography>

                  {/* <TourButton />*/}
                </Stack>
              )}

              {isMobile && (
                <Button
                  onClick={handleShowMenu}
                  size="small"
                  variant="outlined"
                >
                  <FormattedMessage id="menu" defaultMessage="Menu" />
                </Button>
              )}
              {!site?.emailVerified && isLoggedIn && (
                <ConfirmationEmailMessage site={site} />
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Stack
              direction={'row'}
              spacing={1}
              justifyContent={'space-between'}
            >
              <BuilderKitMenu
                menu={activeBuilderKit}
                onChangeMenu={(menu) => setActiveBuilderKit(menu)}
              />
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <PreviewAppButton appConfig={wizardConfig} site={site?.slug} />
                {site?.previewUrl && (
                  <Button
                    href={site?.previewUrl}
                    target={'_blank'}
                    startIcon={<LinkIcon />}
                  >
                    <FormattedMessage id="open.url" defaultMessage="Open url" />
                  </Button>
                )}
              </Stack>
            </Stack>
          </Grid>
          {/* <Grid item xs={12} sm={12}>
            <Stack spacing={2} direction={'row'} alignItems={'center'}>
              <Typography variant="body2" sx={{ maxWidth: '300px' }}>
                <FormattedMessage
                  id={'dexappbuilder.kits.explainer'}
                  defaultMessage={
                    'Select the KIT containing the features you wish to preview for creating your app.'
                  }
                ></FormattedMessage>
              </Typography>
              <BuilderKitMenu
                menu={activeBuilderKit}
                onChangeMenu={(menu) => setActiveBuilderKit(menu)}
              />
                </Stack>
          </Grid>*/}

          <Grid item xs={12} sm={2} sx={{}}>
            {!isMobile && renderMenu()}
          </Grid>
          <Grid item xs={12} sm={0.1}></Grid>
          <Grid item xs={12} sm={9.8}>
            <Box>
              <SiteWizardProvider siteId={site?.id}>
                <Stack spacing={2} className={'builder-forms'}>
                  {activeMenu === ActiveMenu.General && config && (
                    <GeneralWizardContainer
                      config={config}
                      onSave={handleSave}
                      onChange={handleChange}
                      onHasChanges={setHasChanges}
                    />
                  )}
                  {activeMenu === ActiveMenu.AppVersion &&
                    config &&
                    site?.owner?.toLowerCase() ===
                      user?.address?.toLowerCase() && (
                      <AppVersionWizardContainer site={site} />
                    )}

                  {activeMenu === ActiveMenu.Domain && config && (
                    <DomainWizardContainer
                      config={config}
                      onSave={handleSave}
                      onHasChanges={setHasChanges}
                      site={site}
                    />
                  )}

                  {activeMenu === ActiveMenu.Team &&
                    site?.owner?.toLowerCase() ===
                      user?.address?.toLowerCase() && (
                      <TeamWizardContainer site={site} />
                    )}

                  {activeMenu === ActiveMenu.Ownership && config && (
                    <OwnershipWizardContainer
                      config={config}
                      onSave={handleSave}
                      onHasChanges={setHasChanges}
                      site={site}
                    />
                  )}

                  {activeMenu === ActiveMenu.Theme && config && (
                    <ThemeWizardContainer
                      config={config}
                      showSwap={activeBuilderKit === BuilderKit.Swap}
                      onSave={handleSave}
                      onChange={handleChange}
                      onHasChanges={setHasChanges}
                    />
                  )}

                  {activeMenu === ActiveMenu.Pages && config && (
                    <>
                      <PagesContext.Provider
                        value={{
                          selectedKey,
                          setSelectedKey,
                          isEditPage,
                          setIsEditPage,
                          handleCancelEdit,
                          setOldPage,
                          oldPage,
                        }}
                      >
                        <PagesWizardContainer
                          config={config}
                          onSave={handleSave}
                          onChange={handleChange}
                          onHasChanges={setHasChanges}
                          hasChanges={hasChanges}
                          builderKit={activeBuilderKit}
                          siteSlug={site?.slug}
                          previewUrl={site?.previewUrl}
                        />
                      </PagesContext.Provider>
                    </>
                  )}

                  {activeMenu === ActiveMenu.MarketplaceFees && config && (
                    <MarketplaceFeeWizardContainer
                      config={config}
                      onHasChanges={setHasChanges}
                      onSave={handleSave}
                    />
                  )}

                  {activeMenu === ActiveMenu.SwapFees && config && (
                    <SwapFeeWizardContainer
                      config={config}
                      onSave={handleSave}
                      onHasChanges={setHasChanges}
                    />
                  )}
                  {activeMenu === ActiveMenu.Collections && (
                    <CollectionWizardContainer
                      site={site}
                      config={config}
                      onHasChanges={setHasChanges}
                      onSave={handleSave}
                    />
                  )}

                  {activeMenu === ActiveMenu.Menu && config && (
                    <PagesMenuWizardContainer
                      config={config}
                      onHasChanges={setHasChanges}
                      onSave={handleSave}
                      onChange={handleChange}
                    />
                  )}

                  {activeMenu === ActiveMenu.Rankings &&
                    site?.owner?.toLowerCase() ===
                      user?.address?.toLowerCase() && (
                      <RankingWizardContainer siteId={site?.id} />
                    )}

                  {activeMenu === ActiveMenu.Tokens && config && (
                    <TokenWizardContainer
                      config={config}
                      site={site}
                      onSave={handleSave}
                      onHasChanges={setHasChanges}
                    />
                  )}

                  {activeMenu === ActiveMenu.Seo && config && (
                    <SeoWizardContainer
                      config={config}
                      onSave={handleSave}
                      onHasChanges={setHasChanges}
                    />
                  )}

                  {activeMenu === ActiveMenu.Analytics && config && (
                    <AnalyticsWizardContainer
                      config={config}
                      onHasChanges={setHasChanges}
                      onSave={handleSave}
                    />
                  )}
                  {activeMenu === ActiveMenu.Social && config && (
                    <SocialWizardContainer
                      config={config}
                      onSave={handleSave}
                      onChange={handleChange}
                      onHasChanges={setHasChanges}
                    />
                  )}
                  {activeMenu === ActiveMenu.FooterMenu && config && (
                    <FooterMenuWizardContainer
                      config={config}
                      onHasChanges={setHasChanges}
                      onSave={handleSave}
                      onChange={handleChange}
                    />
                  )}
                  {activeMenu === ActiveMenu.UserEventAnalytics && config && (
                    <UserEventAnalyticsContainer siteId={site?.id} />
                  )}

                  {activeMenu === ActiveMenu.Integrations && config && (
                    <IntegrationsWizardContainer siteId={site?.id} />
                  )}

                  {activeMenu === ActiveMenu.Networks && config && (
                    <NetworksWizardContainer
                      siteId={site?.id}
                      config={config}
                      onSave={handleSave}
                      onChange={handleChange}
                      onHasChanges={setHasChanges}
                    />
                  )}
                </Stack>
              </SiteWizardProvider>
            </Box>
            {/*false && theme && (
            <Grid item xs={12} sm={6}>
              <ThemeProvider theme={selectedTheme ? selectedTheme : theme}>
                <Container>
                  <PagePreviewPaper
                    sections={currentPage.sections}
                    name={currentPage.title || 'Home'}
                    hideButtons={currentPage?.key !== 'home'}
                  />
                </Container>
              </ThemeProvider>
            </Grid>
          )*/}
          </Grid>
        </Grid>
      </Container>
    </TourProvider>
  );
}
