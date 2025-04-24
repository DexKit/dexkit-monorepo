import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import Edit from '@mui/icons-material/Edit';
import {
    Button,
    Container,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';

import { StoreOrderbook } from '@dexkit/ui/modules/nft/components/StoreOrderbook';
import TableSkeleton from '@dexkit/ui/modules/nft/components/tables/TableSkeleton';
import { useAssetsOrderBook } from '@dexkit/ui/modules/nft/hooks';
import WalletAssetsSection from '@dexkit/ui/modules/wallet/components/WalletAssetsSection';
import { useUserQuery } from '../../hooks';
import { UserHeader } from '../UserHeader';
import UserNotFound from '../UserNotFound';

enum ActiveMenu {
  Offers = 'offers',
  Collected = 'collected',
}

export function UserContainer({ username }: { username?: string }) {
  const router = useRouter();
  const { tab } = router.query as { tab?: ActiveMenu };
  const activeMenu = tab || ActiveMenu.Offers;
  const changeActiveMenu = (mn: ActiveMenu) => {
    router.replace({
      pathname: `/u/${username}`,
      query: { tab: mn },
    });
  };

  const userQuery = useUserQuery(username);

  const user = userQuery?.data;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { account } = useWeb3React();
  const [search, setSearch] = useState<string>();
  const defaultAccount =
    user?.accounts && user?.accounts.length ? user?.accounts[0].address : '';

  const assetOrderbookQuery = useAssetsOrderBook({
    maker: defaultAccount,
  });

  const [filters, setFilters] = useState({
    myNfts: false,
    networks: [] as string[],
    account: '',
  });

  if (userQuery.isFetched && !userQuery.data) {
    return <UserNotFound />;
  }

  return (
    <>
      <Container>
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
                        id="user.profile"
                        defaultMessage="User profile"
                      />
                    ),
                    uri: `/u/${user?.username}`,
                    active: true,
                  },
                ]}
              />
            </Stack>
          </Grid>

          {user?.accounts
            ?.map((a) => a.address.toLowerCase())
            .includes(account?.toLowerCase() || '') && (
            <Grid item xs={12} sm={12}>
              <Stack direction={'row'} spacing={2} alignItems={'center'}>
                {!isMobile && (
                  <Typography variant="h5">
                    <FormattedMessage
                      id="user.profile.value"
                      defaultMessage="User Profile: {username}"
                      values={{
                        username: user?.username,
                      }}
                    />
                  </Typography>
                )}
                <IconButton onClick={() => router.push(`/u/edit`)}>
                  <Edit />
                </IconButton>
              </Stack>
            </Grid>
          )}

          <Grid item xs={12}>
            <UserHeader {...user} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Stack
              justifyContent="space-between"
              direction="row"
              alignItems="center"
              alignContent="center"
            ></Stack>
          </Grid>
          <Grid item xs={12}>
            <Tabs
              value={activeMenu}
              onChange={(_, newValue) => changeActiveMenu(newValue)}
              aria-label="user menu"
            >
              <Tab
                value={ActiveMenu.Offers}
                label={
                  <FormattedMessage id={'offers'} defaultMessage={'Offers'} />
                }
              />
              <Tab
                value={ActiveMenu.Collected}
                label={
                  <FormattedMessage
                    id={'collected'}
                    defaultMessage={'Collected'}
                  />
                }
              />
            </Tabs>
          </Grid>

          <Grid item xs={12}>
            {activeMenu === ActiveMenu.Offers && (
              <StoreOrderbook
                search={search}
                orderbook={assetOrderbookQuery.data}
                isLoading={assetOrderbookQuery.isLoading}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            {activeMenu === ActiveMenu.Collected && (
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
                          <Button color="primary" onClick={resetErrorBoundary}>
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
                        filters={{
                          ...filters,
                          account: filters.account || defaultAccount,
                        }}
                        accounts={user?.accounts?.map((a) =>
                          a.address.toLowerCase(),
                        )}
                        setFilters={setFilters}
                        onOpenFilters={() => {}}
                        onImport={() => {}}
                      />
                    </Suspense>
                  </ErrorBoundary>
                )}
              </QueryErrorResetBoundary>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
