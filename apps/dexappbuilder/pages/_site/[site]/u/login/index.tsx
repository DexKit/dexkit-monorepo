import { UserLoginContainer } from '@/modules/user/componentes/containers/UserLoginContainer';
import Box from '@mui/material/Box';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';

export const UserLoginPage: NextPage = () => {
  return (
    <AuthMainLayout disablePadding>
      <Box py={4}>
        <UserLoginContainer />
      </Box>
    </AuthMainLayout>
  );
};

type Params = {
  site?: string;
};

// TODO: pass all
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

export default UserLoginPage;
