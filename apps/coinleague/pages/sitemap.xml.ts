import { NETWORK_SLUG } from "@dexkit/core/constants/networks";
import { GetServerSideProps } from "next";
import { getAppSitemapConfig } from "src/services/app";

function generateSiteMap({ urls, baseUrl }: { urls: string[], baseUrl: string }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
  <loc>${baseUrl}</loc>
  </url>
  ${urls
      .map((url) => {
        return `
  <url>
  <loc>${`${url}`}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.7</priority>
  </url>
  `;
      })
      .join("")}
  </urlset>
  `;
}

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const host = req.headers.host as string
  const configResponse = await getAppSitemapConfig(host as string);
  const siteId = configResponse.siteId;
  const urls = [];
  const baseUrl = `https://${host as string}`;
  const pageKeys = Object.keys(configResponse.appConfig.pages);

  for (let index = 0; index < pageKeys.length; index++) {
    const element = configResponse.appConfig.pages[pageKeys[index]];
    urls.push(`${baseUrl}${element?.uri}`)
  }
  const collections = configResponse.appConfig.collections || [];
  for (let index = 0; index < collections.length; index++) {
    const element = collections[index];
    urls.push(`${baseUrl}/collection/${NETWORK_SLUG(element.chainId)}/${element.contractAddress.toLowerCase()}`)
  }
  // push wallet url
  urls.push(`${baseUrl}/wallet`)
  // push swap
  urls.push(`${baseUrl}/swap`)

  // push collections
  urls.push(`${baseUrl}/collections`)
  // dexappbuilder case
  if (!siteId) {
    urls.push(`${baseUrl}/site`)
  }

  const sitemap = generateSiteMap({ urls, baseUrl: baseUrl as string });
  res.setHeader("Content-Type", "text/xml");
  // Send the XML to the browser
  res.write(sitemap);
  res.end();
  return {
    props: {},
  };
}
export default function SiteMap() { }