import { MismatchAccount } from '@/modules/wizard/components/MismatchAccount';
/* import { WelcomeMessage } from '@/modules/wizard/components/WelcomeMessage';*/
import ConfigureDomainDialog from '@/modules/wizard/components/dialogs/ConfigureDomainDialog';
import { useDebounce, useIsMobile } from '@dexkit/core/hooks';
import Link from '@dexkit/ui/components/AppLink';
import { ConnectButton } from '@dexkit/ui/components/ConnectButton';
import LoginAppButton from '@dexkit/ui/components/LoginAppButton';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useAuth } from '@dexkit/ui/hooks/auth';
import MarketplacesTableSkeleton from '@dexkit/ui/modules/admin/components/tables/MaketplacesTableSkeleton';
import MarketplacesTableV2 from '@dexkit/ui/modules/admin/components/tables/MarketplacesTableV2';
import { ConfigResponse } from '@dexkit/ui/modules/wizard/types/config';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { default as Add, default as AddIcon } from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Search from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TableContainer,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { ChangeEvent, ReactNode, useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AuthMainLayout from 'src/components/layouts/authMain';
import { DEXKIT_DISCORD_SUPPORT_CHANNEL, WIZARD_DOCS_URL } from 'src/constants';

import { useConnectWalletDialog } from 'src/hooks/app';
import { useWhitelabelConfigsByOwnerQuery } from 'src/hooks/whitelabel';
import { getAppConfig } from 'src/services/app';

export const AdminIndexPage: NextPage = () => {
  const { isActive } = useWeb3React();
  const { isLoggedIn, user } = useAuth();
  const connectWalletDialog = useConnectWalletDialog();
  const configsQuery = useWhitelabelConfigsByOwnerQuery({
    owner: user?.address,
  });
  const isMobile = useIsMobile();
  const theme = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState('');

  const [selectedConfig, setSelectedConfig] = useState<ConfigResponse>();

  const lazySearch = useDebounce<string>(search, 500);

  const handleShowConfigureDomain = (config: ConfigResponse) => {
    setSelectedConfig(config);
    setIsOpen(true);
  };

  const handleCloseConfigDomain = () => {
    setIsOpen(false);
  };

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleHrefDiscord = (chunks: any): ReactNode => (
    <a
      className="external_link"
      target="_blank"
      href={DEXKIT_DISCORD_SUPPORT_CHANNEL}
      rel="noreferrer"
    >
      {chunks}
    </a>
  );

  const handleHrefDocs = (chunks: any): ReactNode => (
    <a
      className="external_link"
      target="_blank"
      href={WIZARD_DOCS_URL}
      rel="noreferrer"
    >
      {chunks}
    </a>
  );

  const configs = useMemo(() => {
    if (configsQuery.data && configsQuery.data.length > 0) {
      if (lazySearch) {
        return configsQuery.data.filter(
          (c) =>
            c.appConfig.name.toLowerCase().search(lazySearch.toLowerCase()) >
            -1,
        );
      }

      return configsQuery.data;
    }

    return [];
  }, [configsQuery.data, lazySearch]);

  const renderTable = () => {
    if (isActive && !isLoggedIn) {
      return (
        <Box justifyContent={'center'} display={'flex'}>
          <Box sx={{ maxWidth: theme => theme.spacing(50), width: 1 }}>
            <LoginAppButton />
          </Box>
        </Box>
      );
    }

    if (configsQuery.isLoading) {
      return <MarketplacesTableSkeleton />;
    }

    if (configs && configs.length > 0) {
      return (
        <TableContainer sx={{
          overflowX: 'auto',
          ...(isMobile && {
            mx: -0.5,
            width: 'calc(100% + 8px)'
          })
        }}>
          <MarketplacesTableV2
            configs={configs}
            onConfigureDomain={handleShowConfigureDomain}
          />
        </TableContainer>
      );
    }

    return isActive ? (
      <Box py={isMobile ? 2 : 4}>
        <Stack
          alignItems="center"
          justifyContent="center"
          alignContent="center"
          spacing={isMobile ? 1 : 2}
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            alignContent="center"
          >
            <Typography variant={isMobile ? "h6" : "h5"}>
              <FormattedMessage id="no.apps" defaultMessage="No Apps" />
            </Typography>
            <Typography variant="body1" color="textSecondary" align="center" px={isMobile ? 2 : 0}>
              <FormattedMessage
                id="create.one.to.start.selling.NFTs.or.crypto"
                defaultMessage="Create one App to start trade NFTs or crypto"
              />
            </Typography>
          </Stack>
          <Button
            LinkComponent={Link}
            href="/admin/setup"
            startIcon={<Add />}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{
              py: isMobile ? 0.5 : 1
            }}
          >
            <FormattedMessage id="new.app" defaultMessage="New App" />
          </Button>
        </Stack>
      </Box>
    ) : (
      <Box py={isMobile ? 2 : 4}>
        <Stack
          alignItems="center"
          justifyContent="center"
          alignContent="center"
          spacing={isMobile ? 1 : 2}
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            alignContent="center"
          >
            <Typography variant={isMobile ? "h6" : "h5"}>
              <FormattedMessage
                id="no.wallet.connected"
                defaultMessage="No Wallet connected"
              />
            </Typography>
            <Typography variant="body1" color="textSecondary" align="center" px={isMobile ? 2 : 0}>
              <FormattedMessage
                id="connect.wallet.to.see.apps.associated.with.your.account"
                defaultMessage="Connect wallet to see apps associated with your account"
              />
            </Typography>
          </Stack>
          <ConnectButton
            variant="outlined"
            color="inherit"
            endIcon={<ChevronRightIcon />}
            size={isMobile ? "small" : "medium"}
            sx={{
              py: isMobile ? 0.5 : 1
            }}
          />
        </Stack>
      </Box>
    );
  };

  const { formatMessage } = useIntl();

  return (
    <>
      <ConfigureDomainDialog
        dialogProps={{
          open: isOpen,
          onClose: handleCloseConfigDomain,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        config={selectedConfig}
      />
      <Container maxWidth={'xl'} sx={{ px: isMobile ? 0.5 : 3 }}>
        <Grid container spacing={isMobile ? 1 : 2}>
          <Grid item xs={12}>
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
                  active: true,
                },
              ]}
            />
          </Grid>
          {/* <Grid item xs={12} sm={12}>
            <WelcomeMessage />
          </Grid> */}
          <Grid item xs={12}>
            <MismatchAccount />
          </Grid>
          <Grid item xs={12}>
            <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontSize: isMobile ? '1.1rem' : undefined, px: isMobile ? 1 : 0 }}>
              <FormattedMessage id="my.apps.upper" defaultMessage="My Apps" />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction={isMobile ? "column" : "row"}
              alignItems={isMobile ? "stretch" : "center"}
              justifyContent="space-between"
              sx={{ pt: isMobile ? 0 : 1 }}
              spacing={isMobile ? 1 : 0}
            >
              <Button
                href="/admin/setup"
                LinkComponent={Link}
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
                sx={{
                  mb: isMobile ? 1 : 0,
                  py: isMobile ? 1 : undefined,
                  fontSize: isMobile ? '0.875rem' : undefined,
                  maxHeight: isMobile ? '40px' : undefined
                }}
              >
                <FormattedMessage id="new.app" defaultMessage="New App" />
              </Button>

              {isMobile && <TextField
                value={search}
                placeholder={formatMessage({
                  id: 'search.dots',
                  defaultMessage: 'Search...',
                })}
                onChange={handleSearchChange}
                size="small"
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: theme.shape.borderRadius,
                    fontSize: '0.875rem',
                    height: '40px'
                  }
                }}
              />}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ py: isMobile ? 0.5 : 1 }} />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={isMobile ? 0 : 3} justifyContent="center">
              <Grid item xs={12} sm={10} md={9} lg={8} sx={{
                px: isMobile ? 0.5 : undefined,
                mx: isMobile ? 'auto' : undefined,
                maxWidth: isMobile ? 'calc(100% - 4px)' : undefined
              }}>
                <Box>
                  <Stack spacing={isMobile ? 0.5 : 3}>
                    {!isMobile && <Box px={3}>
                      <Stack justifyContent="flex-end" direction="row">
                        <TextField
                          value={search}
                          placeholder={formatMessage({
                            id: 'search.dots',
                            defaultMessage: 'Search...',
                          })}
                          onChange={handleSearchChange}
                          size="small"
                          variant="standard"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Stack>
                    </Box>}
                    {renderTable()}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

(AdminIndexPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout noSsr>{page}</AuthMainLayout>;
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();
  const configResponse = await getAppConfig(params?.site, 'no-page-defined');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths<
  Params
> = ({ }: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default AdminIndexPage;
