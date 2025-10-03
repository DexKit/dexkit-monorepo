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
import Close from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AdminSidebarContainer from '@dexkit/ui/modules/wizard/components/AdminSidebarContainer';

import CommerceContainerRenderer from '@dexkit/ui/modules/commerce/components/containers/CommerceContainerRenderer';

import {
  QUERY_ADMIN_WHITELABEL_CONFIG_NAME,
  useSendConfigMutation,
} from '../../../../hooks/whitelabel';

import { useAppWizardConfig } from '../../hooks';

import { isAddressEqual } from '@dexkit/core/utils';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useAuth } from '@dexkit/ui/hooks/auth';
import {
  AppConfig,
  AppPage,
  SiteResponse,
} from '@dexkit/ui/modules/wizard/types/config';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import TourIcon from '@mui/icons-material/Tour';
import { TourProvider, useTour } from '@reactour/tour';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { ErrorBoundary } from 'react-error-boundary';
import { BuilderKit } from '../../constants';
import { OnboardBuilderSteps } from '../../constants/onboard/steps';
import SiteWizardProvider from '../../providers/SiteWizardProvider';
import { isFirstVisitOnEditWizardAtom } from '../../state';
import BuilderKitMenu from '../BuilderKitMenu';
/* import { ConfirmationEmailMessage } from '../ConfirmationEmailMessage'; */
import { PreviewAppButton } from '../PreviewAppButton';
/* import { WelcomeMessage } from '../WelcomeMessage'; */
import { AdminWidgetsContainer } from '../../widget/components/containers/AdminWidgetsContainer';
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

const PoweredByWizardContainer = dynamic(
  () => import('./PoweredByWizardContainer'),
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

const CreateContractContainer = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/contract-wizard/components/containers/CreateContractContainer'
    ),
);

const ListContractContainer = dynamic(() => import('./ListContractContainer'));

interface Props {
  site?: SiteResponse | null;
}

export enum ActiveMenu {
  General = 'settings.general',
  Domain = 'settings.domain',
  Social = 'settings.social',
  Team = 'settings.team',
  Theme = 'layout.theme',
  Pages = 'layout.pages',
  Menu = 'layout.navbar',
  FooterMenu = 'layout.footer.menu',
  Seo = 'layout.seo',
  Analytics = 'layout.analytics',
  UserEventAnalytics = 'analytics.events',
  MarketplaceFees = 'fees.marketplace.fees',
  AppVersion = 'settings.version',
  SwapFees = 'swap-fees',
  Collections = 'data.collections',
  Tokens = 'data.tokens',
  Ownership = 'settings.ownership',
  PoweredBy = 'settings.powered.by',
  Integrations = 'settings.integrations',
  Rankings = 'analytics.leaderboard',
  Networks = 'data.networks',
  CreateContract = 'create.contracts',
  ManageContract = 'manage.contracts',
  ManageWidgets = 'manage.widgets',
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
      const parsedConfig = JSON.parse(site?.config);
      // Check if pre generated pages exists
      if (parsedConfig.pages && !parsedConfig.pages['swap']) {
        parsedConfig.pages['swap'] = {
          key: 'swap',
          title: 'Swap',
          sections: [
            {
              type: 'swap',
              title: 'Swap',
            },
          ],
        };
      }
      if (parsedConfig.pages && !parsedConfig.pages['wallet']) {
        parsedConfig.pages['wallet'] = {
          key: 'wallet',
          title: 'Wallet',
          sections: [
            {
              type: 'wallet',
              title: 'Wallet',
            },
          ],
        };
      }
      return parsedConfig;
    }
  }, [site?.config]);

  const router = useRouter();
  const { tab } = router.query as { tab?: ActiveMenu };
  const [hasChanges, setHasChanges] = useState(false);
  const [openHasChangesConfirm, setOpenHasChangesConfirm] = useState(false);

  const { setWizardConfig, wizardConfig } = useAppWizardConfig();

  const [selectedKey, setSelectedKey] = useState<string>();
  const [isEditPage, setIsEditPage] = useState(false);

  const [contractAddress, setContractAddress] = useState<string>('');
  const [contractNetwork, setContractNetwork] = useState<string>('');

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

  const handleSave = (_config: Partial<AppConfig>) => {
    setShowConfirmSendConfig(true);

    const newConfig = { ...wizardConfig, ..._config };

    setWizardConfig(newConfig);
  };

  const handleChange = useCallback(
    (_config: Partial<AppConfig>) => {
      const newConfig = { ..._config };

      setWizardConfig(newConfig);
    },

    [wizardConfig, setWizardConfig],
  );

  const renderMenu = () => {
    return (
      <AdminSidebarContainer
        activeBuilderKit={activeBuilderKit}
        isSiteOwner={isAddressEqual(site?.owner, account)}
        onChangeMenu={(menuId: string) => {
          handleChangeTab(menuId as ActiveMenu);
          if (window.innerWidth < 960) {
            handleCloseMenu();
          }
        }}
        activeMenuId={activeMenu as string}
        commerceEnabled={true}
      />
    );
  };

  return (
    <TourProvider
      steps={OnboardBuilderSteps({
        onChangeMenu: handleChangeTab,
        onChangeSidebar: setOpenMenu,
      })}
      styles={{
        popover: (base: any) => ({
          ...base,
          background: theme.palette.background.default,
        }),
        maskWrapper: (base: any) => ({
          ...base,
          zIndex: 20000,
        }),
        badge: (base: any) => ({ ...base, color: 'blue' }),
      }}
    >
      <Drawer open={isMenuOpen} onClose={handleCloseMenu}>
        <Box
          sx={(theme) => ({
            minWidth: theme.spacing(theme.breakpoints.values.sm / 16),
          })}
        >
          <Box sx={{ p: theme.spacing(2) }}>
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
          <Box sx={{ p: theme.spacing(2) }}>{renderMenu()}</Box>
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
        <Stack spacing={theme.spacing(1)}>
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
        <Grid
          container
          spacing={isMobile ? theme.spacing(0.5) : theme.spacing(2)}
        >
          <Grid size={12}>
            {!isMobile && (
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
            )}
          </Grid>
          {/* <Grid item xs={12} sm={12}>
            <div className={'welcome-dex-app-builder'}>
              <WelcomeMessage />
            </div>
          </Grid> */}
          <Grid
            size={{
              xs: 12,
              sm: 12
            }}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              {!isMobile ? (
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  spacing={theme.spacing(2)}
                >
                  <Typography variant="h5">
                    <FormattedMessage id="edit.app" defaultMessage="Edit App" />
                  </Typography>

                  {/* <TourButton />*/}
                </Stack>
              ) : (
                <>
                  <Typography variant="h5">
                    <FormattedMessage id="edit.app" defaultMessage="Edit App" />
                  </Typography>
                  <Button
                    onClick={handleShowMenu}
                    size="small"
                    variant="outlined"
                    startIcon={<MenuIcon />}
                  >
                    <FormattedMessage id="menu" defaultMessage="Menu" />
                  </Button>
                </>
              )}
              {/* Verification email no longer required
              {!site?.emailVerified && isLoggedIn && (
                <ConfirmationEmailMessage site={site} />
              )} */}
            </Stack>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 12
            }}>
            <Stack
              direction={'row'}
              spacing={isMobile ? theme.spacing(0.5) : theme.spacing(1)}
              justifyContent={'space-between'}
            >
              {!isMobile && (
                <BuilderKitMenu
                  menu={activeBuilderKit}
                  onChangeMenu={(menu) => setActiveBuilderKit(menu)}
                />
              )}
              <Stack
                direction={'row'}
                alignItems={'center'}
                spacing={theme.spacing(2)}
              >
                <PreviewAppButton
                  appConfig={wizardConfig}
                  site={site?.slug}
                  siteId={site?.id}
                />
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
            <Stack spacing={theme.spacing(2)} direction={'row'} alignItems={'center'}>
              <Typography variant="body2" sx={{ maxWidth: theme.spacing(37.5) }}>
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

          <Grid
            sx={{}}
            size={{
              xs: 12,
              sm: 2
            }}>
            {!isMobile && renderMenu()}
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 0.1
            }}></Grid>
          <Grid
            size={{
              xs: 12,
              sm: 9.8
            }}>
            <Box>
              <div>
                <SiteWizardProvider siteId={site?.id}>
                  <Stack spacing={theme.spacing(2)} className={'builder-forms'}>
                    <CommerceContainerRenderer
                      containerId={activeMenu}
                      onActiveMenu={(activeMenu) => {
                        setActiveMenu(activeMenu as ActiveMenu);
                      }}
                      key={activeMenu}
                    />
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

                    {activeMenu === ActiveMenu.PoweredBy && config && (
                      <PoweredByWizardContainer
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

                    {/*DexContract*/}
                    {activeMenu === ActiveMenu.CreateContract && (
                      <CreateContractContainer
                        onGoToContract={({ address, network }: any) => {
                          setContractAddress(address);
                          setContractNetwork(network);
                          setActiveMenu(ActiveMenu.ManageContract);
                        }}
                        onGoToListContracts={() =>
                          setActiveMenu(ActiveMenu.ManageContract)
                        }
                      />
                    )}
                    {activeMenu === ActiveMenu.ManageContract && (
                      <ListContractContainer
                        addr={contractAddress}
                        net={contractNetwork}
                        onGoBack={() => {
                          setContractAddress('');
                          setContractNetwork('');
                        }}
                      />
                    )}
                    {activeMenu === ActiveMenu.ManageWidgets && (
                      <AdminWidgetsContainer isOnAdminDashboard={true} />
                    )}
                  </Stack>
                </SiteWizardProvider>
              </div>
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
