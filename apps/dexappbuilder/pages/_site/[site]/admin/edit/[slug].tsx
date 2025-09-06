import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { useRouter } from 'next/router';

import { EditWizardContainer } from '@/modules/wizard/components/containers/EditWizardContainer';
import { DexkitApiProvider } from '@dexkit/core/providers';
import SecurityIcon from '@mui/icons-material/Security';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { LoginButton } from 'src/components/LoginButton';
import AuthMainLayout from 'src/components/layouts/authMain';

import { AdminContext } from '@dexkit/ui/context/AdminContext';

import LoginAppButton from '@dexkit/ui/components/LoginAppButton';
import { myAppsApi } from '@dexkit/ui/constants/api';
import { useAuth } from '@dexkit/ui/hooks/auth';
import { useAdminWhitelabelConfigQuery } from 'src/hooks/whitelabel';
import { getAppConfig } from 'src/services/app';

export const WizardEditPage: NextPage = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const { slug } = router.query;
  const {
    data: site,
    error: configError,
    isLoading: isConfigLoading,
    isError: isConfigError,
    refetch,
  } = useAdminWhitelabelConfigQuery({
    slug: slug as string,
  });

  const theme = useTheme();

  const config = useMemo(() => {
    if ((site as any)?.config) {
      return JSON.parse((site as any)?.config);
    }
  }, [(site as any)?.config]);

  return (
    <>
      <Backdrop
        sx={{
          color: theme.palette.primary.main,
          zIndex: theme.zIndex.drawer + 1,
        }}
        open={isConfigLoading}
      >
        <CircularProgress color="inherit" size={80} />
      </Backdrop>
      {isConfigError &&
        ((configError as any)?.response?.status as number) !== 403 && (
          <Grid item xs={12}>
            <Alert severity="error">{String(configError)}</Alert>
          </Grid>
        )}
      {!isLoggedIn ? (
        <Box justifyContent={'center'} display={'flex'} alignItems={'center'}>
          <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
            <SecurityIcon fontSize="large" />
            <Box sx={{ maxWidth: '400px' }}>
              <LoginAppButton
                connectWalletMsg={
                  <FormattedMessage
                    id="start.by.connect.wallet"
                    defaultMessage="Connect wallet to account that owns this app: {slug}"
                    values={{
                      slug,
                    }}
                  />
                }
              />
            </Box>
          </Stack>
        </Box>
      ) : isConfigError &&
        ((configError as any)?.response?.status as number) === 403 ? (
        <Box
          justifyContent={'center'}
          display={'flex'}
          alignItems={'center'}
          sx={{ pt: 2 }}
        >
          <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
            <SecurityIcon fontSize="large" />
            <Alert severity="warning" sx={{ maxWidth: '500px' }}>
              <Typography>
                <FormattedMessage
                  id="connected.wallet.not.authorized.to.access.this.account.switch.to.account.that.owns.this.account"
                  defaultMessage="Connected wallet not authorized to access this app. Switch to account that owns this app and login"
                  values={{
                    slug,
                  }}
                ></FormattedMessage>
              </Typography>
            </Alert>
            <Box sx={{ maxWidth: '400px' }}>
              <LoginButton
                allowAlwaysConnectLogin={true}
                onLogin={() => refetch()}
              />
            </Box>
          </Stack>
        </Box>
      ) : (
        <AdminContext.Provider
          value={{ editSiteId: (site as any)?.id, editAppConfig: config }}
        >
          <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
            <EditWizardContainer site={site as any} />
          </DexkitApiProvider.Provider>
        </AdminContext.Provider>
      )}
    </>
  );
};

(WizardEditPage as any).getLayout = function getLayout(page: any) {
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

export default WizardEditPage;
