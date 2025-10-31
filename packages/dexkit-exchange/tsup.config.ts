import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'index.ts',
    hooks: 'hooks/index.ts',
    constants: 'constants/index.ts',
    'constants/messages': 'constants/messages.ts',
    services: 'services/index.ts',
    types: 'types/index.ts',
    components: 'components/TradeWidget/index.tsx'
  },
  platform: 'browser',
  external: ['react', 'react-dom', '@dexkit/core', '@dexkit/ui'],
  dts: true
})
