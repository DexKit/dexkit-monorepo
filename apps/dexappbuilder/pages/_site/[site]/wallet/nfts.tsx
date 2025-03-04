import { PageHeader } from '@dexkit/ui/components/PageHeader';
import TableSkeleton from '@dexkit/ui/modules/nft/components/tables/TableSkeleton';
import HiddenAssetsSection from '@dexkit/ui/modules/wallet/components/HiddenAssetsSection';
import WalletAssetsFilter from '@dexkit/ui/modules/wallet/components/WalletAssetsFilter';
import WalletAssetsSection from '@dexkit/ui/modules/wallet/components/WalletAssetsSection';
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
    Box,
    Button,
    Container,
    Drawer,
    Grid,
    Paper,
    Stack,
    Tabs,
    Typography,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import MainLayout from '../../../../src/components/layouts/main';
import FavoriteAssetsSection from '../../../../src/modules/favorites/components/FavoriteAssetsSection';
import { getAppConfig } from '../../../../src/services/app';
const ImportAssetDialog = dynamic(
  () =>
    import(
      '../../../../src/modules/orders/components/dialogs/ImportAssetDialog'
    ),
);

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const WalletNFTsPage: NextPage = () => {
  const { chainId: walletChainId, account } = useWeb3React();
  const [chainId, setChainId] = useState(walletChainId);

  const [activeTab, setActiveTab] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const [filters, setFilters] = useState({
    myNfts: false,
    chainId: chainId,
    networks: [] as string[],
    account: '' as string,
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleCloseDrawer = () => setIsFiltersOpen(false);
  const handleOpenDrawer = () => setIsFiltersOpen(true);

  const renderDrawer = () => {
    return (
      <Drawer open={isFiltersOpen} onClose={handleCloseDrawer}>
        <Box
          sx={(theme) => ({ minWidth: `${theme.breakpoints.values.sm / 2}px` })}
        >
          <WalletAssetsFilter
            onClose={handleCloseDrawer}
            filters={filters}
            setFilters={setFilters}
          />
        </Box>
      </Drawer>
    );
  };

  const [showImportAsset, setShowImportAsset] = useState(false);

  const handleToggleImportAsset = () => setShowImportAsset((value) => !value);

  return (
    <>
      {showImportAsset && (
        <ImportAssetDialog
          dialogProps={{
            open: showImportAsset,
            fullWidth: true,
            maxWidth: 'xs',
            onClose: handleToggleImportAsset,
          }}
        />
      )}
      {renderDrawer()}
      <MainLayout noSsr>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
                      <FormattedMessage id="wallet" defaultMessage="Wallet" />
                    ),
                    uri: '/wallet',
                  },
                  {
                    caption: (
                      <FormattedMessage id="nfts" defaultMessage="NFTs" />
                    ),
                    uri: '/wallet/nfts',
                    active: true,
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={activeTab}
                  onChange={handleChangeTab}
                  aria-label="wallet nft's tab"
                >
                  <Tab
                    label={
                      <FormattedMessage
                        id={'collected'}
                        defaultMessage={'Collected'}
                      />
                    }
                    {...a11yProps(0)}
                  />
                  <Tab
                    label={
                      <FormattedMessage
                        id={'favorites'}
                        defaultMessage={'Favorites'}
                      />
                    }
                    {...a11yProps(1)}
                  />
                  <Tab
                    label={
                      <FormattedMessage
                        id={'hidden'}
                        defaultMessage={'Hidden'}
                      />
                    }
                    {...a11yProps(1)}
                  />
                </Tabs>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {activeTab === 0 && (
                <QueryErrorResetBoundary>
                  {({ reset }) => (
                    <ErrorBoundary
                      onReset={reset}
                      fallbackRender={({ resetErrorBoundary, error }) => (
                        <Paper sx={{ p: 1 }}>
                          <Stack justifyContent="center" alignItems="center">
                            <Typography variant="h6">
                              <FormattedMessage
                                id="something.went.wrong"
                                defaultMessage="Oops, something went wrong"
                                description="Something went wrong error message"
                              />
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                              {String(error)}
                            </Typography>
                            <Button
                              color="primary"
                              onClick={resetErrorBoundary}
                            >
                              <FormattedMessage
                                id="try.again"
                                defaultMessage="Try again"
                                description="Try again"
                              />
                            </Button>
                          </Stack>
                        </Paper>
                      )}
                    >
                      <Suspense fallback={<TableSkeleton rows={4} />}>
                        <WalletAssetsSection
                          filters={{ ...filters, account: account }}
                          onOpenFilters={handleOpenDrawer}
                          onImport={handleToggleImportAsset}
                          setFilters={setFilters}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  )}
                </QueryErrorResetBoundary>
              )}
            </Grid>
            <Grid item xs={12}>
              {activeTab === 1 && (
                <FavoriteAssetsSection
                  filters={filters}
                  onOpenFilters={handleOpenDrawer}
                  onImport={handleToggleImportAsset}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {activeTab === 2 && (
                <QueryErrorResetBoundary>
                  {({ reset }) => (
                    <ErrorBoundary
                      onReset={reset}
                      fallbackRender={({ resetErrorBoundary, error }) => (
                        <Paper sx={{ p: 1 }}>
                          <Stack justifyContent="center" alignItems="center">
                            <Typography variant="h6">
                              <FormattedMessage
                                id="something.went.wrong"
                                defaultMessage="Oops, something went wrong"
                                description="Something went wrong error message"
                              />
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                              {String(error)}
                            </Typography>
                            <Button
                              color="primary"
                              onClick={resetErrorBoundary}
                            >
                              <FormattedMessage
                                id="try.again"
                                defaultMessage="Try again"
                                description="Try again"
                              />
                            </Button>
                          </Stack>
                        </Paper>
                      )}
                    >
                      <Suspense fallback={<TableSkeleton rows={4} />}>
                        <HiddenAssetsSection
                          filters={filters}
                          onOpenFilters={handleOpenDrawer}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  )}
                </QueryErrorResetBoundary>
              )}
            </Grid>
          </Grid>
        </Container>
      </MainLayout>
    </>
  );
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  if (params !== undefined) {
    const { site } = params;

    const configResponse = await getAppConfig(site, 'home');

    return {
      props: { ...configResponse },
      revalidate: REVALIDATE_PAGE_TIME,
    };
  }

  return {
    props: {},
    revalidate: REVALIDATE_PAGE_TIME,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default WalletNFTsPage;
