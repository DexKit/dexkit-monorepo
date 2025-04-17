import { getAppConfig } from './src/services/app';

export default async function getSeoConfig(site: string) {
  const { appConfig: config } = await getAppConfig(site);

  const seoConfig: any = {
    defaultTitle: config.seo?.home?.title || config.name,
    titleTemplate: `${config.name} | %s`,
    description: config.seo?.home?.description,
    canonical: config.domain,
    openGraph: {
      type: 'website',
      description: config.seo?.home?.description || '',
      locale: config.locale || 'en_US',
      url: config.domain,
      site_name: config.name,
      images: config.seo?.home?.images,
    },
  };

  if (config.social) {
    for (let social of config.social) {
      if (social.type === 'twitter') {
        seoConfig.twitter = {
          handle: `@${social.handle}`,
          site: `@${social.handle}`,
          cardType: 'summary_large_image',
        };
      }
    }
  }
  return seoConfig;
}
