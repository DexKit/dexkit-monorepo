import CreateWidgetDialog from '@/modules/wizard/components/dialogs/CreateWidgetDialog';
import { MismatchAccount } from '@/modules/wizard/components/MismatchAccount';

import { useDebounce } from '@dexkit/core/hooks';
import AppLink from '@dexkit/ui/components/AppLink';
import LoginAppButton from '@dexkit/ui/components/LoginAppButton';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useAuth } from '@dexkit/ui/hooks/auth';
import MarketplacesTableSkeleton from '@dexkit/ui/modules/admin/components/tables/MaketplacesTableSkeleton';
import WidgetsTable from '@dexkit/ui/modules/admin/components/tables/Widgets';
import { ConfigResponse } from '@dexkit/ui/modules/wizard/types/config';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { default as Add, default as AddIcon } from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Search from '@mui/icons-material/Search';
import Wallet from '@mui/icons-material/Wallet';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TableContainer,
  TextField,
  Typography
} from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AuthMainLayout from 'src/components/layouts/authMain';

import { useConnectWalletDialog } from 'src/hooks/app';

import { getAppConfig } from 'src/services/app';

import widgetConfig from '@dexkit/ui/config/widget.json';
import { useSendWidgetConfigMutation } from '@dexkit/ui/modules/whitelabel/hooks/useSendWidgetConfigMutation';
import { useWidgetsByOwnerQuery } from '@dexkit/ui/modules/wizard/hooks/widget';
import { WidgetConfig } from '@dexkit/ui/modules/wizard/types/widget';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

export const AdminWidgetsIndexPage: NextPage = () => {
  const { isActive } = useWeb3React();
  const { isLoggedIn, user } = useAuth();
  const snackbar = useSnackbar();
  const connectWalletDialog = useConnectWalletDialog();
  const configsQuery = useWidgetsByOwnerQuery();
  const router = useRouter();

  const sendWidgetConfig = useSendWidgetConfigMutation({});

  const [isOpen, setIsOpen] = useState(false);

  const [isOpenCreateWidget, setIsOpenCreateWidget] = useState(false);

  const [search, setSearch] = useState('');

  const [selectedConfig, setSelectedConfig] = useState<ConfigResponse>();

  const lazySearch = useDebounce<string>(search, 500);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const parsedConfigs = useMemo(() => {
    if (configsQuery.data && configsQuery.data.length > 0) {
      return configsQuery.data.map((c) => {
        const conf = JSON.parse(c.config) as WidgetConfig;
        return {
          ...c,
          name: conf.name,
        };
      });
    }
  }, [configsQuery.data]);

  const configs = useMemo(() => {
    if (parsedConfigs && parsedConfigs.length > 0) {
      if (lazySearch) {
        return parsedConfigs.filter(
          (c) => c.name.toLowerCase().search(lazySearch.toLowerCase()) > -1,
        );
      }

      return parsedConfigs;
    }

    return [];
  }, [parsedConfigs, lazySearch]);

  const renderTable = () => {
    if (isActive && !isLoggedIn) {
      return (
        <Box justifyContent={'center'} display={'flex'}>
          <Box sx={{ maxWidth: '400px' }}>
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
        <TableContainer>
          <WidgetsTable configs={configs} />
        </TableContainer>
      );
    }

    return isActive ? (
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
              <FormattedMessage id="no.widgets" defaultMessage="No Widgets" />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <FormattedMessage
                id="create.one.to.start.selling.NFTs.or.crypto"
                defaultMessage="Create one Widget to start trade NFTs or crypto"
              />
            </Typography>
          </Stack>
          <Button
            LinkComponent={AppLink}
            onClick={() => setIsOpenCreateWidget(true)}
            startIcon={<Add />}
            variant="outlined"
          >
            <FormattedMessage id="new.widget" defaultMessage="New Widget" />
          </Button>
        </Stack>
      </Box>
    ) : (
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
                id="connect.wallet.to.see.widgets.associated.with.your.account"
                defaultMessage="Connect wallet to see widgets associated with your account"
              />
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => connectWalletDialog.setOpen(true)}
            startIcon={<Wallet />}
            endIcon={<ChevronRightIcon />}
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
  };

  const { formatMessage } = useIntl();

  return (
    <>
      <CreateWidgetDialog
        dialogProps={{
          open: isOpenCreateWidget,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        onSubmit={async (item) => {
          const config = widgetConfig as unknown as WidgetConfig;
          config.name = item.name as string;

          try {
            const response = await sendWidgetConfig.mutateAsync({
              config: JSON.stringify(config),
            });
            snackbar.enqueueSnackbar(
              formatMessage({
                id: 'widget.created',
                defaultMessage: 'Widget created',
              }),
              { variant: 'success' },
            );

            if (response?.id) {
              router.push(`/admin/widget/edit/${response.id}`);
            }
          } catch (e) {
            snackbar.enqueueSnackbar(
              formatMessage(
                {
                  id: 'error.creating.widget.error.msg',
                  defaultMessage: 'Error creating widget: {errorMsg}',
                },
                {
                  errorMsg: (e as any)?.message,
                },
              ),

              { variant: 'error' },
            );
          }
        }}
        onCancel={() => setIsOpenCreateWidget(false)}
      />

      <Container maxWidth={'xl'}>
        <Grid container spacing={2}>
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
                      id="manage.widgets"
                      defaultMessage="Manage Widgets"
                    />
                  ),
                  uri: '/admin/widget',
                  active: true,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            <MismatchAccount />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">
              <FormattedMessage
                id="my.widgets.upper"
                defaultMessage="My Widgets"
              />
            </Typography>
          </Grid>

          {/* Learn more about Web3 Widgets section */}
          <Grid item xs={12}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'background.default' }}>
              <Typography variant="h6" gutterBottom>
                <FormattedMessage
                  id="learn.more.about.web3.widgets"
                  defaultMessage="Learn more about Web3 Widgets"
                />
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  <FormattedMessage
                    id="web3.widgets.description"
                    defaultMessage="Web3 Widgets allow you to add Web3 functionality—such as swaps, decentralized exchanges, token drops, NFT mints, and more—directly into any platform or website without complex integrations."
                  />
                </Typography>
              </Box>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
              >
                <Button
                  component={Link}
                  href="https://www.youtube.com/watch?v=9qA4sYPTS28"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<YouTubeIcon />}
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    justifyContent: { xs: 'flex-start', sm: 'center' }
                  }}
                >
                  <FormattedMessage
                    id="watch.tutorial"
                    defaultMessage="Watch Tutorial"
                  />
                </Button>
                <Button
                  component={Link}
                  href="https://docs.dexkit.com/defi-products/dexappbuilder/web3-widgets"
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<MenuBookIcon />}
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    justifyContent: { xs: 'flex-start', sm: 'center' }
                  }}
                >
                  <FormattedMessage
                    id="view.documentation"
                    defaultMessage="View Documentation"
                  />
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ pt: 1 }}
            >
              <Button
                onClick={() => setIsOpenCreateWidget(true)}
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
              >
                <FormattedMessage
                  id="new.widget.upper"
                  defaultMessage="New Widget"
                />
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ py: 1 }} />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={8}>
                <Box>
                  <Stack spacing={3}>
                    <Box px={3}>
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
                    </Box>
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

(AdminWidgetsIndexPage as any).getLayout = function getLayout(page: any) {
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

export default AdminWidgetsIndexPage;
