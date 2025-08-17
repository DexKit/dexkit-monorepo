import securityConfig from './next.config.security.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['ethers'],
    turbo: {
      resolveAlias: {
        'react/jsx-runtime.js': 'react/jsx-runtime',
        'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
      },
    },
  },
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
  webpack(config, { dev, isServer }) {
    // Basic webpack configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime.js': 'react/jsx-runtime',
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
    };

    // Security-specific webpack configuration
    if (!dev && !isServer) {
      // Client-side only optimizations
      config.devtool = false;

      // Optimize bundle splitting for client
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          mui: {
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            name: 'mui',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }

    // Server-side specific configurations
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'self': 'globalThis',
        'window': 'globalThis',
        'document': 'globalThis',
      });
    }

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

  // Security configurations from security config
  poweredByHeader: securityConfig.poweredByHeader,
  compress: securityConfig.compress,

  // Security headers
  async headers() {
    return securityConfig.headers();
  },
};

export default nextConfig;
