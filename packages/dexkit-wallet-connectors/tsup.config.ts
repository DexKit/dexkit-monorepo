import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'index.ts',
    connectors: 'connectors/index.ts',
    hooks: 'hooks/index.ts',
    providers: 'providers/index.ts',
    services: 'services/index.ts',
    utils: 'utils/index.ts',
    types: 'types/index.ts',
  },
  outDir: 'dist',
  platform: 'browser',
  dts: true
})

