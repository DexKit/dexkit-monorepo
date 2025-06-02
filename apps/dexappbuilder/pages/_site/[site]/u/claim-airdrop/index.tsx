import { UserAirdropContainer } from '@/modules/user/componentes/containers/UserAirdropContainer';
import Box from '@mui/material/Box';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';

const User: NextPage = () => {
  return (
    <SessionProvider>
      <AuthMainLayout disablePadding>
        <Box py={4}>
          <UserAirdropContainer />
        </Box>
      </AuthMainLayout>
    </SessionProvider>
  );
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
    revalidate: 3000,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default User;
