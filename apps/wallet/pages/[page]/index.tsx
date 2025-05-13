import type { GetStaticProps, GetStaticPropsContext } from "next";

import { dehydrate, QueryClient } from "@tanstack/react-query";

import {
  CustomPageProps,
  RenderCustomPage,
} from "@dexkit/dexappbuilder-render";
import { GET_ASSETS_ORDERBOOK } from "@dexkit/ui/modules/nft/hooks";
import { getDKAssetOrderbook } from "@dexkit/ui/modules/nft/services";
import { fetchMultipleAssetForQueryClient } from "@dexkit/ui/modules/nft/services/query";
//import { getAppConfigBySlug } from "@dexkit/ui/services/app/getAppConfigbySlug";
import getLocaleMessages from "@dexkit/ui/services/i18n";

import { AppPage } from "@dexkit/ui/modules/wizard/types/config";
import config from "../../public/config/app.kittygotchi.json";

function CustomPage(props: CustomPageProps) {
  return <RenderCustomPage {...props} />;
}

type Params = {
  page?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();
  // uncomment if you wanna use dexappbuilder config directly from builder, using the slug
  //const configResponse = await getAppConfigBySlug('myapp', params?.page);
  //const { appConfig } = configResponse;
  const appConfig = config;

  const appLocaleMessages = await getLocaleMessages(appConfig.locale);
  const configResponse = {
    appConfig,
    appLocaleMessages: JSON.stringify(appLocaleMessages),
    appPage: params?.page,
  };
  //@ts-ignore
  const homePage = appConfig.pages[params?.page || ""] as AppPage;

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
        site: null,
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
      site: null,
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
