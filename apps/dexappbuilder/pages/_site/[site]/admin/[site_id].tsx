import { EditWizardContainer } from '@/modules/wizard/components/containers/EditWizardContainer';
import {
  Alert,
  Backdrop,
  CircularProgress,
  Grid,
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

import { useRouter } from 'next/router';
import AuthMainLayout from 'src/components/layouts/authMain';
import { useWhitelabelConfigQuery } from 'src/hooks/whitelabel';

export const WizardPage: NextPage = () => {
  const router = useRouter();
  const { site_id } = router.query;
  const {
    data: config,
    error: configError,
    isLoading: isConfigLoading,
    isError: isConfigError,
  } = useWhitelabelConfigQuery({
    domain: site_id as string,
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
      {isConfigError && (
        <Grid item xs={12}>
          <Alert severity="error">{String(configError)}</Alert>
        </Grid>
      )}
      <EditWizardContainer site={config} />
    </>
  );
};

(WizardPage as any).getLayout = function getLayout(page: any) {
  return <AuthMainLayout noSsr>{page}</AuthMainLayout>;
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
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

export default WizardPage;
