

import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'index.ts',
    'hooks': 'hooks/index.ts',
    'hooks/useBlockNumber': 'hooks/useBlockNumber.ts',
    'hooks/payments': 'hooks/payments.ts',
    'hooks/auth': 'hooks/auth.ts',
    'hooks/gatedConditions': 'hooks/gatedConditions.ts',
    'hooks/app/useProtectedAppConfig': 'hooks/app/useProtectedAppConfig.ts',
    'hooks/useLocale': 'hooks/useLocale.ts',
    'hooks/useAppConfig': 'hooks/useAppConfig.ts',
    'hooks/useSiteId': 'hooks/useSiteId.ts',
    'hooks/wallet': 'hooks/wallet.ts',
    'components': 'components/index.ts',
    'components/AppLink': 'components/AppLink.tsx',
    'components/AppDialogTitle': 'components/AppDialogTitle.tsx',
    'components/CopyIconButton': 'components/CopyIconButton.tsx',
    'components/LazyComponent': 'components/LazyComponent.tsx',
    'components/CodeSection': 'components/CodeSection.tsx',
    'components/PageHeader': 'components/PageHeader.tsx',
    'components/LoginAppButton': 'components/LoginAppButton.tsx',
    'components/ConnectButton': 'components/ConnectButton.tsx',
    'components/DecimalInput': 'components/DecimalInput.tsx',
    'components/gated-content/GatedConditionView': 'components/gated-content/GatedConditionView.tsx',
    'components/ConnectWalletButton': 'components/ConnectWalletButton.tsx',
    'components/dialogs/AddCreditDialog': 'components/dialogs/AddCreditDialog.tsx',
    'components/EvmReceiveQRCode': 'components/EvmReceiveQRCode.tsx',
    'components/Widget': 'components/Widget.tsx',
    'providers/ThirdwebV4Provider': 'providers/ThirdwebV4Provider.tsx',
    'providers/DexkitProvider': 'providers/DexkitProvider.tsx',
    'providers/SiteProvider': 'providers/SiteProvider.tsx',
    'providers/authStateProvider': 'providers/authStateProvider.tsx',
    'providers/authProvider': 'providers/authProvider.tsx',
    'providers/configWizardProvider': 'providers/configWizardProvider.tsx',
    'context/AppConfigContext': 'context/AppConfigContext.tsx',
    'context/AdminContext': 'context/AdminContext.tsx',
    'utils': 'utils/index.ts',
    'constants': 'constants/index.ts',
    'constants/messages/common': 'constants/messages/common.ts',
    'constants/enum': 'constants/enum.ts',
    'types': 'types/index.ts',
    'modules/swap/constants': 'modules/swap/constants/index.ts',
    'modules/swap/hooks': 'modules/swap/hooks/index.ts',
    'modules/swap/types': 'modules/swap/types/index.ts',
    'modules/nft/utils': 'modules/nft/utils/index.ts',
    'modules/nft/hooks': 'modules/nft/hooks/index.ts',
    'modules/commerce/components/CommerceSection': 'modules/commerce/components/CommerceSection/index.tsx',
    'modules/nft/components/AssetMedia': 'modules/nft/components/AssetMedia.tsx',
    'modules/nft/components/AssetImage': 'modules/nft/components/AssetImage.tsx',
    'modules/nft/components/NFTCardMedia': 'modules/nft/components/NFTCardMedia.tsx',
    'modules/nft/components/AssetListOrderbook': 'modules/nft/components/AssetListOrderbook.tsx',
    'modules/nft/components/AssetFromApi': 'modules/nft/components/AssetFromApi.tsx',
    'modules/nft/components/CollectionFromApi': 'modules/nft/components/CollectionFromApi.tsx',
    'modules/nft/components/AssetLeftSection': 'modules/nft/components/AssetLeftSection.tsx',
    'modules/nft/components/AssetOptionsProvider': 'modules/nft/components/AssetOptionsProvider.tsx',
    'modules/nft/components/AssetPageActions': 'modules/nft/components/AssetPageActions.tsx',
    'modules/nft/components/AssetPageTitle': 'modules/nft/components/AssetPageTitle.tsx',
    'modules/nft/components/AssetPricePaper': 'modules/nft/components/AssetPricePaper.tsx',
    'modules/nft/components/AssetRightSection': 'modules/nft/components/AssetRightSection.tsx',
    'modules/nft/components/AssetTabs': 'modules/nft/components/AssetTabs.tsx',
    'modules/nft/components': 'modules/nft/components/index.ts',
    'modules/nft/components/container/AssetStoreContainer': 'modules/nft/components/container/AssetStoreContainer.tsx',
    'modules/nft/services/query': 'modules/nft/services/query.ts',
    'modules/nft/services': 'modules/nft/services/index.ts',
    'modules/nft/services/collection': 'modules/nft/services/collection.ts',
    'modules/nft/types': 'modules/nft/types/index.ts',
    'modules/wizard/types': 'modules/wizard/types/index.ts',
    'modules/wizard/types/config': 'modules/wizard/types/config.ts',
    'modules/wizard/types/section': 'modules/wizard/types/section.ts',
    'modules/wizard/hooks/widget': 'modules/wizard/hooks/widget.ts',
    'modules/nft/components/AssetHead': 'modules/nft/components/AssetHead.tsx',
    'modules/admin/components/tables/MaketplacesTableSkeleton': 'modules/admin/components/tables/MaketplacesTableSkeleton.tsx',
    'modules/admin/components/tables/MarketplacesTableV2': 'modules/admin/components/tables/MarketplacesTableV2/index.tsx',
    'modules/admin/components/tables/PageTemplatesTable': 'modules/admin/components/tables/PageTemplatesTable.tsx',
    'modules/admin/components/tables/Widgets': 'modules/admin/components/tables/Widgets/index.tsx',
    'modules/whitelabel/hooks/useWhitelabelConfigsByOwnerPaginatedQuery': 'modules/whitelabel/hooks/useWhitelabelConfigsByOwnerPaginatedQuery.ts',
    'modules/whitelabel/hooks/useSendWidgetConfigMutation': 'modules/whitelabel/hooks/useSendWidgetConfigMutation.ts',
    'components/layouts/authMain': 'components/layouts/authMain.tsx',
    'components/layouts/main': 'components/layouts/main.tsx',
    'services/auth': 'services/auth.ts',
    'services/app': 'services/app.ts',
    'services/app/config': 'services/app/config.ts',
    'constants/api': 'constants/api.ts'
  },
  platform: 'browser',
  external: [
    // next/compiled deps que arrastran node builtins
    'next', 'next/*', 'next/dist/*',
    // node builtins referenciados indirectamente
    'fs', 'stream', 'zlib', 'http', 'https'
  ],
  dts: true,
  onSuccess: async () => {
    // Copy JSON files to dist
    const destDir = join(__dirname, 'dist', 'config')
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true })
    }

    const jsonFiles = ['app.minimal.json', 'app.json', 'widget.json']
    jsonFiles.forEach(file => {
      const sourcePath = join(__dirname, 'config', file)
      const destPath = join(destDir, file)
      if (existsSync(sourcePath)) {
        copyFileSync(sourcePath, destPath)
      }
    })
  }
})