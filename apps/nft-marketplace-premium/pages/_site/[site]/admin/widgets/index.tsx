import MarketplacesTableSkeleton from '@/modules/admin/components/tables/MaketplacesTableSkeleton';
import WidgetsTable from '@/modules/admin/components/tables/WidgetsTable';
import { MismatchAccount } from '@/modules/wizard/components/MismatchAccount';
import { WelcomeMessage } from '@/modules/wizard/components/WelcomeMessage';
import { useWidgetsByOwnerQuery } from '@/modules/wizard/hooks/widget';
import { useDebounce } from '@dexkit/core/hooks';
import Link from '@dexkit/ui/components/AppLink';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useAuth } from '@dexkit/ui/hooks/auth';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { default as Add, default as AddIcon } from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Search from '@mui/icons-material/Search';
import Wallet from '@mui/icons-material/Wallet';
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
import { LoginAppButton } from 'src/components/LoginAppButton';
import AuthMainLayout from 'src/components/layouts/authMain';

import { useConnectWalletDialog } from 'src/hooks/app';

import { getAppConfig } from 'src/services/app';
import { ConfigResponse } from 'src/types/whitelabel';

export const AdminWidgetsIndexPage: NextPage = () => {
  const { isActive } = useWeb3React();
  const { isLoggedIn, user } = useAuth();
  const connectWalletDialog = useConnectWalletDialog();
  const configsQuery = useWidgetsByOwnerQuery({
    owner: user?.address,
  });

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

  const configs = useMemo(() => {
    if (configsQuery.data && configsQuery.data.length > 0) {
      if (lazySearch) {
        return configsQuery.data.filter(
          (c) => c.name.toLowerCase().search(lazySearch.toLowerCase()) > -1,
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
            LinkComponent={Link}
            href="/admin/widget/create"
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
                  uri: '/admin/widgets',
                  active: true,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <WelcomeMessage />
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
          <Grid item xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ pt: 1 }}
            >
              <Button
                href="/admin/widgets/create"
                LinkComponent={Link}
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
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default AdminWidgetsIndexPage;
