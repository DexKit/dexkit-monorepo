import type { GetStaticProps, GetStaticPropsContext, NextPage } from "next";

import { dehydrate, QueryClient } from "@tanstack/react-query";

import MainLayout from "@dexkit/ui/components/layouts/main";
import { GET_ASSETS_ORDERBOOK } from "@dexkit/ui/modules/nft/hooks";
import { getDKAssetOrderbook } from "@dexkit/ui/modules/nft/services";
import { fetchMultipleAssetForQueryClient } from "@dexkit/ui/modules/nft/services/query";
import { GatedPageLayout } from "@dexkit/ui/modules/wizard/types";
import {
  GatedCondition,
  PageSectionsLayout,
} from "@dexkit/ui/modules/wizard/types/config";
import { AppPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { SessionProvider } from "next-auth/react";
import {
  CustomPageProps,
  RenderCustomPage,
} from "@dexkit/dexappbuilder-render";

function CustomPage(props: CustomPageProps){
  return <RenderCustomPage {...props} />;
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
  const homePage = appConfig.pages[params?.page || ""];

  if (!homePage) {
    return {
      redirect: {
        destination: "/404",
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
        layout: homePage?.layout || {},
        conditions: homePage?.gatedConditions,
        gatedLayout: homePage?.gatedPageLayout || {},
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

  for (let section of sections) {
    if (section.type === "asset-store") {
      const maker = section.config?.storeAccount?.toLowerCase();
      const assetResponse = await getDKAssetOrderbook({ maker });
      await queryClient.prefetchQuery(
        [GET_ASSETS_ORDERBOOK, { maker }],
        async () => assetResponse.data
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
    fallback: "blocking", // false or 'blocking'
  };
}

export default CustomPage;
