import { OrderMarketType } from '@dexkit/exchange/constants';
import TokenPageContainer from '@dexkit/ui/modules/token/components/TokenPageContainer';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import MainLayout from 'src/components/layouts/main';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import { getAppConfig } from 'src/services/app';

export default function TokensPage() {
  const { query } = useRouter();

  const { address, network } = query;

  return (
    <TokenPageContainer
      address={address as string}
      network={network as string}
      orderMarketType={OrderMarketType.buy}
    ></TokenPageContainer>
  );
}

(TokensPage as any).getLayout = function getLayout(page: any) {
  return <MainLayout>{page}</MainLayout>;
};

type Params = {
  site?: string;
  address?: string;
  network?: string;
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  if (params !== undefined) {
    const { address, network, site } = params;

    const configResponse = await getAppConfig(site, 'home');

    const queryClient = new QueryClient();

    return {
      props: { dehydratedState: dehydrate(queryClient), ...configResponse },
      revalidate: REVALIDATE_PAGE_TIME,
    };
  }
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}
