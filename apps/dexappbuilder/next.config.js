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
    '@react-page/editor',
    '@uiw/react-md-editor',
    '@uiw/react-markdown-preview',
    'react-markdown',
    'react-dnd',
    'mui-color-input',
    'formik-mui',
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
