/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();

const withTM = require('next-transpile-modules')([
  '@dexkit/widgets',
  '@dexkit/ui',
  '@dexkit/core',
  '@dexkit/web3forms',
  '@dexkit/wallet-connectors',
  '@dexkit/dexappbuilder-viewer',
  '@dexkit/exchange',
]); // pass the modules you would like to see transpiled

module.exports = removeImports(
  withTM({
    reactStrictMode: true,
    staticPageGenerationTimeout: 30000,
    experimental: { images: { allowFutureImage: true } },
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
      ],
    },
  }),
);
