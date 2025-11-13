import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dexappbuilderRenderPackage = path.resolve(__dirname, '../../packages/dexappbuilder-render');
const dexappbuilderRenderDist = path.resolve(__dirname, '../../packages/dexappbuilder-render/dist');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  experimental: {
    optimizePackageImports: ['ethers', '@mui/material', '@mui/icons-material'],
    reactCompiler: false,
    webpackBuildWorker: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  turbopack: {
    resolveAlias: {
      'react/jsx-runtime.js': 'react/jsx-runtime',
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
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
    'formik-mui',
  ],
  webpack(config, { isServer }) {
    /*config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })*/

    config.resolve.alias = {
      ...config.resolve.alias,
      '@dexkit/core': '@dexkit/dexappbuilder-render/dexkit-core',
      '@dexkit/ui': '@dexkit/dexappbuilder-render/dexkit-ui',
      '@dexkit/exchange': '@dexkit/dexappbuilder-render/dexkit-exchange',
      '@dexkit/widgets': '@dexkit/dexappbuilder-render/dexkit-widgets',
      '@dexkit/wallet-connectors': '@dexkit/dexappbuilder-render/dexkit-wallet-connectors',
      '@dexkit/web3forms': '@dexkit/dexappbuilder-render/dexkit-web3forms',
      '@dexkit/dexappbuilder-viewer': '@dexkit/dexappbuilder-render/dexappbuilder-viewer',
      [path.resolve(dexappbuilderRenderDist, 'constants/compiled-lang')]: path.resolve(dexappbuilderRenderDist, 'dexkit-ui/constants/compiled-lang'),
      'react/jsx-runtime.js': 'react/jsx-runtime',
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
    };

    const originalPlugins = config.resolve.plugins || [];
    config.resolve.plugins = [
      ...originalPlugins,
      {
        apply(resolver) {
          const target = resolver.ensureHook('resolve');
          
          resolver
            .getHook('described-resolve')
            .tapAsync('FixCompiledLangImports', (request, resolveContext, callback) => {
              if (request.request && request.request.includes('../constants/compiled-lang')) {
                const issuer = request.context?.issuer || '';
                const path = request.path || '';
                const isFromChunk = issuer.includes('chunk-') || issuer.includes('dexappbuilder-render/dist');
                const isFromDexappbuilderRender = issuer.includes(dexappbuilderRenderDist) || path.includes(dexappbuilderRenderDist);
                
                if (isFromChunk || isFromDexappbuilderRender) {
                  const fixedRequest = request.request.replace(
                    /\.\.\/constants\/compiled-lang/g,
                    './dexkit-ui/constants/compiled-lang'
                  );
                  
                  const newRequest = {
                    ...request,
                    request: fixedRequest,
                  };
                  
                  return resolver.doResolve(target, newRequest, `fixed compiled-lang import path from chunk`, resolveContext, callback);
                }
              }
              return callback();
            });
          
          resolver
            .getHook('described-resolve')
            .tapAsync('DexkitAliasResolver', (request, resolveContext, callback) => {
              if (!request.request || !request.request.startsWith('@dexkit/')) {
                return callback();
              }

              if (request.request.includes('dexappbuilder-render')) {
                return callback();
              }

              const packageMappings = {
                '@dexkit/core': 'dexkit-core',
                '@dexkit/ui': 'dexkit-ui',
                '@dexkit/exchange': 'dexkit-exchange',
                '@dexkit/widgets': 'dexkit-widgets',
                '@dexkit/wallet-connectors': 'dexkit-wallet-connectors',
                '@dexkit/web3forms': 'dexkit-web3forms',
                '@dexkit/dexappbuilder-viewer': 'dexappbuilder-viewer',
              };

              const parts = request.request.split('/');
              const packageName = parts[0];

              if (packageMappings[packageName]) {
                const mappedPackage = packageMappings[packageName];
                const subpath = parts.slice(1).join('/');
                const newRequest = subpath
                  ? `@dexkit/dexappbuilder-render/${mappedPackage}/${subpath}`
                  : `@dexkit/dexappbuilder-render/${mappedPackage}`;

                const newRequestObj = {
                  ...request,
                  request: newRequest,
                };

                return resolver.doResolve(target, newRequestObj, `aliased @dexkit package to ${newRequest}`, resolveContext, callback);
              }

              return callback();
            });
        },
      },
    ];

    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.seadn.io',
      },
      {
        protocol: 'https',
        hostname: 'dweb.link',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.moralis.io',
      },
      {
        protocol: 'https',
        hostname: 'dashboard.mypinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'arpeggi.io',
      },
      {
        protocol: 'https',
        hostname: 'arweave.net',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'assets.otherside.xyz',
      },
      {
        protocol: 'https',
        hostname: 'dexkit-storage.nyc3.cdn.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'dexkit-storage.nyc3.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'dexkit-test.nyc3.digitaloceanspaces.com',
      },
    ],
  },
};

export default nextConfig;
