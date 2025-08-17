import securityConfig from './next.config.security.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: ['ethers', '@mui/material', '@mui/icons-material'],
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

    // Enhanced bundle optimization
    if (!dev && !isServer) {
      // Disable source maps in production
      config.devtool = false;

      // Aggressive bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: -10,
            enforce: true,
          },
          mui: {
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            name: 'mui',
            chunks: 'all',
            priority: 10,
            enforce: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
            enforce: true,
          },
          ethers: {
            test: /[\\/]node_modules[\\/](ethers|@ethersproject)[\\/]/,
            name: 'ethers',
            chunks: 'all',
            priority: 15,
            enforce: true,
          },
        },
      };

      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
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
