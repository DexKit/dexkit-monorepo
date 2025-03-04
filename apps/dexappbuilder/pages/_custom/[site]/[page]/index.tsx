import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import MainLayout from '../../../../src/components/layouts/main';

import { dehydrate, QueryClient } from '@tanstack/react-query';

import { getAppConfig } from '../../../../src/services/app';

import ProtectedContent from '@/modules/home/components/ProtectedContent';
import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';

import { GET_ASSETS_ORDERBOOK } from '@dexkit/ui/modules/nft/hooks';
import { getDKAssetOrderbook } from '@dexkit/ui/modules/nft/services';
import { fetchMultipleAssetForQueryClient } from '@dexkit/ui/modules/nft/services/query';
import { GatedPageLayout } from '@dexkit/ui/modules/wizard/types';
import {
  GatedCondition,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { SessionProvider } from 'next-auth/react';
import AuthMainLayout from 'src/components/layouts/authMain';

const CustomPage: NextPage<{
  sections: AppPageSection[];
  account?: string;
  isProtected: boolean;
  conditions?: GatedCondition[];
  gatedLayout?: GatedPageLayout;
  layout?: PageSectionsLayout;
  result: boolean;
  site: string;
  page: string;
  partialResults: { [key: number]: boolean };
  balances: { [key: number]: string };
  slug?: string;
}> = ({
  sections,
  isProtected,
  conditions,
  site,
  page,
  gatedLayout,
  slug,
  layout,
}) => {
  if (isProtected) {
    return (
      <SessionProvider>
        <AuthMainLayout>
          <ProtectedContent
            site={site}
            page={page}
            isProtected={isProtected}
            conditions={conditions}
            layout={gatedLayout}
            slug={slug}
            pageLayout={layout}
          />
        </AuthMainLayout>
      </SessionProvider>
    );
  }

  return (
    <MainLayout disablePadding>
      <SectionsRenderer sections={sections} layout={layout} />
    </MainLayout>
  );
};

type Params = {
  site?: string;
  page?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();

  const configResponse = await getAppConfig(params?.site, params?.page);
  const { appConfig } = configResponse;
  const homePage = appConfig.pages[params?.page || ''];

  if (!homePage) {
    return {
      redirect: {
        destination: '/404',
        permanent: true,
      },
    };
  }

  if (
    homePage?.enableGatedConditions !== undefined
      ? homePage?.enableGatedConditions
      : homePage?.gatedConditions && homePage.gatedConditions.length > 0
  ) {
    return {
      props: {
        isProtected: true,
        sections: [],
        result: false,
        layout: homePage?.layout,
        conditions: homePage?.gatedConditions,
        gatedLayout: homePage?.gatedPageLayout,
        site: params?.site,
        page: params?.page,
        balances: {},
        partialResults: {},
        ...configResponse,
      },
    };
  }
  const sections = homePage?.sections || [];

  await fetchMultipleAssetForQueryClient({
    queryClient,
    sections: sections,
  });

  /*for (let section of homePage.sections) {
    if (
      section.type === 'featured' ||
      section.type === 'call-to-action' ||
      section.type === 'collections'
    ) {
      for (let item of section.items) {
        try {
          if (item.type === 'asset' && item.tokenId !== undefined) {
            await fetchAssetForQueryClient({ item, queryClient });
          } else if (item.type === 'collection') {
            const slug = getNetworkSlugFromChainId(item.chainId);

            if (slug === undefined) {
              continue;
            }

            const provider = getProviderBySlug(slug);

            await provider?.ready;

            const collection = await getCollectionData(
              provider,
              item.contractAddress,
            );

            await queryClient.prefetchQuery(
              [GET_COLLECTION_DATA, item.contractAddress, item.chainId],
              async () => collection,
            );
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }*/

  for (let section of sections) {
    if (section.type === 'asset-store') {
      const maker = section.config?.storeAccount?.toLowerCase();
      const assetResponse = await getDKAssetOrderbook({ maker });
      await queryClient.prefetchQuery(
        [GET_ASSETS_ORDERBOOK, { maker }],
        async () => assetResponse.data,
      );
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      page: params?.page,
      layout: homePage?.layout || null,
      sections: sections,
      site: params?.site,
      ...configResponse,
    },
    revalidate: 60,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

export default CustomPage;
