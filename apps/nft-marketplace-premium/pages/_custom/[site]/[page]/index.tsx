import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';
import MainLayout from '../../../../src/components/layouts/main';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import {
  GET_ASSETS_ORDERBOOK,
  GET_COLLECTION_DATA,
} from '../../../../src/hooks/nft';
import { getAppConfig } from '../../../../src/services/app';
import {
  fetchAssetForQueryClient,
  getCollectionData,
  getDKAssetOrderbook,
} from '../../../../src/services/nft';

import { getNetworkSlugFromChainId } from '../../../../src/utils/blockchain';

import ProtectedContent from '@/modules/home/components/ProtectedContent';
import { SectionsRenderer } from '@/modules/wizard/components/sections/SectionsRenderer';
import { GatedCondition, GatedPageLayout } from '@/modules/wizard/types';
import { AppPageSection } from '@/modules/wizard/types/section';
import { SessionProvider } from 'next-auth/react';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getProviderBySlug } from '../../../../src/services/providers';

const CustomPage: NextPage<{
  sections: AppPageSection[];
  account?: string;
  isProtected: boolean;
  conditions?: GatedCondition[];
  gatedLayout?: GatedPageLayout;
  result: boolean;
  site: string;
  page: string;
  partialResults: { [key: number]: boolean };
  balances: { [key: number]: string };
  slug?: string;
}> = ({ sections, isProtected, conditions, site, page, gatedLayout, slug }) => {
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
          />
        </AuthMainLayout>
      </SessionProvider>
    );
  }

  return (
    <MainLayout disablePadding>
      <SectionsRenderer sections={sections} />
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

  if (homePage?.gatedConditions && homePage.gatedConditions.length > 0) {
    return {
      props: {
        isProtected: true,
        sections: [],
        result: false,
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

  for (let section of homePage.sections) {
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
  }

  for (let section of homePage.sections) {
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
      sections: homePage.sections,
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
