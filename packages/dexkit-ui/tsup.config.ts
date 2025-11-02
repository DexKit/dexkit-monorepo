
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'index.ts',
    components: 'components/index.ts',
    hooks: 'hooks/index.ts',
    'state': 'state/index.ts',
    'types/config': 'types/config.ts',
    'types': 'types/index.ts',
    'components/dialogs/ChooseNetworkDialog': 'components/dialogs/ChooseNetworkDialog.tsx',
    'components/dialogs/SignMessageDialog': 'components/dialogs/SignMessageDialog.tsx',
    'components/dialogs/SwitchNetworkDialog': 'components/dialogs/SwitchNetworkDialog.tsx',
    'components/ConnectWalletDialog': 'components/ConnectWalletDialog.tsx',
    'components/dialogs/WatchTransactionDialog': 'components/dialogs/WatchTransactionDialog.tsx',
    'components/dialogs/HoldingKitDialog': 'components/dialogs/HoldingKitDialog.tsx',
    'components/dialogs/SelectCurrencyDialog': 'components/dialogs/SelectCurrencyDialog.tsx',
    'components/dialogs/SelectLanguageDialog': 'components/dialogs/SelectLanguageDialog.tsx',
    'components/mediaDialog': 'components/mediaDialog/index.tsx',
    'modules/nft': 'modules/nft/index.ts',
    'modules/nft/hooks': 'modules/nft/hooks/index.ts',
    'modules/forms/hooks': 'modules/forms/hooks/index.ts',
    'modules/forms/components/FormInfoCard': 'modules/forms/components/FormInfoCard.tsx',
    'modules/swap/hooks': 'modules/swap/hooks/index.ts',
    'modules/wizard/constants': 'modules/wizard/constants/index.ts',
    'modules/wallet/components/containers/EvmWalletContainer': 'modules/wallet/components/containers/EvmWalletContainer.tsx'
  },
  outDir: 'dist',
  platform: 'browser',
  dts: true
})