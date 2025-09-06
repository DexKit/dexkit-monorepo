/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['ethers'],
  },

  // Moved from experimental to root level
  serverExternalPackages: [],

  transpilePackages: [
    '@dexkit/widgets',
    '@dexkit/ui',
    '@dexkit/core',
    '@dexkit/web3forms',
    '@dexkit/wallet-connectors',
    '@dexkit/dexappbuilder-viewer',
    '@dexkit/dexappbuilder-render',
    '@dexkit/exchange',
    '@react-page/editor',
    '@uiw/react-md-editor',
    '@uiw/react-markdown-preview',
    'react-markdown',
    'react-dnd',
    'mui-color-input',
  ],

  // SWC minification is enabled by default in Next.js 15

  // Additional Next.js 15 compatibility settings
  compiler: {
    removeConsole: false,
  },

  // React 19 compatibility
  reactStrictMode: false,


  webpack(config, { isServer }) {
    // Enhanced webpack config to completely exclude Magic modules

    // Exclude Magic Wallet modules to prevent import errors
    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime.js': 'react/jsx-runtime',
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
      '@magic-ext/oauth': false,
      '@magic-ext/oauth/dist/es/index.mjs': false,
      '@magic-ext/oauth/dist/es/core': false,
      '@magic-ext/oauth/dist/es': false,
      '@magic-sdk/admin': false,
      'magic-sdk': false,
      '@magic-sdk/react': false,
      '@magic-sdk/provider': false,
    };

    // Add fallback for Magic modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@magic-ext/oauth': false,
      '@magic-sdk/admin': false,
      'magic-sdk': false,
      '@magic-sdk/react': false,
      '@magic-sdk/provider': false,
    };

    // Enhanced module rules for Magic modules
    config.module.rules.push({
      test: /node_modules\/(@magic-ext\/oauth|@magic-sdk|magic-sdk)/,
      use: 'null-loader'
    });

    // Additional rule for thirdweb magic connectors
    config.module.rules.push({
      test: /node_modules\/@thirdweb-dev\/.*\/magic/,
      use: 'null-loader'
    });

    // Exclude Magic from thirdweb imports
    config.module.rules.push({
      test: /node_modules\/@magic-ext\/oauth/,
      use: 'null-loader'
    });

    // Exclude Magic from thirdweb magic imports
    config.module.rules.push({
      test: /node_modules\/@thirdweb-dev\/.*magic.*\.js$/,
      use: 'null-loader'
    });

    // More aggressive Magic exclusion
    config.module.rules.push({
      test: /node_modules\/@magic-ext\/oauth\/dist\/es\/index\.mjs$/,
      use: 'null-loader'
    });

    config.module.rules.push({
      test: /node_modules\/@magic-ext\/oauth\/dist\/es\/core/,
      use: 'null-loader'
    });

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

  turbopack: {
    resolveAlias: {
      'react/jsx-runtime.js': 'react/jsx-runtime',
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
    }
  }
};

export default nextConfig;
