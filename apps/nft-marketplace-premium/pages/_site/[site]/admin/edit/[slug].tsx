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
import { FormattedMessage } from 'react-intl';
import { LoginAppButton } from 'src/components/LoginAppButton';
import { LoginButton } from 'src/components/LoginButton';
import AuthMainLayout from 'src/components/layouts/authMain';
import { useAuth } from 'src/hooks/account';
import { useAdminWhitelabelConfigQuery } from 'src/hooks/whitelabel';
import { getAppConfig } from 'src/services/app';
import { myAppsApi } from 'src/services/whitelabel';

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
        <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
          <EditWizardContainer site={site} />
        </DexkitApiProvider.Provider>
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
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default WizardEditPage;
