import { defineConfig } from 'tsup';

/*const replaceNodeBuiltIns = () => {
  const replace = {
    'path': require('path-browserify')
  }
  const filter = RegExp(`^(${Object.keys(replace).join("|")})$`);
  return {
    name: "replaceNodeBuiltIns",
    //@ts-ignore
    setup(build) {
      //@ts-ignore
      build.onResolve({ filter }, arg => ({
        //@ts-ignore
        path: replace[arg.path],
      }));
    },
  };
}*/

export default defineConfig({
  replaceNodeEnv: true,
  outDir: 'dist',
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  entry: {
    index: 'index.tsx',
    'components/Card': 'components/Card.tsx',
    'components/NFTGrid': 'components/NFTGrid.tsx',
    'components/ProtectedContent': 'components/ProtectedContent.tsx',
    'components/SectionsRenderer': 'components/SectionsRenderer.tsx',
    'components/sections/AssetSection': 'components/sections/AssetSection/index.tsx',
    'state/atoms': 'state/atoms.ts',
    'themes/theme': 'themes/theme.ts',
    'utils/intl': 'utils/intl.ts'
  },
  esbuildOptions(options) {
    options.alias = {
      'react/jsx-runtime.js': 'react/jsx-runtime'
    }
  },
  injectStyle: true,
  format: ['esm'],
  //shims: true,
  minify: true,
  dts: true,
  platform: 'browser',
  external: [
    'next', 'next/*',
    '@dexkit/ui', '@dexkit/ui/*',
    '@dexkit/core', '@dexkit/core/*',
    '@dexkit/exchange', '@dexkit/exchange/*',
    '@dexkit/web3forms', '@dexkit/web3forms/*',
    '@dexkit/dexappbuilder-viewer/*',
    'fs', 'stream', 'zlib', 'http', 'https', 'crypto'
  ]
})