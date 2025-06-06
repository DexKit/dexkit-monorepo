/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    productionBrowserSourceMaps: false,
    serverSourceMaps: false,
    turbo: {
      resolveAlias: {
        'react/jsx-runtime.js': 'react/jsx-runtime',
        'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
      },
    },
  },
  transpilePackages: [
    '@dexkit/core',
    '@dexkit/ui',
  ],
  webpack(config) {
    /*config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })*/


    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime.js': 'react/jsx-runtime',
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
    };
    return config;
  },
  images: {
    domains: [
      'i.seadn.io',
      'dweb.link',
      'ipfs.io',
      'ipfs.moralis.io',
      'dashboard.mypinata.cloud',
      'raw.githubusercontent.com',
      'arpeggi.io',
      'arweave.net',
      'i.ibb.co',
      'assets.otherside.xyz',
      'dexkit-storage.nyc3.cdn.digitaloceanspaces.com',
      'dexkit-storage.nyc3.digitaloceanspaces.com',
      'dexkit-test.nyc3.digitaloceanspaces.com',
    ],
  },
};

export default nextConfig;
