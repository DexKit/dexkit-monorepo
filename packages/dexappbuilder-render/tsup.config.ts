import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    // Main package
    index: 'src/index.tsx',
    widget: 'src/widget.tsx',

    'dexkit-core': '../dexkit-core/index.ts',
    'dexkit-core/types': '../dexkit-core/types/index.ts',
    'dexkit-core/utils': '../dexkit-core/utils/index.ts',
    'dexkit-core/hooks': '../dexkit-core/hooks/index.ts',
    'dexkit-core/services': '../dexkit-core/services/index.ts',
    'dexkit-core/constants': '../dexkit-core/constants/index.ts',
    'dexkit-core/providers': '../dexkit-core/providers/index.ts',
    'dexkit-core/constants/network': '../dexkit-core/constants/networks.ts',
    'dexkit-core/constants/enums': '../dexkit-core/constants/enums.ts',
    'dexkit-core/constants/abis': '../dexkit-core/constants/abis/index.ts',

    // @dexkit/ui - modules
    'dexkit-ui': '../dexkit-ui/index.ts',
    'dexkit-ui/components': '../dexkit-ui/components/index.ts',
    'dexkit-ui/hooks': '../dexkit-ui/hooks/index.ts',
    'dexkit-ui/types': '../dexkit-ui/types/index.ts',
    'dexkit-ui/state': '../dexkit-ui/state/index.ts',

    // @dexkit/exchange - modules
    'dexkit-exchange': '../dexkit-exchange/index.ts',
    'dexkit-exchange/hooks': '../dexkit-exchange/hooks/index.ts',
    'dexkit-exchange/types': '../dexkit-exchange/types/index.ts',
    'dexkit-exchange/services': '../dexkit-exchange/services/index.ts',
    'dexkit-exchange/constants': '../dexkit-exchange/constants/index.ts',
    'dexkit-exchange/contexts': '../dexkit-exchange/contexts/index.ts',

    // @dexkit/wallet-connectors - modules
    'dexkit-wallet-connectors': '../dexkit-wallet-connectors/index.ts',
    'dexkit-wallet-connectors/hooks': '../dexkit-wallet-connectors/hooks/index.ts',
    'dexkit-wallet-connectors/connectors': '../dexkit-wallet-connectors/connectors/index.ts',

    // @dexkit/widgets
    'dexkit-widgets': '../dexkit-widgets/src/index.tsx',

    // @dexkit/unlock-widget
    'dexkit-unlock-widget': '../dexkit-unlock/src/index.tsx',

    // @dexkit/web3forms - modules
    'dexkit-web3forms': '../web3forms/index.ts',
    'dexkit-web3forms/hooks': '../web3forms/hooks/index.ts',
    'dexkit-web3forms/types': '../web3forms/types/index.ts',
    'dexkit-web3forms/services': '../web3forms/services/index.ts',
    'dexkit-web3forms/components/ContractFormView': '../web3forms/components/ContractFormView.tsx',

    // @dexkit/dexappbuilder-viewer
    'dexappbuilder-viewer': '../dexappbuilder-viewer/index.tsx',
  },
  platform: 'browser',
  dts: {
    compilerOptions: {
      skipLibCheck: true,
      rootDir: '.',
      composite: false,
    },
  },
  format: ['esm'],
  outDir: 'dist',
  noExternal: [/^@dexkit\/.*/],
  external: [
    'crypto',
    'stream',
    'http',
    'https',
    'zlib',
    'fs',
    'path',
    'os',
    'util',
    'buffer',
    'net',
    'tls',
    'url',
    'querystring',
    'events',
    'assert',
    'process',
  ],
  esbuildOptions(options) {
    options.alias = {
      'react/jsx-runtime.js': 'react/jsx-runtime'
    };
  },
  replaceNodeEnv: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});

