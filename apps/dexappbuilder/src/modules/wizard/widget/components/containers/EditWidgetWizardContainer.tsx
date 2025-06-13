import AdminWidgetSidebarContainer from '@dexkit/ui/modules/wizard/components/AdminWidgetSidebarContainer';
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
import Divider from '@mui/material/Divider';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import React, { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useAuth } from '@dexkit/ui/hooks/auth';
import { AppConfig, AppPage } from '@dexkit/ui/modules/wizard/types/config';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import {
  QUERY_ADMIN_WIDGET_CONFIG,
  useSendWidgetConfigMutation,
} from '@/modules/wizard/hooks/widget';
import {
  WidgetConfig,
  WidgetResponse,
} from '@dexkit/ui/modules/wizard/types/widget';

import CollectionWizardContainer from '@/modules/wizard/components/containers/CollectionWizardContainer';
import PoweredByWizardContainer from '@/modules/wizard/components/containers/PoweredByWizardContainer';
import TokenWizardContainer from '@/modules/wizard/components/containers/TokenWizardContainer';
import SignConfigDialog from '@/modules/wizard/components/dialogs/SignConfigDialog';
import { BuilderKit } from '@/modules/wizard/constants';
import GeneralWizardContainer from './GeneralWizardContainer';
import WidgetSectionWizardContainer from './WidgetSectionWizardContainer';

const NetworksWizardContainer = dynamic(
  () =>
    import('@/modules/wizard/components/containers/NetworksWizardContainer'),
);

const MarketplaceFeeWizardContainer = dynamic(
  () =>
    import(
      '@/modules/wizard/components/containers/MarketplaceFeeWizardContainer'
    ),
);

const SwapFeeWizardContainer = dynamic(
  () => import('@/modules/wizard/components/containers/SwapFeeWizardContainer'),
);
const ThemeWizardContainer = dynamic(
  () => import('@/modules/wizard/components/containers/ThemeWizardContainer'),
);

const CreateContractContainer = dynamic(
  () =>
    import(
      '@dexkit/ui/modules/contract-wizard/components/containers/CreateContractContainer'
    ),
);

const ListContractContainer = dynamic(
  () => import('@/modules/wizard/components/containers/ListContractContainer'),
);

interface Props {
  widget?: WidgetResponse | null;
  isOnSite?: boolean;
}

export enum ActiveMenu {
  General = 'general',
  Theme = 'theme',
  Components = 'components',
  PoweredBy = 'powered.by',
  UserEventAnalytics = 'user-event-analytics',
  MarketplaceFees = 'marketplace-fees',
  SwapFees = 'swap-fees',
  Collections = 'collections',
  Tokens = 'tokens',
  Integrations = 'integrations',
  Rankings = 'rankings',
  Networks = 'networks',
  CreateContract = 'create.contracts',
  ManageContract = 'manage.contracts',
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

export function EditWidgetWizardContainer({ widget, isOnSite }: Props) {
  const router = useRouter();
  const { tab } = router.query as { tab?: ActiveMenu };
  const [widgetWizard, setWidgetWizard] = useState(
    widget ? JSON.parse(widget.config) : undefined,
  );

  const [activeBuilderKit, setActiveBuilderKit] = useState<BuilderKit>(
    BuilderKit.ALL,
  );

  const [contractAddress, setContractAddress] = useState<string>('');
  const [contractNetwork, setContractNetwork] = useState<string>('');

  const [hasChanges, setHasChanges] = useState(false);
  const [openHasChangesConfirm, setOpenHasChangesConfirm] = useState(false);

  const [selectedKey, setSelectedKey] = useState<string | undefined>('widget');
  const [isEditPage, setIsEditPage] = useState(false);
  const [oldPage, setOldPage] = useState<AppPage>();

  const handleCancelEdit = (hasChanges?: boolean) => {
    if (hasChanges) {
      return setOpenHasChangesConfirm(true);
    }

    setSelectedKey(undefined);
    setIsEditPage(false);

    setHasChanges(false);
  };

  const { formatMessage } = useIntl();

  const { isLoggedIn, user } = useAuth();

  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(
    tab || ActiveMenu.General,
  );
  const [activeMenuWithChanges, setActiveMenuWithChanges] =
    useState<ActiveMenu>(tab || ActiveMenu.General);

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

  const sendConfigMutation = useSendWidgetConfigMutation({ id: widget?.id });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showPreview, setShowPreview] = useState(false);

  const [showSendingConfig, setShowSendingConfig] = useState(false);

  const [showConfirmSendConfig, setShowConfirmSendConfig] = useState(false);
  const { account } = useWeb3React();

  // Pages forms
  const handleCloseConfirmSendConfig = () => {
    setShowConfirmSendConfig(false);
  };

  const queryClient = useQueryClient();

  const handleConfirmSendConfig = async () => {
    setShowConfirmSendConfig(false);

    if (widgetWizard) {
      await sendConfigMutation.mutateAsync(
        { config: JSON.stringify(widgetWizard) },
        {
          onSuccess: () => {
            setHasChanges(false);
            queryClient.invalidateQueries([QUERY_ADMIN_WIDGET_CONFIG]);
          },
        },
      );
    }

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
    const newConfig = { ...widgetWizard, ..._config } as WidgetConfig;

    setWidgetWizard(newConfig);
  };

  const handleChange = useCallback(
    (_config: Partial<AppConfig>) => {
      const newConfig = { ...widgetWizard, ..._config } as WidgetConfig;

      setWidgetWizard(newConfig);
    },

    [widgetWizard, setWidgetWizard],
  );

  const renderMenu = () => (
    <>
      <AdminWidgetSidebarContainer
        activeBuilderKit={activeBuilderKit}
        isSiteOwner={true}
        onChangeMenu={(menuId: string) => {
          handleChangeTab(menuId as ActiveMenu);
          if (window.innerWidth < 960) {
            handleCloseMenu();
          }
        }}
        activeMenuId={activeMenu as string}
        commerceEnabled={true}
        isOnSite={isOnSite}
      />
    </>
  );

  return (
    <>
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
          id: 'widget.builder.setup',
          defaultMessage: 'Widget Builder Setup',
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
            id="you.have.unsaved.changes"
            defaultMessage="You have unsaved changes"
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
                        id="manage.widgets"
                        defaultMessage="Manage Widgets"
                      />
                    ),
                    uri: '/admin/widget',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="edit.widget"
                        defaultMessage="Edit widget"
                      />
                    ),
                    uri: `/admin/widget/edit/${widget?.id}`,
                    active: true,
                  },
                ]}
              />
            </Stack>
          </Grid>
          {/*       <Grid item xs={12} sm={12}>
            <div className={'welcome-dex-app-builder'}>
              <WelcomeMessage />
            </div>
          </Grid>*/}

          <Grid item xs={12} sm={12}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              {!isMobile && (
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                  <Typography variant="h5">
                    <FormattedMessage
                      id="edit.widget"
                      defaultMessage="Edit Widget"
                    />
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
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Stack
              direction={'row'}
              spacing={1}
              justifyContent={'space-between'}
            >
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                {/* <PreviewAppButton appConfig={widget.} site={site?.slug} />*/}
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
              <Stack spacing={2} className={'builder-forms'}>
                {activeMenu === ActiveMenu.General && widgetWizard && (
                  <GeneralWizardContainer
                    config={widgetWizard}
                    onSave={handleSave}
                    onChange={handleChange}
                    onHasChanges={setHasChanges}
                  />
                )}

                {activeMenu === ActiveMenu.Theme && widgetWizard && (
                  <ThemeWizardContainer
                    config={widgetWizard}
                    showSwap={undefined}
                    onSave={handleSave}
                    onChange={handleChange}
                    onHasChanges={setHasChanges}
                  />
                )}

                {activeMenu === ActiveMenu.PoweredBy && widgetWizard && (
                  <PoweredByWizardContainer
                    config={widgetWizard}
                    isWidget={true}
                    onSave={handleSave}
                    onHasChanges={setHasChanges}
                  />
                )}

                {activeMenu === ActiveMenu.Components && widgetWizard && (
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
                      <WidgetSectionWizardContainer
                        config={widgetWizard}
                        onSave={handleSave}
                        onChange={handleChange}
                        onHasChanges={setHasChanges}
                        hasChanges={hasChanges}
                      />
                    </PagesContext.Provider>
                  </>
                )}

                {activeMenu === ActiveMenu.MarketplaceFees && widgetWizard && (
                  <MarketplaceFeeWizardContainer
                    config={widgetWizard}
                    onHasChanges={setHasChanges}
                    onSave={handleSave}
                  />
                )}

                {activeMenu === ActiveMenu.SwapFees && widgetWizard && (
                  <SwapFeeWizardContainer
                    config={widgetWizard}
                    onSave={handleSave}
                    onHasChanges={setHasChanges}
                  />
                )}
                {activeMenu === ActiveMenu.Collections && widgetWizard && (
                  <CollectionWizardContainer
                    config={widgetWizard}
                    onHasChanges={setHasChanges}
                    onSave={handleSave}
                  />
                )}

                {activeMenu === ActiveMenu.Networks && widgetWizard && (
                  <NetworksWizardContainer
                    config={widgetWizard}
                    onSave={handleSave}
                    onChange={handleChange}
                    onHasChanges={setHasChanges}
                  />
                )}

                {activeMenu === ActiveMenu.Tokens && widgetWizard && (
                  <TokenWizardContainer
                    config={widgetWizard}
                    onSave={handleSave}
                    onHasChanges={setHasChanges}
                  />
                )}

                {/*DexContract*/}
                {activeMenu === ActiveMenu.CreateContract && (
                  <CreateContractContainer
                    onGoToContract={({ address, network }) => {
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
              </Stack>
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
    </>
  );
}
