import type {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import MainLayout from '../../../src/components/layouts/main';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getAppConfig } from '../../../src/services/app';

import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';
import { GET_ASSETS_ORDERBOOK } from '@dexkit/ui/modules/nft/hooks';
import { getDKAssetOrderbook } from '@dexkit/ui/modules/nft/services';
import { fetchMultipleAssetForQueryClient } from '@dexkit/ui/modules/nft/services/query';
import { PageSectionsLayout } from '@dexkit/ui/modules/wizard/types/config';
import type { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';

const Home: NextPage<{
  sections: AppPageSection[];
  layout: PageSectionsLayout;
}> = ({ sections, layout }) => {
  return (
    <MainLayout disablePadding>
      <SectionsRenderer sections={sections} layout={layout} />
      {/*<ActionButtonsSection />*/}
    </MainLayout>
  );
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
  locale,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();

  const configResponse = await getAppConfig(params?.site, 'home');
  const { appConfig } = configResponse;

  // Check underConstruction only for production domains (.dexkit.app)
  // In development/preview domains, this check is already handled by getAppConfig
  if (params?.site?.startsWith('dexkit.app') && appConfig.underConstruction) {
    return {
      redirect: {
        destination: '/under-construction',
        permanent: false,
      },
    };
  }

  const homePage = appConfig.pages.home;

  const sections = homePage?.sections || [];

  for (let section of sections) {
    if (section.type === 'asset-store') {
      const maker = section.config?.storeAccount?.toLowerCase();
      const assetResponse = await getDKAssetOrderbook({ maker });
      await queryClient.prefetchQuery(
        [GET_ASSETS_ORDERBOOK, { maker: maker || null }],
        async () => assetResponse.data,
      );
    }
  }
  await fetchMultipleAssetForQueryClient({
    queryClient,
    sections: sections,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      sections: sections,
      layout: homePage?.layout || null,
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

export default Home;
