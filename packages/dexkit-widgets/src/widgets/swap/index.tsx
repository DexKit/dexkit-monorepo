import Swap from "./Swap";

import {
  ChainId,
  DKAPI_INVALID_ADDRESSES,
  GET_NATIVE_TOKEN,
} from "@dexkit/core/constants";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";

import dynamic from "next/dynamic";
import { usePlatformCoinSearch } from "../../hooks/api";
import { apiCoinToTokens } from "../../utils/api";
const SwapSettingsDialog = dynamic(
  () => import("@dexkit/ui/modules/swap/components/dialogs/SwapSettingsDialog")
);
const SwapConfirmDialog = dynamic(() => import("./dialogs/SwapConfirmDialog"));

// declare global {
//   function renderSwapWidget(id: string, options: RenderOptions): void;
// }
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import { useUserGaslessSettings } from "@dexkit/ui/modules/swap/hooks/useUserGaslessSettings";
import SwitchNetworkDialog from "../../components/SwitchNetworkDialog";
import { SUPPORTED_GASLESS_CHAIN } from "../../constants";
import SwapSelectCoinDialog from "./SwapSelectCoinDialog";
import { SUPPORTED_SWAP_CHAIN_IDS } from "./constants/supportedChainIds";
import { useErc20ApproveMutation } from "./hooks";
import { useSwapExec } from "./hooks/useSwapExec";
import { useSwapGaslessExec } from "./hooks/useSwapGaslessExec";
import { useSwapProvider } from "./hooks/useSwapProvider";
import { useSwapState } from "./hooks/useSwapState";
import { NotificationCallbackParams, RenderOptions } from "./types";
import { convertOldTokenToNew } from "./utils";

export interface SwapWidgetProps {
  renderOptions: RenderOptions;
  activeChainIds: number[];
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
  activeChainIds,
}: SwapWidgetProps) {
  const {
    provider,
    connector,
    account,
    isActive,
    isActivating,
    chainId: connectedChainId,
  } = useWeb3React();

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
    nonFeaturedTokens,
    useGasless,
    myTokensOnlyOnSearch,
  } = options;

  const execSwapMutation = useSwapExec({ onNotification });

  const execSwapGaslessMutation = useSwapGaslessExec({
    zeroExApiKey,
  });

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

  const [userGasless] = useUserGaslessSettings();

  const isGasless = useMemo(() => {
    if (selectedChainId) {
      return SUPPORTED_GASLESS_CHAIN.includes(selectedChainId) &&
        userGasless !== undefined
        ? userGasless
        : useGasless;
    }
  }, [selectedChainId, useGasless, userGasless]);

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
    clickOnMax,
    buyAmount,
    execType,
    isExecuting,
    quote,
    quoteQuery,
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
    isLoadingSignGasless,
    gaslessSwapState,
    execSwapState,
  } = useSwapState({
    execGaslessMutation: execSwapGaslessMutation,
    zeroExApiKey,
    isGasless: isGasless,
    selectedChainId,
    connectedChainId,
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
        ? convertOldTokenToNew(configsByChain[selectedChainId].buyToken)
        : undefined,
    defaultSellToken:
      selectedChainId && configsByChain[selectedChainId]
        ? convertOldTokenToNew(configsByChain[selectedChainId].sellToken)
        : undefined,
  });

  const [query, setQuery] = useState("");

  const searchQuery = usePlatformCoinSearch({
    keyword: query,
    network: chainId && NETWORKS[chainId] ? NETWORKS[chainId].slug : undefined,
    disable: myTokensOnlyOnSearch,
  });

  const featuredTokensByChain = useMemo(() => {
    return (featuredTokens
      ?.filter((t) => t.chainId === selectedChainId)
      .map(convertOldTokenToNew) || []) as Token[];
  }, [featuredTokens, selectedChainId]);

  const nonFeaturedTokensByChain = useMemo(() => {
    return (nonFeaturedTokens
      ?.filter((t) => t.chainId === selectedChainId)
      .map(convertOldTokenToNew) || []) as Token[];
  }, [nonFeaturedTokens, selectedChainId]);

  const tokens = useMemo(() => {
    if (chainId) {
      if (myTokensOnlyOnSearch) {
        let tokens = [GET_NATIVE_TOKEN(chainId)];
        tokens = [
          GET_NATIVE_TOKEN(chainId),
          ...featuredTokensByChain,
          ...nonFeaturedTokensByChain,
        ];

        return tokens;
      } else {
        if (searchQuery.data) {
          let tokens = [
            GET_NATIVE_TOKEN(chainId),
            ...apiCoinToTokens(searchQuery.data),
          ];

          tokens = [
            GET_NATIVE_TOKEN(chainId),
            ...featuredTokensByChain,
            ...nonFeaturedTokensByChain,
            ...apiCoinToTokens(searchQuery.data),
          ];

          if (query !== "") {
            tokens = tokens.filter(
              (c) =>
                c.name.toLowerCase().search(query?.toLowerCase()) > -1 ||
                c.symbol.toLowerCase().search(query?.toLowerCase()) > -1 ||
                c.address.toLowerCase().search(query?.toLowerCase()) > -1
            );
          }

          let tokensCopy = [
            ...tokens
              .filter((t) => t)
              .filter((t) => {
                return !DKAPI_INVALID_ADDRESSES.includes(t?.address);
              }),
          ];

          tokensCopy = tokensCopy.filter((value, index, arr) => {
            return (
              arr
                .map((a) => a.address.toLowerCase())
                .indexOf(value.address.toLowerCase()) === index
            );
          });

          return tokensCopy;
        }
      }
    }

    return [];
  }, [searchQuery.data, chainId, query]);

  const handleQueryChange = (value: string) => setQuery(value);

  const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);

  const handleToggleSwitchNetwork = () => {
    setShowSwitchNetwork((value) => !value);
  };

  const filteredChainIds = useMemo(() => {
    return activeChainIds.filter((k) => SUPPORTED_SWAP_CHAIN_IDS.includes(k));
  }, [activeChainIds]);

  return (
    <>
      {chainId && (
        <SwapSelectCoinDialog
          tokens={tokens}
          recentTokens={recentTokens
            ?.map((t) => convertOldTokenToNew(t) as Token)
            .filter((t) => t.chainId === chainId)}
          onQueryChange={handleQueryChange}
          onSelect={handleSelectToken}
          DialogProps={{
            open: showSelect,
            maxWidth: "sm",
            fullWidth: true,
            onClose: handleCloseSelectToken,
          }}
          isLoadingSearch={searchQuery.isLoading}
          chainId={selectedChainId}
          account={account}
          provider={swapProvider}
          featuredTokens={featuredTokensByChain}
          onClearRecentTokens={handleClearRecentTokens}
        />
      )}
      <SwitchNetworkDialog
        onChangeNetwork={handleChangeNetwork}
        activeChainIds={filteredChainIds}
        DialogProps={{
          open: showSwitchNetwork,
          maxWidth: "xs",
          fullWidth: true,
          onClose: handleToggleSwitchNetwork,
        }}
        chainId={chainId}
      />
      {showConfirmSwap && (
        <SwapConfirmDialog
          DialogProps={{
            open: showConfirmSwap,
            maxWidth: "xs",
            fullWidth: true,
            onClose: handleCloseConfirmSwap,
          }}
          quote={quote}
          isQuoting={isQuoting}
          isApproving={approveMutation.isLoading}
          isLoadingSignGasless={isLoadingSignGasless}
          isLoadingStatusGasless={gaslessSwapState.isLoadingStatusGasless}
          reasonFailedGasless={gaslessSwapState.reasonFailedGasless}
          successTxGasless={gaslessSwapState.successTxGasless}
          confirmedTxGasless={gaslessSwapState.confirmedTxGasless}
          onConfirm={handleConfirmExecSwap}
          execSwapState={execSwapState}
          execType={execType}
          chainId={chainId}
          currency={currency || "usd"}
          sellToken={sellToken}
          buyToken={buyToken}
        />
      )}
      {showSettings && (
        <SwapSettingsDialog
          DialogProps={{
            open: showSettings,
            maxWidth: "xs",
            fullWidth: true,
            onClose: handleCloseSettings,
          }}
          useGasless={useGasless}
          onAutoSlippage={onAutoSlippage}
          onChangeSlippage={onChangeSlippage}
          maxSlippage={maxSlippage}
          isAutoSlippage={isAutoSlippage}
        />
      )}
      <Swap
        currency={currency}
        disableNotificationsButton={disableNotificationsButton}
        chainId={chainId}
        activeChainIds={filteredChainIds}
        quoteFor={quoteFor}
        quoteQuery={quoteQuery}
        clickOnMax={clickOnMax}
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
