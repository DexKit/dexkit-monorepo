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

import { DexkitApiProvider } from '@dexkit/core/providers';
import SecurityIcon from '@mui/icons-material/Security';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { FormattedMessage } from 'react-intl';

import { LoginButton } from 'src/components/LoginButton';
import AuthMainLayout from 'src/components/layouts/authMain';

import { useAdminWidgetConfigQuery } from '@/modules/wizard/hooks/widget';
import { EditWidgetWizardContainer } from '@/modules/wizard/widget/components/containers/EditWidgetWizardContainer';
import LoginAppButton from '@dexkit/ui/components/LoginAppButton';
import { myAppsApi } from '@dexkit/ui/constants/api';
import { AdminContext } from '@dexkit/ui/context/AdminContext';
import { useAuth } from '@dexkit/ui/hooks/auth';
import { useMemo } from 'react';
import { getAppConfig } from 'src/services/app';

export const WizardWidgetEditPage: NextPage = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const { id } = router.query;
  const {
    data: widget,
    error: configError,
    isLoading: isConfigLoading,
    isError: isConfigError,
    refetch,
  } = useAdminWidgetConfigQuery({
    id: Number(id),
  });

  const config = useMemo(() => {
    if ((widget as any)?.config) {
      return JSON.parse((widget as any)?.config);
    }
  }, [(widget as any)?.config]);

  const theme = useTheme();

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
                    id="start.by.connect.wallet.widget"
                    defaultMessage="Connect wallet to account that owns this widget: {name}"
                    values={{
                      name: config?.name,
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
                  id="connected.wallet.not.authorized.to.access.this.account.switch.to.account.that.owns.this.account.widget"
                  defaultMessage="Connected wallet not authorized to access this widget. Switch to account that owns this widget and login"
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
        <AdminContext.Provider value={{ editWidgetId: Number(id) }}>
          <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
            {widget ? <EditWidgetWizardContainer widget={widget as any} /> : null}
          </DexkitApiProvider.Provider>
        </AdminContext.Provider>
      )}
    </>
  );
};

(WizardWidgetEditPage as any).getLayout = function getLayout(page: any) {
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

export default WizardWidgetEditPage;
