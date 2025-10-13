import type { AssetAPI } from "@dexkit/ui/modules/nft/types";
import type { AppConfig } from "@dexkit/ui/modules/wizard/types/config";
import getLocaleMessages from "../i18n";
import { getConfig, getSitemapConfig } from "../whitelabel";

/**
 * Configuration service for DexAppBuilder applications
 */

export async function getAppConfig(
  site?: string,
  appPage?: string
): Promise<{
  appConfig: AppConfig;
  appPage?: string;
  appNFT?: AssetAPI | null;
  siteId?: number | null;
  slug?: string | null;
  appLocaleMessages?: Record<string, string> | null | string;
}> {
  /**/
  if (site === "boredapes.dexkit.com") {
    const appBoredApeJson = (await import("../../config/app.boredape.json"))
      .default;

    return Promise.resolve({
      appConfig: appBoredApeJson as AppConfig,
      appNFT: null,
    });
  }

  if (site === "mutantboredapes.dexkit.com") {
    const appMutantBoredApeJson = (
      await import("../../config/app.mutantboredape.json")
    ).default;

    return Promise.resolve({
      appConfig: appMutantBoredApeJson as AppConfig,
      appNFT: null,
    });
  }

  if (site === "cryptopunks.dexkit.com") {
    const appCryptoPunksJson = (
      await import("../../config/app.cryptopunks.json")
    ).default;

    return Promise.resolve({
      appConfig: appCryptoPunksJson as AppConfig,
      appNFT: null,
    });
  }
  if (
    site?.startsWith("whitelabel-nft.dexkit.com") ||
    site?.startsWith("dexappbuilder.dexkit.com") ||
    site?.startsWith("dexappbuilder-dev.dexkit.com") ||
    site?.startsWith("dexappbuilder.com")
  ) {
    const slug = site.split(":");
    if (slug.length > 1) {
      const configResponse = (await getConfig({ slug: slug[1], appPage })).data;
      if (configResponse) {
        const rawAppConfig = JSON.parse(configResponse.config) as AppConfig;
        const appConfig = rawAppConfig as AppConfig;
        const appLocaleMessages = JSON.stringify(
          await getLocaleMessages(appConfig.locale)
        );

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
    const appConfigJson = (await import("../../config/app.json")).default;
    const appConfig = appConfigJson as AppConfig;
    return Promise.resolve({ appConfig });
  }

  if (site?.startsWith("dexkit.app")) {
    const slug = site.split(":");

    if (slug.length > 1) {
      const configResponse = await (
        await getConfig({ slug: slug[1], appPage })
      ).data;
      if (configResponse) {
        const rawAppConfig = JSON.parse(configResponse.config) as AppConfig;
        const appConfig = rawAppConfig as AppConfig;
        const appLocaleMessages = JSON.stringify(
          await getLocaleMessages(appConfig.locale)
        );

        return {
          appConfig,
          appLocaleMessages,
          appNFT: configResponse.nft === undefined ? null : configResponse.nft,
          siteId: configResponse?.id,
          slug: configResponse?.slug,
          appPage,
        };
      }
    }
    const appConfigJson = (await import("../../config/app.json")).default;

    return Promise.resolve({
      appConfig: appConfigJson as AppConfig,
      appNFT: null,
    });
  }

  if (site?.includes("localhost:")) {
    const [slug] = site?.split(".") || [];
    //const slug = 'test';

    if (slug) {
      const configResponse = (await getConfig({ slug, appPage })).data;

      if (configResponse) {
        const rawAppConfig = JSON.parse(configResponse.config) as AppConfig;
        const appConfig = rawAppConfig as AppConfig;

        const appLocaleMessages = JSON.stringify(
          await getLocaleMessages(appConfig.locale)
        );

        return {
          appConfig,
          appLocaleMessages,
          appNFT: configResponse.nft === undefined ? null : configResponse.nft,
          siteId: configResponse?.id,
          slug: configResponse?.slug,
        };
      }
    }
    const appConfigJson = (await import("../../config/app.json")).default;
    const appConfig = appConfigJson as AppConfig;
    const appLocaleMessages = JSON.stringify(
      await getLocaleMessages(appConfig.locale)
    );

    return Promise.resolve({
      appConfig: appConfigJson as AppConfig,
      appLocaleMessages,
      appNFT: null,
    });
  }

  if (site?.endsWith("dex-kit.vercel.app")) {
    const appConfigJson = (await import("../../config/app.json")).default;
    return Promise.resolve({
      appConfig: appConfigJson as AppConfig,
      appNFT: null,
    });
  }

  if (site?.endsWith(".vercel.app")) {
    const appConfigJson = (await import("../../config/app.json")).default;
    return Promise.resolve({
      appConfig: appConfigJson as AppConfig,
      appNFT: null,
    });
  }

  const configResponse = (await getConfig({ domain: site, appPage })).data;
  if (configResponse) {
    const rawAppConfig = JSON.parse(configResponse.config) as AppConfig;
    const appConfig = rawAppConfig as AppConfig;
    const appLocaleMessages = JSON.stringify(
      await getLocaleMessages(appConfig.locale)
    );

    return {
      appConfig,
      appLocaleMessages,
      appNFT: configResponse.nft === undefined ? configResponse.nft : null,
      siteId: configResponse?.id,
      slug: configResponse?.slug,
      appPage,
    };
  }

  console.error(`Could not find configuration for site: ${site}`);
  const defaultAppConfig = (await import("../../config/app.json")).default;
  const defaultAppLocaleMessages = JSON.stringify(
    await getLocaleMessages(defaultAppConfig.locale)
  );

  return {
    appConfig: defaultAppConfig as AppConfig,
    appLocaleMessages: defaultAppLocaleMessages,
    appNFT: null,
    siteId: null,
    slug: null,
    appPage,
  };
}

export async function getAppSitemapConfig(site?: string): Promise<{
  appConfig: AppConfig;
  appNFT?: AssetAPI | null;
  siteId?: number | null;
  slug?: string | null;
}> {
  /**/
  if (site === "boredapes.dexkit.com") {
    const appBoredApeJson = (await import("../../config/app.boredape.json"))
      .default;
    return Promise.resolve({
      appConfig: appBoredApeJson as AppConfig,
      appNFT: null,
    });
  }

  if (site === "mutantboredapes.dexkit.com") {
    const appMutantBoredApeJson = (
      await import("../../config/app.mutantboredape.json")
    ).default;
    return Promise.resolve({
      appConfig: appMutantBoredApeJson as AppConfig,
      appNFT: null,
    });
  }

  if (site === "cryptopunks.dexkit.com") {
    const appCryptoPunksJson = (
      await import("../../config/app.cryptopunks.json")
    ).default;
    return Promise.resolve({
      appConfig: appCryptoPunksJson as AppConfig,
      appNFT: null,
    });
  }
  if (
    site?.startsWith("whitelabel-nft.dexkit.com") ||
    site?.startsWith("dexappbuilder.dexkit.com") ||
    site?.startsWith("dexappbuilder-dev.dexkit.com") ||
    site?.startsWith("dexappbuilder.com")
  ) {
    const slug = site.split(":");
    if (slug.length > 1) {
      const configResponse = (await getSitemapConfig({ slug: slug[1] })).data;
      if (configResponse) {
        return {
          appConfig: JSON.parse(configResponse.config) as AppConfig,
          appNFT: configResponse.nft === undefined ? null : configResponse.nft,
          siteId: configResponse?.id,
          slug: configResponse?.slug,
        };
      }
    }
    const appConfigJson = (await import("../../config/app.json")).default;
    const appConfig = appConfigJson as AppConfig;
    return Promise.resolve({ appConfig });
  }

  if (site?.endsWith(".dexkit.app")) {
    const slug = site.split(".dexkit.app")[0];

    if (slug) {
      const configResponse = await (
        await getSitemapConfig({ slug: slug })
      ).data;
      if (configResponse) {
        return {
          appConfig: JSON.parse(configResponse.config) as AppConfig,
          appNFT: configResponse.nft === undefined ? null : configResponse.nft,
          siteId: configResponse?.id,
          slug: configResponse?.slug,
        };
      }
    }
    const appConfigJson = (await import("../../config/app.json")).default;
    return Promise.resolve({
      appConfig: appConfigJson as AppConfig,
      appNFT: null,
    });
  }

  if (site?.startsWith("localhost")) {
    const [slug] = site?.split(".") || [];
    // const slug = 'tiago-exchange';
    if (slug) {
      const configResponse = (await getSitemapConfig({ slug })).data;

      if (configResponse) {
        return {
          appConfig: JSON.parse(configResponse.config) as AppConfig,
          appNFT: configResponse.nft === undefined ? null : configResponse.nft,
          siteId: configResponse?.id,
          slug: configResponse?.slug,
        };
      }
    }
    const appConfigJson = (await import("../../config/app.json")).default;
    return Promise.resolve({
      appConfig: appConfigJson as AppConfig,
      appNFT: null,
    });
  }

  if (site?.endsWith("dex-kit.vercel.app")) {
    const appConfigJson = (await import("../../config/app.json")).default;
    return Promise.resolve({
      appConfig: appConfigJson as AppConfig,
      appNFT: null,
    });
  }

  if (site?.endsWith(".vercel.app")) {
    const appConfigJson = (await import("../../config/app.json")).default;
    return Promise.resolve({
      appConfig: appConfigJson as AppConfig,
      appNFT: null,
    });
  }

  const configResponse = (await getSitemapConfig({ domain: site })).data;
  if (configResponse) {
    return {
      appConfig: JSON.parse(configResponse.config) as AppConfig,
      appNFT: configResponse.nft === undefined ? null : configResponse.nft,
      siteId: configResponse?.id,
      slug: configResponse?.slug,
    };
  }

  console.error(`Could not find sitemap configuration for site: ${site}`);
  const defaultAppConfig = (await import("../../config/app.json")).default;

  return {
    appConfig: defaultAppConfig as AppConfig,
    appNFT: null,
    siteId: null,
    slug: null,
  };
}
