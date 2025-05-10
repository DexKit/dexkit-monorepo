import type { AssetAPI } from "@dexkit/ui/modules/nft/types";
import type { AppConfig } from "@dexkit/ui/modules/wizard/types/config";
import getLocaleMessages from "../i18n";
import { getConfig } from "../whitelabel";

export async function getAppConfigBySlug(
  slug?: string,
  appPage?: string
): Promise<
  | {
      appConfig: AppConfig;
      appPage?: string;
      appNFT?: AssetAPI | null;
      siteId?: number | null;
      slug?: string | null;
      appLocaleMessages?: Record<string, string> | null;
    }
  | undefined
> {
  /**/

  const configResponse = (await getConfig({ slug: slug, appPage })).data;
  if (configResponse) {
    const appConfig = JSON.parse(configResponse.config) as AppConfig;
    const appLocaleMessages = await getLocaleMessages(appConfig.locale);

    return {
      appConfig,
      appNFT: configResponse.nft === undefined ? null : configResponse.nft,
      siteId: configResponse?.id,
      slug: configResponse?.slug,
      appPage,
      appLocaleMessages,
    };
  }
}
