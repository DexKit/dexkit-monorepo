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

import config from "../public/config/app.kittygotchi.json";

function Home(props: CustomPageProps) {
  return <RenderCustomPage {...props} />;
}

Home.getInitialProps = async () => {
  //const configResponse = await getAppConfigBySlug('myapp', params?.page);
  //const { appConfig } = configResponse;
  const queryClient = new QueryClient();
  const appConfig = config;
  const homePage = appConfig.pages["home"];

  const appLocaleMessages = await getLocaleMessages(appConfig.locale);
  const configResponse = {
    appConfig,
    appLocaleMessages: JSON.stringify(appLocaleMessages),
    appPage: homePage,
  };

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
      isProtected: true,
      sections: [],
      result: false,
      layout: homePage?.layout || {},
      conditions: homePage?.gatedConditions,
      gatedLayout: homePage?.gatedPageLayout || {},
      site: null,
      page: homePage,
      balances: {},
      partialResults: {},
      ...configResponse,
    };
  }
  console.log(homePage);

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
    dehydratedState: dehydrate(queryClient),
    page: homePage,
    layout: homePage?.layout || null,
    sections: sections,
    site: null,
    ...configResponse,
  };
};

export default Home;
