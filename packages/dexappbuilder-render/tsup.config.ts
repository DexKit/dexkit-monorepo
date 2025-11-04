import { copyFileSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    // Main package
    index: 'src/index.tsx',
    widget: 'src/widget.tsx',

    'dexkit-core/index': '../dexkit-core/index.ts',
    'dexkit-core/types': '../dexkit-core/types/index.ts',
    'dexkit-core/types/blockchain': '../dexkit-core/types/blockchain.ts',
    'dexkit-core/types/coin': '../dexkit-core/types/coin.ts',
    'dexkit-core/types/nft': '../dexkit-core/types/nft.ts',
    'dexkit-core/utils': '../dexkit-core/utils/index.ts',
    'dexkit-core/utils/blockchain': '../dexkit-core/utils/blockchain.ts',
    'dexkit-core/utils/browser': '../dexkit-core/utils/browser.ts',
    'dexkit-core/utils/formatStringNumber': '../dexkit-core/utils/formatStringNumber.ts',
    'dexkit-core/utils/ipfs': '../dexkit-core/utils/ipfs.ts',
    'dexkit-core/utils/numbers': '../dexkit-core/utils/numbers.ts',
    'dexkit-core/utils/RetryProvider': '../dexkit-core/utils/RetryProvider.ts',
    'dexkit-core/utils/text': '../dexkit-core/utils/text.ts',
    'dexkit-core/utils/userAgent': '../dexkit-core/utils/userAgent.ts',
    'dexkit-core/utils/ethers/arrayify': '../dexkit-core/utils/ethers/arrayify.ts',
    'dexkit-core/utils/ethers/formatEther': '../dexkit-core/utils/ethers/formatEther.ts',
    'dexkit-core/utils/ethers/formatUnits': '../dexkit-core/utils/ethers/formatUnits.ts',
    'dexkit-core/utils/ethers/getAddress': '../dexkit-core/utils/ethers/getAddress.ts',
    'dexkit-core/utils/ethers/isAddress': '../dexkit-core/utils/ethers/isAddress.ts',
    'dexkit-core/utils/ethers/isBytesLike': '../dexkit-core/utils/ethers/isBytesLike.ts',
    'dexkit-core/utils/ethers/isHexString': '../dexkit-core/utils/ethers/isHexString.ts',
    'dexkit-core/utils/ethers/parseEther': '../dexkit-core/utils/ethers/parseEther.ts',
    'dexkit-core/utils/ethers/parseUnits': '../dexkit-core/utils/ethers/parseUnits.ts',
    'dexkit-core/utils/ethers/abi/Interface': '../dexkit-core/utils/ethers/abi/Interface.ts',
    'dexkit-core/hooks': '../dexkit-core/hooks/index.ts',
    'dexkit-core/hooks/blockchain': '../dexkit-core/hooks/blockchain.ts',
    'dexkit-core/hooks/coin': '../dexkit-core/hooks/coin.ts',
    'dexkit-core/hooks/nft': '../dexkit-core/hooks/nft.ts',
    'dexkit-core/hooks/wallet': '../dexkit-core/hooks/wallet.ts',
    'dexkit-core/hooks/misc': '../dexkit-core/hooks/misc.ts',
    'dexkit-core/hooks/useDexKitContext': '../dexkit-core/hooks/useDexKitContext.ts',
    'dexkit-core/services': '../dexkit-core/services/index.ts',
    'dexkit-core/services/balances': '../dexkit-core/services/balances.ts',
    'dexkit-core/constants': '../dexkit-core/constants/index.ts',
    'dexkit-core/constants/networks': '../dexkit-core/constants/networks.ts',
    'dexkit-core/constants/chainsViem': '../dexkit-core/constants/chainsViem.ts',
    'dexkit-core/constants/evmChainImages': '../dexkit-core/constants/evmChainImages.ts',
    'dexkit-core/constants/networkProvider': '../dexkit-core/constants/networkProvider.ts',
    'dexkit-core/constants/permissions': '../dexkit-core/constants/permissions.ts',
    'dexkit-core/constants/userEvents': '../dexkit-core/constants/userEvents.ts',
    'dexkit-core/constants/zrx': '../dexkit-core/constants/zrx.ts',
    'dexkit-core/constants/network': '../dexkit-core/constants/networks.ts',
    'dexkit-core/constants/enums': '../dexkit-core/constants/enums.ts',
    'dexkit-core/constants/abis': '../dexkit-core/constants/abis/index.ts',
    'dexkit-core/providers': '../dexkit-core/providers/index.ts',
    'dexkit-core/providers/DexKitContext': '../dexkit-core/providers/DexKitContext.tsx',

    // @dexkit/ui - modules
    'dexkit-ui/index': '../dexkit-ui/index.ts',
    'dexkit-ui/components': '../dexkit-ui/components/index.ts',
    'dexkit-ui/hooks': '../dexkit-ui/hooks/index.ts',
    'dexkit-ui/hooks/useLocale': '../dexkit-ui/hooks/useLocale.ts',
    'dexkit-ui/hooks/useSiteId': '../dexkit-ui/hooks/useSiteId.ts',
    'dexkit-ui/hooks/useAppConfig': '../dexkit-ui/hooks/useAppConfig.ts',
    'dexkit-ui/hooks/auth': '../dexkit-ui/hooks/auth.ts',
    'dexkit-ui/hooks/account': '../dexkit-ui/hooks/account.ts',
    'dexkit-ui/hooks/wallet': '../dexkit-ui/hooks/wallet.ts',
    'dexkit-ui/hooks/apiKey': '../dexkit-ui/hooks/apiKey.ts',
    'dexkit-ui/hooks/gatedConditions': '../dexkit-ui/hooks/gatedConditions.ts',
    'dexkit-ui/hooks/userEvents': '../dexkit-ui/hooks/userEvents.ts',
    'dexkit-ui/hooks/theme/useThemeMode': '../dexkit-ui/hooks/theme/useThemeMode.ts',
    'dexkit-ui/hooks/app/useAppWizardConfig': '../dexkit-ui/hooks/app/useAppWizardConfig.ts',
    'dexkit-ui/hooks/app/useAppNFT': '../dexkit-ui/hooks/app/useAppNFT.ts',
    'dexkit-ui/hooks/app/useEditWidgetId': '../dexkit-ui/hooks/app/useEditWidgetId.ts',
    'dexkit-ui/hooks/app/useIsWidget': '../dexkit-ui/hooks/app/useIsWidget.ts',
    'dexkit-ui/hooks/app/useProtectedAppConfig': '../dexkit-ui/hooks/app/useProtectedAppConfig.ts',
    'dexkit-ui/types': '../dexkit-ui/types/index.ts',
    'dexkit-ui/state': '../dexkit-ui/state/index.ts',
    'dexkit-ui/types/config': '../dexkit-ui/modules/wizard/types/config.ts',
    'dexkit-ui/modules/admin/components/tables/MaketplacesTableSkeleton': '../dexkit-ui/modules/admin/components/tables/MaketplacesTableSkeleton.tsx',
    'dexkit-ui/modules/admin/components/tables/MarketplacesTableV2': '../dexkit-ui/modules/admin/components/tables/MarketplacesTableV2/index.tsx',
    'dexkit-ui/modules/evm-burn-nft/components/dialogs/EvmBurnNftDialog': '../dexkit-ui/modules/evm-burn-nft/components/dialogs/EvmBurnNftDialog.tsx',
    'dexkit-ui/modules/evm-transfer-nft/components/dialogs/EvmTransferNftDialog': '../dexkit-ui/modules/evm-transfer-nft/components/dialogs/EvmTransferNftDialog.tsx',
    'dexkit-ui/components/dialogs/ChooseNetworkDialog': '../dexkit-ui/components/dialogs/ChooseNetworkDialog.tsx',
    'dexkit-ui/components/dialogs/SignMessageDialog': '../dexkit-ui/components/dialogs/SignMessageDialog.tsx',
    'dexkit-ui/components/dialogs/SwitchNetworkDialog': '../dexkit-ui/components/dialogs/SwitchNetworkDialog.tsx',
    'dexkit-ui/components/dialogs/WatchTransactionDialog': '../dexkit-ui/components/dialogs/WatchTransactionDialog.tsx',
    'dexkit-ui/components/dialogs/HoldingKitDialog': '../dexkit-ui/components/dialogs/HoldingKitDialog.tsx',
    'dexkit-ui/components/dialogs/SelectCurrencyDialog': '../dexkit-ui/components/dialogs/SelectCurrencyDialog.tsx',
    'dexkit-ui/components/dialogs/SelectLanguageDialog': '../dexkit-ui/components/dialogs/SelectLanguageDialog.tsx',
    'dexkit-ui/components/dialogs/SelectIconDialog': '../dexkit-ui/components/dialogs/SelectIconDialog.tsx',
    'dexkit-ui/components/dialogs/AppDataTableDialog': '../dexkit-ui/components/dialogs/AppDataTableDialog.tsx',
    'dexkit-ui/components/mediaDialog': '../dexkit-ui/components/mediaDialog/index.tsx',
    'dexkit-ui/components/layouts/main': '../dexkit-ui/components/layouts/main.tsx',
    'dexkit-ui/components/layouts/authMain': '../dexkit-ui/components/layouts/authMain.tsx',
    'dexkit-ui/components/layouts/GlobalDialogs': '../dexkit-ui/components/layouts/GlobalDialogs.tsx',
    'dexkit-ui/components/LoginAppButton': '../dexkit-ui/components/LoginAppButton.tsx',
    'dexkit-ui/components/AppLink': '../dexkit-ui/components/AppLink.tsx',
    'dexkit-ui/components/AppConfirmDialog': '../dexkit-ui/components/AppConfirmDialog.tsx',
    'dexkit-ui/components/AppErrorBoundary': '../dexkit-ui/components/AppErrorBoundary.tsx',
    'dexkit-ui/components/ConnectButton': '../dexkit-ui/components/ConnectButton.tsx',
    'dexkit-ui/components/PageHeader': '../dexkit-ui/components/PageHeader.tsx',
    'dexkit-ui/components/AppDialogTitle': '../dexkit-ui/components/AppDialogTitle.tsx',
    'dexkit-ui/components/CompletationProvider': '../dexkit-ui/components/CompletationProvider.tsx',
    'dexkit-ui/modules/nft': '../dexkit-ui/modules/nft/index.ts',
    'dexkit-ui/modules/nft/hooks': '../dexkit-ui/modules/nft/hooks/index.ts',
    'dexkit-ui/modules/nft/hooks/collection': '../dexkit-ui/modules/nft/hooks/collection.ts',
    'dexkit-ui/modules/nft/services': '../dexkit-ui/modules/nft/services/index.ts',
    'dexkit-ui/modules/nft/services/query': '../dexkit-ui/modules/nft/services/query.ts',
    'dexkit-ui/modules/nft/services/collection': '../dexkit-ui/modules/nft/services/collection.ts',
    'dexkit-ui/modules/nft/types': '../dexkit-ui/modules/nft/types/index.ts',
    'dexkit-ui/modules/nft/utils': '../dexkit-ui/modules/nft/utils/index.ts',
    'dexkit-ui/modules/nft/constants': '../dexkit-ui/modules/nft/constants/index.ts',
    'dexkit-ui/modules/nft/components': '../dexkit-ui/modules/nft/components/index.ts',
    'dexkit-ui/modules/nft/components/AssetFromApi': '../dexkit-ui/modules/nft/components/AssetFromApi.tsx',
    'dexkit-ui/modules/nft/components/AssetMedia': '../dexkit-ui/modules/nft/components/AssetMedia.tsx',
    'dexkit-ui/modules/nft/components/BaseAssetCard': '../dexkit-ui/modules/nft/components/BaseAssetCard.tsx',
    'dexkit-ui/modules/forms/hooks': '../dexkit-ui/modules/forms/hooks/index.ts',
    'dexkit-ui/modules/forms/components/FormInfoCard': '../dexkit-ui/modules/forms/components/FormInfoCard.tsx',
    'dexkit-ui/modules/forms/services': '../dexkit-ui/modules/forms/services/index.ts',
    'dexkit-ui/modules/forms/types': '../dexkit-ui/modules/forms/types/index.ts',
    'dexkit-ui/modules/forms/constants': '../dexkit-ui/modules/forms/constants/index.ts',
    'dexkit-ui/modules/swap/hooks': '../dexkit-ui/modules/swap/hooks/index.ts',
    'dexkit-ui/modules/swap/services': '../dexkit-ui/modules/swap/services/index.ts',
    'dexkit-ui/modules/swap/types': '../dexkit-ui/modules/swap/types/index.ts',
    'dexkit-ui/modules/swap/utils': '../dexkit-ui/modules/swap/utils/index.ts',
    'dexkit-ui/modules/swap/state': '../dexkit-ui/modules/swap/state/index.ts',
    'dexkit-ui/modules/swap/constants': '../dexkit-ui/modules/swap/constants/index.ts',
    'dexkit-ui/modules/wizard/constants': '../dexkit-ui/modules/wizard/constants/index.ts',
    'dexkit-ui/modules/wizard/types': '../dexkit-ui/modules/wizard/types/index.ts',
    'dexkit-ui/modules/wizard/hooks': '../dexkit-ui/modules/wizard/hooks/index.ts',
    'dexkit-ui/modules/wizard/services/widget': '../dexkit-ui/modules/wizard/services/widget.ts',
    'dexkit-ui/modules/wallet/components/containers/EvmWalletContainer': '../dexkit-ui/modules/wallet/components/containers/EvmWalletContainer.tsx',
    'dexkit-ui/modules/wallet/hooks': '../dexkit-ui/modules/wallet/hooks/index.ts',
    'dexkit-ui/modules/wallet/services': '../dexkit-ui/modules/wallet/services/index.ts',
    'dexkit-ui/modules/wallet/types': '../dexkit-ui/modules/wallet/types/index.ts',
    'dexkit-ui/modules/wallet/state': '../dexkit-ui/modules/wallet/state/index.ts',
    'dexkit-ui/modules/file/hooks': '../dexkit-ui/modules/file/hooks/index.ts',
    'dexkit-ui/modules/file/services': '../dexkit-ui/modules/file/services/index.ts',
    'dexkit-ui/modules/file/types': '../dexkit-ui/modules/file/types/index.ts',
    'dexkit-ui/modules/user/services': '../dexkit-ui/modules/user/services/index.ts',
    'dexkit-ui/modules/user/types': '../dexkit-ui/modules/user/types/index.ts',
    'dexkit-ui/modules/token/types': '../dexkit-ui/modules/token/types/index.ts',
    'dexkit-ui/modules/whitelabel/services': '../dexkit-ui/modules/whitelabel/services/index.ts',
    'dexkit-ui/modules/whitelabel/types': '../dexkit-ui/modules/whitelabel/types/index.ts',
    'dexkit-ui/modules/whitelabel/hooks/useDeleteMyAppMutation': '../dexkit-ui/modules/whitelabel/hooks/useDeleteMyAppMutation.ts',
    'dexkit-ui/modules/whitelabel/hooks/useDeletePageTemplateMutation': '../dexkit-ui/modules/whitelabel/hooks/useDeletePageTemplateMutation.ts',
    'dexkit-ui/modules/whitelabel/hooks/usePageTemplatesByOwnerQuery': '../dexkit-ui/modules/whitelabel/hooks/usePageTemplatesByOwnerQuery.ts',
    'dexkit-ui/modules/whitelabel/hooks/useWhitelabelConfigsByOwnerQuery': '../dexkit-ui/modules/whitelabel/hooks/useWhitelabelConfigsByOwnerQuery.ts',
    'dexkit-ui/modules/whitelabel/hooks/useWhitelabelConfigsByOwnerPaginatedQuery': '../dexkit-ui/modules/whitelabel/hooks/useWhitelabelConfigsByOwnerPaginatedQuery.ts',
    'dexkit-ui/modules/whitelabel/hooks/useSendConfigMutation': '../dexkit-ui/modules/whitelabel/hooks/useSendConfigMutation.ts',
    'dexkit-ui/modules/whitelabel/hooks/useSendWidgetConfigMutation': '../dexkit-ui/modules/whitelabel/hooks/useSendWidgetConfigMutation.ts',
    'dexkit-ui/modules/contract-wizard/hooks': '../dexkit-ui/modules/contract-wizard/hooks/index.ts',
    'dexkit-ui/modules/contract-wizard/hooks/thirdweb': '../dexkit-ui/modules/contract-wizard/hooks/thirdweb.ts',
    'dexkit-ui/modules/contract-wizard/components/ContractMetadataHeader': '../dexkit-ui/modules/contract-wizard/components/ContractMetadataHeader.tsx',
    'dexkit-ui/services/whitelabel': '../dexkit-ui/services/whitelabel.ts',
    'dexkit-ui/services/userEvents': '../dexkit-ui/services/userEvents.ts',
    'dexkit-ui/services/token': '../dexkit-ui/services/token.ts',
    'dexkit-ui/services/providers': '../dexkit-ui/services/providers.ts',
    'dexkit-ui/services/multical': '../dexkit-ui/services/multical.ts',
    'dexkit-ui/services/i18n': '../dexkit-ui/services/i18n.ts',
    'dexkit-ui/services/gatedConditions': '../dexkit-ui/services/gatedConditions.ts',
    'dexkit-ui/services/currency': '../dexkit-ui/services/currency.ts',
    'dexkit-ui/services/balances': '../dexkit-ui/services/balances.ts',
    'dexkit-ui/services/auth': '../dexkit-ui/services/auth.ts',
    'dexkit-ui/services/app': '../dexkit-ui/services/app.ts',
    'dexkit-ui/services/app/getAppConfigbySlug': '../dexkit-ui/services/app/getAppConfigbySlug.ts',
    'dexkit-ui/services/app/config': '../dexkit-ui/services/app/config.ts',
    'dexkit-ui/utils': '../dexkit-ui/utils/index.ts',
    'dexkit-ui/utils/youtube': '../dexkit-ui/utils/youtube.ts',
    'dexkit-ui/utils/theme': '../dexkit-ui/utils/theme.ts',
    'dexkit-ui/utils/image': '../dexkit-ui/utils/image.ts',
    'dexkit-ui/utils/fileValidation': '../dexkit-ui/utils/fileValidation.ts',
    'dexkit-ui/utils/coin': '../dexkit-ui/utils/coin.ts',
    'dexkit-ui/types/theme': '../dexkit-ui/types/theme.ts',
    'dexkit-ui/types/payments': '../dexkit-ui/types/payments.ts',
    'dexkit-ui/types/magic': '../dexkit-ui/types/magic.ts',
    'dexkit-ui/types/app': '../dexkit-ui/types/app.ts',
    'dexkit-ui/types/ai': '../dexkit-ui/types/ai/index.ts',
    'dexkit-ui/constants': '../dexkit-ui/constants/index.ts',
    'dexkit-ui/constants/enum': '../dexkit-ui/constants/enum.ts',
    'dexkit-ui/constants/api': '../dexkit-ui/constants/api.ts',
    'dexkit-ui/constants/messages/common': '../dexkit-ui/constants/messages/common.ts',
    'dexkit-ui/constants/userEventNames': '../dexkit-ui/constants/userEventNames.tsx',
    'dexkit-ui/constants/featPayments': '../dexkit-ui/constants/featPayments.ts',
    'dexkit-ui/providers/configWizardProvider': '../dexkit-ui/providers/configWizardProvider.tsx',
    'dexkit-ui/providers/authStateProvider': '../dexkit-ui/providers/authStateProvider.tsx',
    'dexkit-ui/providers/authProvider': '../dexkit-ui/providers/authProvider.tsx',
    'dexkit-ui/providers/ThirdwebV4Provider': '../dexkit-ui/providers/ThirdwebV4Provider.tsx',
    'dexkit-ui/providers/SiteProvider': '../dexkit-ui/providers/SiteProvider.tsx',
    'dexkit-ui/providers/DexkitProvider': '../dexkit-ui/providers/DexkitProvider.tsx',
    'dexkit-ui/theme': '../dexkit-ui/theme.ts',
    'dexkit-ui/context/AppConfigContext': '../dexkit-ui/context/AppConfigContext.tsx',
    'dexkit-ui/context/AdminContext': '../dexkit-ui/context/AdminContext.tsx',
    'dexkit-ui/context/AppWizardConfigContext': '../dexkit-ui/context/AppWizardConfigContext.ts',
    'dexkit-ui/context/AuthContext': '../dexkit-ui/context/AuthContext.tsx',
    'dexkit-ui/context/CompletationContext': '../dexkit-ui/context/CompletationContext.tsx',
    'dexkit-ui/context/GenerateImagesContext': '../dexkit-ui/context/GenerateImagesContext.tsx',
    'dexkit-ui/context/MagicStateContext': '../dexkit-ui/context/MagicStateContext.tsx',
    'dexkit-exchange/utils': '../dexkit-exchange/utils/index.ts',

    // @dexkit/exchange - modules
    'dexkit-exchange/index': '../dexkit-exchange/index.ts',
    'dexkit-exchange/atoms': '../dexkit-exchange/atoms.ts',
    'dexkit-exchange/hooks': '../dexkit-exchange/hooks/index.ts',
    'dexkit-exchange/hooks/zrx': '../dexkit-exchange/hooks/zrx.ts',
    'dexkit-exchange/hooks/zrx/useMarketTradeGaslessExec': '../dexkit-exchange/hooks/zrx/useMarketTradeGaslessExec.ts',
    'dexkit-exchange/hooks/zrx/useMarketTradeGaslessState': '../dexkit-exchange/hooks/zrx/useMarketTradeGaslessState.ts',
    'dexkit-exchange/hooks/zrx/useZrxCancelOrderMutation': '../dexkit-exchange/hooks/zrx/useZrxCancelOrderMutation.ts',
    'dexkit-exchange/types': '../dexkit-exchange/types/index.ts',
    'dexkit-exchange/services': '../dexkit-exchange/services/index.ts',
    'dexkit-exchange/constants': '../dexkit-exchange/constants/index.ts',
    'dexkit-exchange/constants/messages': '../dexkit-exchange/constants/messages.ts',
    'dexkit-exchange/constants/tokens': '../dexkit-exchange/constants/tokens.ts',
    'dexkit-exchange/constants/zrx': '../dexkit-exchange/constants/zrx.ts',
    'dexkit-exchange/contexts': '../dexkit-exchange/contexts/index.ts',
    'dexkit-exchange/components/dialogs/SelectPairDialog': '../dexkit-exchange/components/dialogs/SelectPairDialog.tsx',
    'dexkit-exchange/components/ExchangeSettingsForm': '../dexkit-exchange/components/ExchangeSettingsForm/index.tsx',
    'dexkit-exchange/components/ExchangeSettingsForm/ExchangeQuoteTokensInput': '../dexkit-exchange/components/ExchangeSettingsForm/ExchangeQuoteTokensInput.tsx',
    'dexkit-exchange/components/ExchangeSettingsForm/ExchangeSettingsFormActions': '../dexkit-exchange/components/ExchangeSettingsForm/ExchangeSettingsFormActions.tsx',
    'dexkit-exchange/components/ExchangeSettingsForm/ExchangeTokenInput': '../dexkit-exchange/components/ExchangeSettingsForm/ExchangeTokenInput.tsx',
    'dexkit-exchange/components/ExchangeSettingsForm/ExchangeTokensInput': '../dexkit-exchange/components/ExchangeSettingsForm/ExchangeTokensInput.tsx',
    'dexkit-exchange/components/ExchangeSettingsForm/SelectNetworksDialog': '../dexkit-exchange/components/ExchangeSettingsForm/SelectNetworksDialog.tsx',
    'dexkit-exchange/components/ExchangeSettingsForm/SelectTokensDialog': '../dexkit-exchange/components/ExchangeSettingsForm/SelectTokensDialog.tsx',
    'dexkit-exchange/components/ExchangeSettingsForm/SelectTokensDialogList': '../dexkit-exchange/components/ExchangeSettingsForm/SelectTokensDialogList.tsx',
    'dexkit-exchange/components/MinimalFocusExchange': '../dexkit-exchange/components/MinimalFocusExchange/index.tsx',
    'dexkit-exchange/components/MinimalFocusExchange/MinimalFocusSettings': '../dexkit-exchange/components/MinimalFocusExchange/MinimalFocusSettings.tsx',
    'dexkit-exchange/components/OrdersTable': '../dexkit-exchange/components/OrdersTable/index.tsx',
    'dexkit-exchange/components/OrdersTable/OrdersTableRow': '../dexkit-exchange/components/OrdersTable/OrdersTableRow.tsx',
    'dexkit-exchange/components/OrderWidget': '../dexkit-exchange/components/OrderWidget.tsx',
    'dexkit-exchange/components/PairButton': '../dexkit-exchange/components/PairButton/index.tsx',
    'dexkit-exchange/components/PairInfo': '../dexkit-exchange/components/PairInfo/index.tsx',
    'dexkit-exchange/components/SelectPairList': '../dexkit-exchange/components/SelectPairList.tsx',
    'dexkit-exchange/components/TradeWidget': '../dexkit-exchange/components/TradeWidget/index.tsx',
    'dexkit-exchange/components/TradeWidget/BuyForm': '../dexkit-exchange/components/TradeWidget/BuyForm.tsx',
    'dexkit-exchange/components/TradeWidget/DecimalInput': '../dexkit-exchange/components/TradeWidget/DecimalInput.tsx',
    'dexkit-exchange/components/TradeWidget/DurationSelect': '../dexkit-exchange/components/TradeWidget/DurationSelect.tsx',
    'dexkit-exchange/components/TradeWidget/LazyDecimalInput': '../dexkit-exchange/components/TradeWidget/LazyDecimalInput.tsx',
    'dexkit-exchange/components/TradeWidget/LimitForm': '../dexkit-exchange/components/TradeWidget/LimitForm.tsx',
    'dexkit-exchange/components/TradeWidget/MarketBuyForm': '../dexkit-exchange/components/TradeWidget/MarketBuyForm.tsx',
    'dexkit-exchange/components/TradeWidget/MarketSellForm': '../dexkit-exchange/components/TradeWidget/MarketSellForm.tsx',
    'dexkit-exchange/components/TradeWidget/ReviewMarketOrderDialog': '../dexkit-exchange/components/TradeWidget/ReviewMarketOrderDialog.tsx',
    'dexkit-exchange/components/TradeWidget/ReviewOrderDialog': '../dexkit-exchange/components/TradeWidget/ReviewOrderDialog.tsx',
    'dexkit-exchange/components/TradeWidget/SellForm': '../dexkit-exchange/components/TradeWidget/SellForm.tsx',
    'dexkit-exchange/components/TradeWidget/SimpleVariant': '../dexkit-exchange/components/TradeWidget/SimpleVariant/index.tsx',
    'dexkit-exchange/components/TradeWidget/SimpleVariant/MarketForm': '../dexkit-exchange/components/TradeWidget/SimpleVariant/MarketForm.tsx',
    'dexkit-exchange/components/TradeWidget/SimpleVariant/MarketFormSkeleton': '../dexkit-exchange/components/TradeWidget/SimpleVariant/MarketFormSkeleton.tsx',
    'dexkit-exchange/components/TradeWidget/TradeWidgetTab': '../dexkit-exchange/components/TradeWidget/TradeWidgetTab.tsx',
    'dexkit-exchange/components/TradeWidget/TradeWidgetTabAlt': '../dexkit-exchange/components/TradeWidget/TradeWidgetTabAlt.tsx',
    'dexkit-exchange/components/TradeWidget/TradeWidgetTabs': '../dexkit-exchange/components/TradeWidget/TradeWidgetTabs.tsx',
    'dexkit-exchange/components/TradingGraph': '../dexkit-exchange/components/TradingGraph/index.tsx',

    // @dexkit/wallet-connectors - modules
    'dexkit-wallet-connectors/index': '../dexkit-wallet-connectors/index.ts',
    'dexkit-wallet-connectors/atoms': '../dexkit-wallet-connectors/atoms.ts',
    'dexkit-wallet-connectors/hooks': '../dexkit-wallet-connectors/hooks/index.ts',
    'dexkit-wallet-connectors/hooks/wallet': '../dexkit-wallet-connectors/hooks/wallet.ts',
    'dexkit-wallet-connectors/hooks/useWeb3React': '../dexkit-wallet-connectors/hooks/useWeb3React.ts',
    'dexkit-wallet-connectors/connectors': '../dexkit-wallet-connectors/connectors/index.ts',
    'dexkit-wallet-connectors/connectors/connections': '../dexkit-wallet-connectors/connectors/connections.ts',
    'dexkit-wallet-connectors/connectors/magic': '../dexkit-wallet-connectors/connectors/magic.ts',
    'dexkit-wallet-connectors/providers': '../dexkit-wallet-connectors/providers/index.ts',
    'dexkit-wallet-connectors/utils': '../dexkit-wallet-connectors/utils/index.ts',
    'dexkit-wallet-connectors/utils/userAgent': '../dexkit-wallet-connectors/utils/userAgent.ts',
    'dexkit-wallet-connectors/utils/walletMeta': '../dexkit-wallet-connectors/utils/walletMeta.ts',
    'dexkit-wallet-connectors/types': '../dexkit-wallet-connectors/types/index.ts',
    'dexkit-wallet-connectors/services/zrx': '../dexkit-wallet-connectors/services/zrx/index.ts',
    'dexkit-wallet-connectors/services/zrx/types': '../dexkit-wallet-connectors/services/zrx/types.ts',
    'dexkit-wallet-connectors/services/zrx/constants': '../dexkit-wallet-connectors/services/zrx/constants.ts',
    'dexkit-wallet-connectors/constants/icons': '../dexkit-wallet-connectors/constants/icons.ts',
    'dexkit-wallet-connectors/constants/magic': '../dexkit-wallet-connectors/constants/magic.ts',
    'dexkit-wallet-connectors/constants/wagmiConfig': '../dexkit-wallet-connectors/constants/wagmiConfig.ts',
    'dexkit-wallet-connectors/constants/zrx': '../dexkit-wallet-connectors/constants/zrx.ts',
    'dexkit-wallet-connectors/constants/connectors/utils': '../dexkit-wallet-connectors/constants/connectors/utils.ts',
    'dexkit-wallet-connectors/constants/connectors/eip6963/types': '../dexkit-wallet-connectors/constants/connectors/eip6963/types.ts',
    'dexkit-wallet-connectors/thirdweb/client': '../dexkit-wallet-connectors/thirdweb/client.ts',

    // @dexkit/widgets - modules
    'dexkit-widgets/index': '../dexkit-widgets/src/index.tsx',
    'dexkit-widgets/src/widgets/swap': '../dexkit-widgets/src/widgets/swap/index.tsx',
    'dexkit-widgets/hooks': '../dexkit-widgets/src/hooks/index.ts',
    'dexkit-widgets/src/hooks': '../dexkit-widgets/src/hooks/index.ts',
    'dexkit-widgets/types': '../dexkit-widgets/src/types/index.ts',
    'dexkit-widgets/utils': '../dexkit-widgets/src/utils/index.ts',
    'dexkit-widgets/services': '../dexkit-widgets/src/services/index.ts',
    'dexkit-widgets/constants': '../dexkit-widgets/src/constants/index.ts',
    'dexkit-widgets/state': '../dexkit-widgets/src/state/atoms/index.ts',
    'dexkit-widgets/widgets/swap': '../dexkit-widgets/src/widgets/swap/index.tsx',
    'dexkit-widgets/widgets/evm-receive-coin': '../dexkit-widgets/src/widgets/evm-receive-coin/index.tsx',
    'dexkit-widgets/widgets/evm-transfer-coin': '../dexkit-widgets/src/widgets/evm-transfer-coin/index.tsx',
    'dexkit-widgets/widgets/evm-transfer-nft': '../dexkit-widgets/src/widgets/evm-transfer-nft/index.tsx',

    // @dexkit/unlock-widget
    'dexkit-unlock-widget/index': '../dexkit-unlock/src/index.tsx',

    // @dexkit/web3forms - modules
    'dexkit-web3forms/index': '../web3forms/index.ts',
    'dexkit-web3forms/hooks': '../web3forms/hooks/index.ts',
    'dexkit-web3forms/types': '../web3forms/types/index.ts',
    'dexkit-web3forms/services': '../web3forms/services/index.ts',
    'dexkit-web3forms/components/ContractFormView': '../web3forms/components/ContractFormView.tsx',
    'dexkit-web3forms/utils': '../web3forms/utils/index.ts',
    'dexkit-web3forms/constants': '../web3forms/constants/index.ts',

    // @dexkit/dexappbuilder-viewer - modules
    'dexappbuilder-viewer/index': '../dexappbuilder-viewer/index.tsx',
    'dexappbuilder-viewer/hooks': '../dexappbuilder-viewer/hooks/index.ts',
    'dexappbuilder-viewer/types': '../dexappbuilder-viewer/types/index.ts',
    'dexappbuilder-viewer/utils': '../dexappbuilder-viewer/utils/intl.ts',
    'dexappbuilder-viewer/utils/intl': '../dexappbuilder-viewer/utils/intl.ts',
    'dexappbuilder-viewer/themes': '../dexappbuilder-viewer/themes/index.ts',
    'dexappbuilder-viewer/themes/index': '../dexappbuilder-viewer/themes/index.ts',
    'dexappbuilder-viewer/themes/theme': '../dexappbuilder-viewer/themes/theme.ts',
    'dexappbuilder-viewer/themes/boredape': '../dexappbuilder-viewer/themes/boredape.ts',
    'dexappbuilder-viewer/themes/cryptopunk': '../dexappbuilder-viewer/themes/cryptopunk.ts',
    'dexappbuilder-viewer/themes/custom': '../dexappbuilder-viewer/themes/custom.ts',
    'dexappbuilder-viewer/themes/kittygotchi': '../dexappbuilder-viewer/themes/kittygotchi.ts',
    'dexappbuilder-viewer/constants': '../dexappbuilder-viewer/constants/index.ts',
    'dexappbuilder-viewer/constants/section': '../dexappbuilder-viewer/constants/section.ts',
    'dexappbuilder-viewer/state': '../dexappbuilder-viewer/state/atoms.ts',
    'dexappbuilder-viewer/state/atoms': '../dexappbuilder-viewer/state/atoms.ts',
    'dexappbuilder-viewer/state/app': '../dexappbuilder-viewer/state/app.ts',
    'dexappbuilder-viewer/state/blockchain': '../dexappbuilder-viewer/state/blockchain.ts',
    'dexappbuilder-viewer/components/SectionRender': '../dexappbuilder-viewer/components/SectionRender.tsx',
    'dexappbuilder-viewer/components/SectionsRenderer': '../dexappbuilder-viewer/components/SectionsRenderer.tsx',
    'dexappbuilder-viewer/components/ProtectedContent': '../dexappbuilder-viewer/components/ProtectedContent.tsx',
    'dexappbuilder-viewer/components/WidgetProvider': '../dexappbuilder-viewer/components/WidgetProvider.tsx',
    'dexappbuilder-viewer/components/NFTGrid': '../dexappbuilder-viewer/components/NFTGrid.tsx',
    'dexappbuilder-viewer/components/NftDropSummary': '../dexappbuilder-viewer/components/NftDropSummary.tsx',
  },
  platform: 'browser',
  dts: false,
  format: ['esm'],
  outDir: 'dist',
  noExternal: [/^@dexkit\/.*/],
  target: 'es2022',
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
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'react-query',
    '@tanstack/react-query',
    'ethers',
    '@indexed-finance/multicall',
    'react-qr-code',
    'react-lazy-with-preload',
    '@react-page/editor',
    'slate-react-presentation',
    '@0x/utils',
    '@0x/protocol-utils',
    'html-react-parser',
    'react-swipeable-views',
    'react-swipeable-views-utils',
    '@base-org/account',
    '@web3-react/core',
    'form-data',
    'isomorphic-unfetch',
    'isomorphic-fetch',
    '@thirdweb-dev/wallets',
    '@thirdweb-dev/react',
    /^@thirdweb-dev\/.*/,
    '@uiw/react-md-editor',
    '@uiw/react-markdown-preview',
    'rehype-prism-plus',
    'decode-named-character-reference',
    'axios',
  ],
  esbuildOptions(options) {
    options.alias = {
      'react/jsx-runtime.js': 'react/jsx-runtime',
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
    };

    options.plugins = options.plugins || [];
    options.plugins.push({
      name: 'fix-react-jsx-runtime-imports',
      setup(build) {
        build.onLoad({ filter: /\.(ts|tsx|js|jsx)$/ }, async (args) => {
          try {
            const contents = readFileSync(args.path, 'utf8');
            const modified = contents
              .replace(/from\s+["']react\/jsx-runtime\.js["']/g, 'from "react/jsx-runtime"')
              .replace(/from\s+["']react\/jsx-dev-runtime\.js["']/g, 'from "react/jsx-dev-runtime"')
              .replace(/["']react\/jsx-runtime\.js["']/g, '"react/jsx-runtime"')
              .replace(/["']react\/jsx-dev-runtime\.js["']/g, '"react/jsx-dev-runtime"');

            if (modified !== contents) {
              return {
                contents: modified,
                loader: args.path.endsWith('.tsx') ? 'tsx' : args.path.endsWith('.ts') ? 'ts' : 'js',
              };
            }
          } catch (error) {
          }
        });
      },
    });
    options.plugins.push({
      name: 'fix-compiled-lang-imports',
      setup(build) {
        build.onLoad({ filter: /\.ts$/ }, async (args) => {
          if (args.path.includes('dexkit-ui/services/i18n')) {
            const contents = readFileSync(args.path, 'utf8');
            const modified = contents.replace(
              /import\(`\.\.\/constants\/compiled-lang\/([^`]+)`\)/g,
              "import(`./dexkit-ui/constants/compiled-lang/$1`)"
            );
            return {
              contents: modified,
              loader: 'ts',
            };
          }
        });
      },
    });
  },
  replaceNodeEnv: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  onSuccess: async () => {
    const jsonFiles = [
      '../dexkit-ui/config/app.minimal.json',
      '../dexkit-ui/config/app.json',
      '../dexkit-ui/config/app.boredape.json',
      '../dexkit-ui/config/app.cryptopunks.json',
      '../dexkit-ui/config/app.kittygotchi.json',
      '../dexkit-ui/config/app.mutantboredape.json',
      '../dexkit-ui/config/widget.json',
    ];

    const compiledLangFiles = [
      '../dexkit-ui/constants/compiled-lang/cs-CZ.json',
      '../dexkit-ui/constants/compiled-lang/de-DE.json',
      '../dexkit-ui/constants/compiled-lang/en-US.json',
      '../dexkit-ui/constants/compiled-lang/es-ES.json',
      '../dexkit-ui/constants/compiled-lang/fr-FR.json',
      '../dexkit-ui/constants/compiled-lang/it-IT.json',
      '../dexkit-ui/constants/compiled-lang/nn-NO.json',
      '../dexkit-ui/constants/compiled-lang/pt-BR.json',
    ];

    const distDir = join(process.cwd(), 'dist');

    for (const jsonFile of jsonFiles) {
      try {
        const sourcePath = join(process.cwd(), jsonFile);
        const fileName = jsonFile.split('/').pop()!;
        const targetDir = join(distDir, 'dexkit-ui', 'config');
        const targetPath = join(targetDir, fileName);

        mkdirSync(targetDir, { recursive: true });

        copyFileSync(sourcePath, targetPath);
        console.log(`✓ Copied ${fileName} to ${targetPath}`);
      } catch (error) {
        console.warn(`⚠ Could not copy ${jsonFile}:`, error);
      }
    }

    for (const jsonFile of compiledLangFiles) {
      try {
        const sourcePath = join(process.cwd(), jsonFile);
        const fileName = jsonFile.split('/').pop()!;
        const targetDir = join(distDir, 'dexkit-ui', 'constants', 'compiled-lang');
        const targetPath = join(targetDir, fileName);

        mkdirSync(targetDir, { recursive: true });

        copyFileSync(sourcePath, targetPath);
        console.log(`✓ Copied ${fileName} to ${targetPath}`);
      } catch (error) {
        console.warn(`⚠ Could not copy ${jsonFile}:`, error);
      }
    }

    console.log('⧖ Fixing react/jsx-runtime imports...');
    const fixJsxRuntimeImports = (dir: string) => {
      const files = readdirSync(dir);
      for (const file of files) {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
          fixJsxRuntimeImports(filePath);
        } else if (file.endsWith('.js')) {
          try {
            let content = readFileSync(filePath, 'utf8');
            const originalContent = content;
            content = content.replace(/react\/jsx-runtime\.js/g, 'react/jsx-runtime');
            content = content.replace(/react\/jsx-dev-runtime\.js/g, 'react/jsx-dev-runtime');
            if (content !== originalContent) {
              writeFileSync(filePath, content, 'utf8');
              console.log(`✓ Fixed react/jsx-runtime imports in ${filePath}`);
            }
          } catch (error) {
          }
        }
      }
    };
    fixJsxRuntimeImports(distDir);
  },
});

