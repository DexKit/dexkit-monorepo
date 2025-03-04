import { UserEditContainer } from '@/modules/user/componentes/containers/UserEditContainer';
import { GET_AUTH_USER } from '@/modules/user/hooks';
import { getUserByAccountRefresh } from '@/modules/user/services';
import Box from '@mui/material/Box';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';

import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';

const UserEdit: NextPage = () => {
  return (
    <SessionProvider>
      <AuthMainLayout disablePadding>
        <Box py={4}>
          <UserEditContainer />
        </Box>
      </AuthMainLayout>
    </SessionProvider>
  );
};

type Params = {
  username?: string;
  site?: string;
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}: GetServerSidePropsContext<Params>) => {
  const token = req.cookies.refresh_token;
  if (!token) {
    return {
      redirect: {
        destination: '/u/login',
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();
  const { data } = await getUserByAccountRefresh({ token });

  const configResponse = await getAppConfig(params?.site, 'no-page-defined');

  await queryClient.prefetchQuery([GET_AUTH_USER], async () => data);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
      // username: params?.username,
    },
  };
};

export default UserEdit;
