import { UserContainer } from '@/modules/user/componentes/containers/UserContainer';
import { GET_USER_BY_USERNAME_QUERY } from '@/modules/user/hooks';
import { getUserByUsername } from '@/modules/user/services';
import Box from '@mui/material/Box';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import MainLayout from 'src/components/layouts/main';
import { getAppConfig } from 'src/services/app';

const User: NextPage<{ username: string }> = ({ username }) => {
  return (
    <MainLayout disablePadding>
      <Box py={4}>
        <UserContainer username={username} />
      </Box>
    </MainLayout>
  );
};

type Params = {
  username?: string;
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();
  const { data } = await getUserByUsername(params?.username);

  await queryClient.prefetchQuery(
    [GET_USER_BY_USERNAME_QUERY, params?.username],
    async () => data,
  );
  const configResponse = await getAppConfig(params?.site, 'no-page-defined');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      username: params?.username,
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
