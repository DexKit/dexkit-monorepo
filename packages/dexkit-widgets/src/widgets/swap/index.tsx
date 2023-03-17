import Swap from "./Swap";

import { DKAPI_INVALID_ADDRESSES } from "@dexkit/core/constants";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { GET_NATIVE_TOKEN } from "../../constants";
import { ChainId } from "../../constants/enum";
import { NETWORKS } from "../../constants/networks";
import { usePlatformCoinSearch } from "../../hooks/api";
import { apiCoinToTokens } from "../../utils/api";
import SwapConfirmDialog from "./dialogs/SwapConfirmDialog";
import SwapSettingsDialog from "./dialogs/SwapSettingsDialog";

// declare global {
//   function renderSwapWidget(id: string, options: RenderOptions): void;
// }

import SwitchNetworkDialog from "../../components/SwitchNetworkDialog";
import {
  useErc20ApproveMutation,
  useSwapExec,
  useSwapProvider,
  useSwapState,
} from "./hooks";
import SwapSelectCoinDialog from "./SwapSelectCoinDialog";
import { NotificationCallbackParams, RenderOptions } from "./types";

export interface SwapWidgetProps {
  renderOptions: RenderOptions;
  onNotification: ({
    title,
    hash,
    chainId,
  }: NotificationCallbackParams) => void;
  disableWallet?: boolean;
  onConnectWallet: () => void;
  onShowTransactions: () => void;
  maxSlippage: number;
  isAutoSlippage: boolean;
  onChangeSlippage: (value: number) => void;
  onAutoSlippage: (value: boolean) => void;
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
}

export function SwapWidget({
  disableWallet,
  swapFees,
  renderOptions: options,
  onNotification,
  onConnectWallet,
  onShowTransactions,
  maxSlippage,
  isAutoSlippage,
  onChangeSlippage,
  onAutoSlippage,
}: SwapWidgetProps) {
  const { provider, connector, account, isActive, isActivating } =
    useWeb3React();

  const {
    configsByChain,
    defaultChainId,
    disableNotificationsButton,
    transakApiKey,
    currency,
    disableFooter,
    enableBuyCryptoButton,
    zeroExApiKey,
    featuredTokens,
  } = options;

  const execSwapMutation = useSwapExec({ onNotification });

  const [selectedChainId, setSelectedChainId] = useState<ChainId>();

  useEffect(() => {
    if (defaultChainId) {
      setSelectedChainId(defaultChainId);
    }
  }, [defaultChainId]);

  const swapProvider = useSwapProvider({
    defaultChainId: selectedChainId,
    disableWallet,
  });

  const approveMutation = useErc20ApproveMutation({ onNotification });

  const handleChangeSelectedNetwork = (chainId: ChainId) => {
    setSelectedChainId(chainId);
  };

  const {
    chainId,
    buyToken,
    sellToken,
    showSelect,
    sellAmount,
    buyAmount,
    execType,
    isExecuting,
    quote,
    buyTokenBalance,
    sellTokenBalance,
    insufficientBalance,
    showConfirmSwap,
    showSettings,
    isQuoting,
    isProviderReady,
    recentTokens,
    quoteFor,
    handleConnectWallet,
    handleOpenSelectToken,
    handleSwapTokens,
    handleSelectToken,
    handleChangeSellAmount,
    handleChangeBuyAmount,
    handleExecSwap,
    handleConfirmExecSwap,
    handleCloseSelectToken,
    handleCloseConfirmSwap,
    handleChangeNetwork,
    handleShowSettings,
    handleCloseSettings,
    handleShowTransactions,
    handleClearRecentTokens,
    handleShowTransak,
  } = useSwapState({
    zeroExApiKey,
    execMutation: execSwapMutation,
    approveMutation,
    provider: swapProvider,
    connectorProvider: provider,
    onChangeNetwork: handleChangeSelectedNetwork,
    onNotification,
    onConnectWallet,
    onShowTransactions,
    connector,
    account,
    swapFees,
    isActive: isActive && !disableWallet,
    isActivating,
    maxSlippage,
    isAutoSlippage,
    transakApiKey,
    defaultBuyToken:
      selectedChainId && configsByChain[selectedChainId]
        ? configsByChain[selectedChainId].buyToken
        : undefined,
    defaultSellToken:
      selectedChainId && configsByChain[selectedChainId]
        ? configsByChain[selectedChainId].sellToken
        : undefined,
  });

  const [query, setQuery] = useState("");

  const searchQuery = usePlatformCoinSearch({
    keyword: query,
    network: chainId && NETWORKS[chainId] ? NETWORKS[chainId].slug : undefined,
  });

  const tokens = useMemo(() => {
    if (searchQuery.data && chainId) {
      let tokens = [
        GET_NATIVE_TOKEN(chainId),
        ...apiCoinToTokens(searchQuery.data),
      ];

      if (query !== "") {
        tokens = tokens.filter(
          (c) =>
            c.name.toLowerCase().search(query?.toLowerCase()) > -1 ||
            c.symbol.toLowerCase().search(query?.toLowerCase()) > -1 ||
            c.contractAddress.toLowerCase().search(query?.toLowerCase()) > -1
        );
      }

      let tokensCopy = [
        ...tokens.filter((t) => {
          return !DKAPI_INVALID_ADDRESSES.includes(t.contractAddress);
        }),
      ];

      return tokensCopy;
    }

    return [];
  }, [searchQuery.data, chainId, query]);

  const handleQueryChange = (value: string) => setQuery(value);

  const featuredTokensByChain = useMemo(() => {
    return featuredTokens?.filter((t) => t.chainId === selectedChainId);
  }, [featuredTokens, selectedChainId]);

  const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);

  const handleToggleSwitchNetwork = () => {
    setShowSwitchNetwork((value) => !value);
  };

  return (
    <>
      {chainId && (
        <SwapSelectCoinDialog
          tokens={tokens}
          recentTokens={recentTokens?.filter((t) => t.chainId === chainId)}
          onQueryChange={handleQueryChange}
          onSelect={handleSelectToken}
          DialogProps={{
            open: showSelect,
            maxWidth: "sm",
            fullWidth: true,
            onClose: handleCloseSelectToken,
          }}
          account={account}
          provider={swapProvider}
          featuredTokens={featuredTokensByChain}
          onClearRecentTokens={handleClearRecentTokens}
        />
      )}
      <SwitchNetworkDialog
        onChangeNetwork={handleChangeNetwork}
        DialogProps={{
          open: showSwitchNetwork,
          maxWidth: "xs",
          fullWidth: true,
          onClose: handleToggleSwitchNetwork,
        }}
        chainId={chainId}
      />
      <SwapConfirmDialog
        DialogProps={{
          open: showConfirmSwap,
          maxWidth: "xs",
          fullWidth: true,
          onClose: handleCloseConfirmSwap,
        }}
        quote={quote}
        isQuoting={isQuoting}
        onConfirm={handleConfirmExecSwap}
        chainId={chainId}
        currency={currency || "usd"}
        sellToken={sellToken}
        buyToken={buyToken}
      />
      <SwapSettingsDialog
        DialogProps={{
          open: showSettings,
          maxWidth: "xs",
          fullWidth: true,
          onClose: handleCloseSettings,
        }}
        onAutoSlippage={onAutoSlippage}
        onChangeSlippage={onChangeSlippage}
        maxSlippage={maxSlippage}
        isAutoSlippage={isAutoSlippage}
      />
      <Swap
        currency={currency}
        disableNotificationsButton={disableNotificationsButton}
        chainId={chainId}
        quoteFor={quoteFor}
        isActive={isActive && !disableWallet}
        buyToken={buyToken}
        sellToken={sellToken}
        onSelectToken={handleOpenSelectToken}
        onSwapTokens={handleSwapTokens}
        onConnectWallet={handleConnectWallet}
        sellAmount={sellAmount}
        buyAmount={buyAmount}
        networkName={
          chainId && NETWORKS[chainId] ? NETWORKS[chainId].name : undefined
        }
        onToggleChangeNetwork={handleToggleSwitchNetwork}
        onChangeBuyAmount={handleChangeBuyAmount}
        onChangeSellAmount={handleChangeSellAmount}
        onExec={handleExecSwap}
        execType={execType}
        isExecuting={isExecuting}
        quote={quote}
        isQuoting={isQuoting}
        provider={provider}
        isProviderReady={isProviderReady}
        sellTokenBalance={sellTokenBalance}
        insufficientBalance={insufficientBalance}
        buyTokenBalance={buyTokenBalance}
        onChangeNetwork={handleChangeNetwork}
        onShowSettings={handleShowSettings}
        onShowTransactions={handleShowTransactions}
        onShowTransak={transakApiKey ? handleShowTransak : undefined}
        disableFooter={disableFooter}
        enableBuyCryptoButton={enableBuyCryptoButton}
      />
    </>
  );
}

// globalThis.renderSwapWidget = function renderSwapWidget(
//   id: string,
//   options: RenderOptions
// ) {
//   const container = document.getElementById(id);

//   const root = createRoot(container!); // createRoot(container!) if you use TypeScript

//   root.render(
//     <DexkitContextProvider>
//       {({
//         handleNotification,
//         handleConnectWallet,
//         handleShowTransactions,
//       }) => (
//         <SwapWidget
//           renderOptions={options}
//           onNotification={handleNotification}
//           onConnectWallet={handleConnectWallet}
//           onShowTransactions={handleShowTransactions}
//         />
//       )}
//     </DexkitContextProvider>
//   );
// };
