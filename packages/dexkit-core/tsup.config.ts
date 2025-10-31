

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'index.ts',
    types: 'types/index.ts',
    utils: 'utils/index.ts',
    'utils/ipfs': 'utils/ipfs.ts',
    'utils/blockchain': 'utils/blockchain.ts',
    hooks: 'hooks/index.ts',
    services: 'services/index.ts',
    providers: 'providers/index.ts',
    constants: 'constants/index.ts',
    'constants/network': 'constants/networks.ts',
    'constants/networks': 'constants/networks.ts',
    'constants/enums': 'constants/enums.ts',
    'constants/abis': 'constants/abis/index.ts',
    'constants/userEvents': 'constants/userEvents.ts',
    'constants/zrx': 'constants/zrx.ts',
    'utils/ethers/isAddress': 'utils/ethers/isAddress.ts',
    'utils/ethers/abi/Interface': 'utils/ethers/abi/Interface.ts',
    'utils/ethers/parseUnits': 'utils/ethers/parseUnits.ts'
  },
  platform: 'browser',
  external: ['@dexkit/ui', '@dexkit/ui/*'],
  dts: true
})