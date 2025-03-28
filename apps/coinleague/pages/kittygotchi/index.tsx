import type { NextPage } from 'next';

import MainLayout from '@/modules/common/components/layouts/MainLayout';

import AppConnectWalletEmtpy from '@/modules/common/components/AppConnectWalletEmpty';
import AppErrorBoundary from '@/modules/common/components/AppErrorBoundary';
import AppPageHeader from '@/modules/common/components/AppPageHeader';
import MagicNetworkSelect from '@/modules/common/components/MagicNetworkSelect';
import KittygotchiMintDialog from '@/modules/kittygotchi/components/dialogs/KittygotchiMintDialog';
import KittygotchiGrid from '@/modules/kittygotchi/components/KittygotchiGrid';
import { SearchTextField } from '@/modules/wallet/components/SearchTextField';
import { Error, Search } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useWeb3React } from '@web3-react/core';
import { Suspense, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const KittygotchiesPage: NextPage = () => {
  const { isActive } = useWeb3React();

  const { formatMessage } = useIntl();

  const [showMint, setShowMint] = useState(false);

  const handleChange = (value: string) => {};

  const handleShowDialog = () => {
    setShowMint(true);
  };

  const handleCloseMintDialog = () => {
    setShowMint(false);
  };

  return (
    <>
      <KittygotchiMintDialog
        DialogProps={{
          open: showMint,
          onClose: handleCloseMintDialog,
          maxWidth: 'xs',
          fullWidth: true,
        }}
      />
      <MainLayout>
        <Stack spacing={2}>
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <AppPageHeader
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
                        id="kittygotchi"
                        defaultMessage="Kittygotchi"
                      />
                    ),
                    active: true,
                    uri: '/kittygotchi',
                  },
                ]}
              />
              <MagicNetworkSelect SelectProps={{ size: 'small' }} />
            </Stack>
          </Box>
          <Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <SearchTextField
                  onChange={handleChange}
                  TextFieldProps={{
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="primary" />
                        </InputAdornment>
                      ),
                    },
                    fullWidth: true,
                    size: 'small',
                    placeholder: formatMessage({
                      id: 'search.for.a.kittygotchi',
                      defaultMessage: 'Search for a kittygotchi',
                    }),
                  }}
                />
              </Grid>
              <Grid item>
                <Button onClick={handleShowDialog} variant="contained">
                  <FormattedMessage id="create" defaultMessage="Create" />
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box>
            {!isActive && <AppConnectWalletEmtpy />}
            <AppErrorBoundary
              fallbackRender={() => (
                <Box>
                  <Stack justifyContent="center" alignItems="center">
                    <Error />
                    <Typography variant="h5">
                      <FormattedMessage
                        id="error.while.loading.kittygotchies"
                        defaultMessage="Error while loading kittygotchies"
                      />
                    </Typography>
                  </Stack>
                </Box>
              )}
            >
              <Suspense
                fallback={new Array(12).fill(null).map((_, index: number) => (
                  <Grid item xs={6} sm={2} key={index}>
                    <Card sx={{ height: '100%', width: '100%' }}>
                      <Skeleton
                        variant="rectangular"
                        sx={{ height: '100%', width: '100%' }}
                      />
                      <CardContent>
                        <Typography variant="caption">
                          <Skeleton />
                        </Typography>
                        <Typography variant="body1">
                          <Skeleton />
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              >
                <KittygotchiGrid />
              </Suspense>
            </AppErrorBoundary>
          </Box>
        </Stack>
      </MainLayout>
    </>
  );
};

export default KittygotchiesPage;
