import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'index.ts',
    hooks: 'hooks/index.ts',
    types: 'types/index.ts',
    constants: 'constants/index.ts',
    services: 'services/index.ts',
    utils: 'utils/index.ts',
    contexts: 'contexts/index.ts',
  },
  outDir: 'dist',
  platform: 'browser',
  dts: true
})

