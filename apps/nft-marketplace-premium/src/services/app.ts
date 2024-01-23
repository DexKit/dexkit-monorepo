import { AppConfig } from '../types/config';

import { AssetAPI } from 'src/types/nft';
import appBoredApeJson from '../../config/app.boredape.json';
import appCryptoPunksJson from '../../config/app.cryptopunks.json';
import appConfigJson from '../../config/app.json';
import appMutantBoredApeJson from '../../config/app.mutantboredape.json';
import { getConfig } from './whitelabel';

export async function getAppConfig(
  site?: string,
  appPage?: string
): Promise<{
  appConfig: AppConfig;
  appNFT?: AssetAPI | null;
  siteId?: number,
  slug?: string
}> {
  /**/
  if (site === 'boredapes.dexkit.com') {
    return Promise.resolve({
      appConfig: appBoredApeJson as AppConfig,
      appNFT: null,
    });
  }

  if (site === 'mutantboredapes.dexkit.com') {
    return Promise.resolve({
      appConfig: appMutantBoredApeJson as AppConfig,
      appNFT: null,
    });
  }

  if (site === 'cryptopunks.dexkit.com') {
    return Promise.resolve({
      appConfig: appCryptoPunksJson as AppConfig,
      appNFT: null,
    });
  }
  if (
    site?.startsWith('whitelabel-nft.dexkit.com') ||
    site?.startsWith('dexappbuilder.dexkit.com') ||
    site?.startsWith('dexappbuilder-dev.dexkit.com') ||
    site?.startsWith('dexappbuilder.com')
  ) {
    const slug = site.split(':');
    if (slug.length > 1) {
      const configResponse = (await getConfig({ slug: slug[1], appPage })).data;
      if (configResponse) {
        return {
          appConfig: JSON.parse(configResponse.config) as AppConfig,
          appNFT: configResponse.nft === undefined ? null : configResponse.nft,
          siteId: configResponse?.id,
          slug: configResponse?.slug
        };
      }
    }
    return Promise.resolve({ appConfig: appConfigJson as AppConfig });
  }

  if (site?.startsWith('dexkit.app')) {
    const slug = site.split(':');
    if (slug.length > 1) {
      const configResponse = await (
        await getConfig({ slug: slug[1], appPage })
      ).data;
      if (configResponse) {
        return {
          appConfig: JSON.parse(configResponse.config) as AppConfig,
          appNFT: configResponse.nft === undefined ? null : configResponse.nft,
          siteId: configResponse?.id,
          slug: configResponse?.slug
        };
      }
    }
    return Promise.resolve({
      appConfig: appConfigJson as AppConfig,
      appNFT: null,
    });
  }




  if (site?.startsWith('localhost')) {
    const [slug,] = site?.split('.') || [];
    // const slug = 'swapkit';
    if (slug) {
      const configResponse = (await getConfig({ slug, appPage })).data;

      if (configResponse) {
        return {
          appConfig: JSON.parse(configResponse.config) as AppConfig,
          appNFT: configResponse.nft === undefined ? null : configResponse.nft,
          siteId: configResponse?.id,
          slug: configResponse?.slug,
        };
      }
    }

    return Promise.resolve({
      appConfig: appConfigJson as AppConfig,
      appNFT: null,
    });
  }

  if (site?.endsWith('dex-kit.vercel.app')) {
    return Promise.resolve({
      appConfig: appConfigJson as AppConfig,
      appNFT: null,
    });
  }

  if (site?.endsWith('.vercel.app')) {
    return Promise.resolve({
      appConfig: appConfigJson as AppConfig,
      appNFT: null,
    });
  }

  const configResponse = (await getConfig({ domain: site, appPage })).data;
  if (configResponse) {
    return {
      appConfig: JSON.parse(configResponse.config) as AppConfig,
      appNFT: configResponse.nft === undefined ? configResponse.nft : null,
      siteId: configResponse?.id,
      slug: configResponse?.slug
    };
  }

  throw new Error('Oops, something went wrong');

  // return appConfigJson as Promise<AppConfig>;
}
