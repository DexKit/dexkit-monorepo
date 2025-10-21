import {
  ChainId,
  DKAPI_INVALID_ADDRESSES,
  GET_NATIVE_TOKEN,
} from "@dexkit/core/constants";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useCallback, useEffect, useMemo, useState } from "react";

import dynamic from "next/dynamic";
import { usePlatformCoinSearch } from "../../hooks/api";
import { apiCoinToTokens } from "../../utils/api";
const SwapSettingsDialog = dynamic(
  () => import("@dexkit/ui/modules/swap/components/dialogs/SwapSettingsDialog")
);
const SwapSettingsGlassDialog = dynamic(
  () => import("./glass/SwapSettingsGlassDialog")
);
const SwapConfirmDialog = dynamic(() => import("./dialogs/SwapConfirmDialog"));

import { NETWORKS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import { useUserGaslessSettings } from "@dexkit/ui/modules/swap/hooks/useUserGaslessSettings";
import SwitchNetworkDialog from "../../components/SwitchNetworkDialog";
import { SUPPORTED_GASLESS_CHAIN } from "../../constants";
import { useSwapProvider } from "./hooks/useSwapProvider";
import { useSwapState } from "./hooks/useSwapState";
import { NotificationCallbackParams, RenderOptions } from "./types";

import SwapConfirmMatchaDialog from "./matcha/SwapConfirmMatchaDialog";

import { parseChainId } from "@dexkit/core/utils";
import { useCanGasless } from "@dexkit/ui/modules/swap/hooks";
import { useGaslessTrades } from "@dexkit/ui/modules/swap/hooks/useGaslessTrades";
import { SwapVariant } from "@dexkit/ui/modules/wizard/types";
import SwapCompact from "./compact/SwapCompact";
import { SUPPORTED_SWAP_CHAIN_IDS } from "./constants/supportedChainIds";
import ExternTokenWarningDialog from "./ExternTokenWarningDialog";
import SwapGlass from "./glass/SwapGlass";
import SwapSelectCoinGlassDialog from "./glass/SwapSelectCoinGlassDialog";
import SwapMatcha from "./matcha/SwapMatcha";
import SwapSelectCoinMatchaDialog from "./matcha/SwapSelectCoinMatchaDialog";
import SwapMinimal from "./minimal/SwapMinimal";
import SwapMobile from "./mobile/SwapMobile";
import Swap from "./Swap";
import SwapSelectCoinDialog from "./SwapSelectCoinDialog";
import SwapConfirmUniswapDialog from "./uniswap/SwapConfirmUniswapDialog";
import SwapSelectCoinUniswapDialog from "./uniswap/SwapSelectCoinUniswapDialog";
import SwapUniswap from "./uniswap/SwapUniswap";
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
    signer,
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
    enableUrlParams,
    enableImportExterTokens,
    currency,
    disableFooter,
    enableBuyCryptoButton,
    zeroExApiKey,
    featuredTokens,
    nonFeaturedTokens,
    useGasless,
    myTokensOnlyOnSearch,
    variant,
    disableNetworkChange,
    disableNetworkSelector,
    keepTokenAlwaysPresent,
    lockedToken,
  } = options;

  const [selectedChainId, setSelectedChainId] = useState<ChainId>();
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [selectedToken, setSelecteToken] = useState<Token>();

  useEffect(() => {
    if (defaultChainId) {
      setSelectedChainId(defaultChainId);
    }
  }, [defaultChainId]);

  const swapProvider = useSwapProvider({
    defaultChainId: selectedChainId,
    disableWallet,
  });

  const selectedProvider =
    connectedChainId === selectedChainId ? provider : swapProvider;

  const [userGasless] = useUserGaslessSettings();

  const isGasless = useMemo(() => {
    if (selectedChainId) {
      return SUPPORTED_GASLESS_CHAIN.includes(selectedChainId) &&
        userGasless !== undefined
        ? userGasless
        : useGasless;
    }
  }, [selectedChainId, useGasless, userGasless]);

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
    quoteQueryPrice,
    quoteQuery,
    buyTokenBalance,
    sellTokenBalance,
    insufficientBalance,
    showConfirmSwap,
    setShowConfirmSwap,
    showSettings,
    isQuoting,
    isProviderReady,
    recentTokens,
    quoteFor,
    handleOpenSelectToken,
    handleSwapTokens,
    handleSelectToken: handleSelectTokenState,
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
    zeroExApiKey,
    isGasless: isGasless,
    selectedChainId,
    connectedChainId,
    provider: selectedProvider,
    signer,
    onChangeNetwork: handleChangeSelectedNetwork,
    onNotification,
    onShowTransactions,
    onConnectWallet,
    account,
    swapFees,
    isActive: isActive && !disableWallet,
    isActivating,
    maxSlippage,
    isAutoSlippage,
    transakApiKey,
    currency,
    variant,
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
  const [gaslessTrades] = useGaslessTrades();
  const canGasless = useCanGasless({
    enabled: !!isGasless && !!userGasless,
    buyToken: buyToken!,
    sellToken: sellToken!,
    side: quoteFor!,
    chainId: chainId!,
  });
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
        let tokens = [
          GET_NATIVE_TOKEN(chainId),
          ...featuredTokensByChain,
          ...nonFeaturedTokensByChain,
        ];

        if (searchQuery.data) {
          tokens = [
            ...tokens,
            ...apiCoinToTokens(searchQuery.data),
          ];
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

    return [];
  }, [searchQuery.data, chainId, query, featuredTokensByChain, nonFeaturedTokensByChain, myTokensOnlyOnSearch]);

  const handleQueryChange = (value: string) => setQuery(value);

  const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);

  const handleToggleSwitchNetwork = () => {
    setShowSwitchNetwork((value) => !value);
  };

  const handleSelectToken = (token: Token, isExtern?: boolean) => {
    if (isExtern) {
      setShowWarningDialog(true);
      setSelecteToken(token);
      return;
    }

    handleSelectTokenState(token);
  };

  const handleSetToken = (token?: Token) => {
    if (token) {
      handleSelectToken(token);
    }
  };

  const handleOpenSelectTokenCustom = (selectFor: any, token?: Token) => {
    if (keepTokenAlwaysPresent && lockedToken) {
      const isBuyTokenLocked = buyToken?.address?.toLowerCase() === lockedToken.address?.toLowerCase();
      const isSellTokenLocked = sellToken?.address?.toLowerCase() === lockedToken.address?.toLowerCase();

      if ((selectFor === "buy" && isBuyTokenLocked) || (selectFor === "sell" && isSellTokenLocked)) {
        return;
      }
    }

    handleOpenSelectToken(selectFor, token);
  };

  const handleToggleSwitchNetworkCustom = () => {
    if (disableNetworkSelector) {
      return;
    }

    if (disableNetworkChange) {
      return;
    }

    handleToggleSwitchNetwork();
  };

  const handleChangeNetworkCustom = (chainId: any) => {
    if (disableNetworkChange) {
      return;
    }

    handleChangeNetwork(chainId);
  };

  const handleSwapTokensCustom = () => {
    if (keepTokenAlwaysPresent && lockedToken) {
      handleSwapTokens();
    } else {
      handleSwapTokens();
    }
  };

  const handleConfirmSwap = useCallback(async () => {
    await handleConfirmExecSwap.mutateAsync();
    !canGasless && handleCloseConfirmSwap();
  }, [handleConfirmExecSwap, canGasless, handleCloseConfirmSwap]);

  const filteredChainIds = useMemo(() => {
    return Object.keys(NETWORKS)
      .filter((k) => activeChainIds.includes(Number(k)))
      .filter((k) => SUPPORTED_SWAP_CHAIN_IDS.includes(Number(k)))
      .filter((key) => !NETWORKS[parseChainId(key)].testnet)
      .map((key) => Number(key));
  }, [activeChainIds]);

  const renderDialogComponent = () => {
    if (variant === SwapVariant.MatchaLike) {
      return (
        <SwapSelectCoinMatchaDialog
          tokens={tokens}
          recentTokens={recentTokens
            ?.map((t) => convertOldTokenToNew(t) as Token)
            .filter((t) => t.chainId === chainId)}
          onQueryChange={handleQueryChange}
          onSelect={handleSelectToken}
          DialogProps={{
            open: showSelect,
            maxWidth: "xs",
            fullWidth: true,
            onClose: handleCloseSelectToken,
          }}
          isLoadingSearch={searchQuery.isLoading}
          chainId={selectedChainId}
          account={account}
          provider={selectedProvider}
          featuredTokens={featuredTokensByChain}
          onClearRecentTokens={handleClearRecentTokens}
          isProviderReady={isProviderReady}
          filteredChainIds={filteredChainIds}
          onToggleChangeNetwork={handleToggleSwitchNetworkCustom}
          onChangeNetwork={handleChangeNetworkCustom}
          enableImportExterTokens={enableImportExterTokens}
        />
      );
    } else if (variant === SwapVariant.UniswapLike) {
      return (
        <SwapSelectCoinUniswapDialog
          tokens={tokens}
          recentTokens={recentTokens
            ?.map((t) => convertOldTokenToNew(t) as Token)
            .filter((t) => t.chainId === chainId)}
          onQueryChange={handleQueryChange}
          onSelect={handleSelectToken}
          DialogProps={{
            open: showSelect,
            maxWidth: "xs",
            fullWidth: true,
            onClose: handleCloseSelectToken,
          }}
          isLoadingSearch={searchQuery.isLoading}
          chainId={selectedChainId}
          account={account}
          provider={selectedProvider}
          featuredTokens={featuredTokensByChain}
          onClearRecentTokens={handleClearRecentTokens}
          isProviderReady={isProviderReady}
          filteredChainIds={filteredChainIds}
          onToggleChangeNetwork={handleToggleSwitchNetworkCustom}
          onChangeNetwork={handleChangeNetworkCustom}
          enableImportExterTokens={enableImportExterTokens}
        />
      );
    } else if (variant === SwapVariant.Glass) {
      return (
        <SwapSelectCoinGlassDialog
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
          provider={selectedProvider}
          featuredTokens={featuredTokensByChain}
          onClearRecentTokens={handleClearRecentTokens}
          enableImportExterTokens={enableImportExterTokens}
          filteredChainIds={filteredChainIds}
          onToggleChangeNetwork={handleToggleSwitchNetworkCustom}
          onChangeNetwork={handleChangeNetworkCustom}
          isProviderReady={isProviderReady}
          disableNetworkChange={disableNetworkChange}
          disableNetworkSelector={disableNetworkSelector}
          blurIntensity={options.glassSettings?.blurIntensity}
          glassOpacity={options.glassSettings?.glassOpacity}
          disableBackground={options.glassSettings?.disableBackground}
          textColor={options.glassSettings?.textColor}
          backgroundType={options.glassSettings?.backgroundType}
          backgroundColor={options.glassSettings?.backgroundColor}
          backgroundImage={options.glassSettings?.backgroundImage}
          backgroundSize={options.glassSettings?.backgroundSize}
          backgroundPosition={options.glassSettings?.backgroundPosition}
          gradientStartColor={options.glassSettings?.gradientStartColor}
          gradientEndColor={options.glassSettings?.gradientEndColor}
          gradientDirection={options.glassSettings?.gradientDirection}
        />
      );
    }

    return (
      <SwapSelectCoinDialog
        tokens={tokens}
        recentTokens={recentTokens
          ?.map((t) => convertOldTokenToNew(t) as Token)
          .filter((t) => t.chainId === chainId)}
        onQueryChange={handleQueryChange}
        onSelect={handleSelectToken}
        DialogProps={{
          open: showSelect,
          maxWidth: "xs",
          fullWidth: true,
          onClose: handleCloseSelectToken,
        }}
        isLoadingSearch={searchQuery.isLoading}
        chainId={selectedChainId}
        account={account}
        provider={selectedProvider}
        featuredTokens={featuredTokensByChain}
        onClearRecentTokens={handleClearRecentTokens}
        enableImportExterTokens={enableImportExterTokens}
      />
    );
  };

  const renderSwapComponent = () => {
    if (variant === SwapVariant.MatchaLike) {
      return (
        <SwapMatcha
          chainId={chainId}
          selectedChainId={selectedChainId}
          currency={currency}
          quoteFor={quoteFor}
          quoteQuery={quoteQuery}
          provider={selectedProvider}
          account={account}
          isActivating={isActivating}
          isActive={isActive && !disableWallet}
          isAutoSlippage={isAutoSlippage}
          maxSlippage={maxSlippage}
          priceBuy={quoteQueryPrice?.buyPrice}
          priceBuyLoading={quoteQueryPrice?.isLoadingPrice}
          priceSell={quoteQueryPrice?.sellPrice}
          priceSellLoading={quoteQueryPrice?.isLoadingPrice}
          sellToken={sellToken}
          buyToken={buyToken}
          sellAmount={sellAmount}
          buyAmount={buyAmount}
          execType={execType}
          quote={quote}
          isExecuting={isExecuting}
          clickOnMax={clickOnMax}
          sellTokenBalance={sellTokenBalance}
          buyTokenBalance={buyTokenBalance}
          insufficientBalance={insufficientBalance}
          isProviderReady={isProviderReady}
          isQuoting={isQuoting}
          disableNotificationsButton={disableNotificationsButton}
          enableBuyCryptoButton={enableBuyCryptoButton}
          disableFooter={disableFooter}
          networkName={chainId && NETWORKS[chainId] ? NETWORKS[chainId].name : undefined}
          featuredTokensByChain={featuredTokensByChain}
          onSelectToken={handleOpenSelectTokenCustom}
          onSwapTokens={handleSwapTokensCustom}
          onChangeSellAmount={handleChangeSellAmount}
          onChangeBuyAmount={handleChangeBuyAmount}
          onChangeNetwork={handleChangeNetworkCustom}
          onToggleChangeNetwork={handleToggleSwitchNetworkCustom}
          onShowSettings={handleShowSettings}
          onShowTransactions={handleShowTransactions}
          onExec={handleExecSwap}
          onShowTransak={handleShowTransak}
          onSetToken={handleSetToken}
          keepTokenAlwaysPresent={keepTokenAlwaysPresent}
          lockedToken={lockedToken}
          swapFees={swapFees}
        />
      );
    }

    if (variant === SwapVariant.UniswapLike) {
      return (
        <SwapUniswap
          chainId={chainId}
          selectedChainId={selectedChainId}
          currency={currency}
          quoteFor={quoteFor}
          quoteQuery={quoteQuery}
          provider={selectedProvider}
          account={account}
          isActivating={isActivating}
          isActive={isActive && !disableWallet}
          isAutoSlippage={isAutoSlippage}
          maxSlippage={maxSlippage}
          priceBuy={quoteQueryPrice?.buyPrice}
          priceBuyLoading={quoteQueryPrice?.isLoadingPrice}
          priceSell={quoteQueryPrice?.sellPrice}
          priceSellLoading={quoteQueryPrice?.isLoadingPrice}
          sellToken={sellToken}
          buyToken={buyToken}
          sellAmount={sellAmount}
          buyAmount={buyAmount}
          execType={execType}
          quote={quote}
          isExecuting={isExecuting}
          clickOnMax={clickOnMax}
          sellTokenBalance={sellTokenBalance}
          buyTokenBalance={buyTokenBalance}
          insufficientBalance={insufficientBalance}
          isProviderReady={isProviderReady}
          isQuoting={isQuoting}
          disableNotificationsButton={disableNotificationsButton}
          enableBuyCryptoButton={enableBuyCryptoButton}
          disableFooter={disableFooter}
          networkName={chainId && NETWORKS[chainId] ? NETWORKS[chainId].name : undefined}
          featuredTokensByChain={featuredTokensByChain}
          onSelectToken={handleOpenSelectTokenCustom}
          onSwapTokens={handleSwapTokensCustom}
          onChangeSellAmount={handleChangeSellAmount}
          onChangeBuyAmount={handleChangeBuyAmount}
          onChangeNetwork={handleChangeNetworkCustom}
          onToggleChangeNetwork={handleToggleSwitchNetworkCustom}
          onShowSettings={handleShowSettings}
          onShowTransactions={handleShowTransactions}
          onExec={handleExecSwap}
          onShowTransak={handleShowTransak}
          onSetToken={handleSetToken}
          keepTokenAlwaysPresent={keepTokenAlwaysPresent}
          lockedToken={lockedToken}
          swapFees={swapFees}
        />
      );
    }

    if (variant === SwapVariant.Compact) {
      return (
        <SwapCompact
          chainId={chainId}
          selectedChainId={selectedChainId}
          currency={currency}
          quoteFor={quoteFor}
          quoteQuery={quoteQuery}
          provider={selectedProvider}
          account={account}
          isActivating={isActivating}
          isActive={isActive && !disableWallet}
          isAutoSlippage={isAutoSlippage}
          maxSlippage={maxSlippage}
          priceBuy={quoteQueryPrice?.buyPrice}
          priceBuyLoading={quoteQueryPrice?.isLoadingPrice}
          priceSell={quoteQueryPrice?.sellPrice}
          priceSellLoading={quoteQueryPrice?.isLoadingPrice}
          sellToken={sellToken}
          buyToken={buyToken}
          sellAmount={sellAmount}
          buyAmount={buyAmount}
          execType={execType}
          quote={quote}
          isExecuting={isExecuting}
          clickOnMax={clickOnMax}
          sellTokenBalance={sellTokenBalance}
          buyTokenBalance={buyTokenBalance}
          insufficientBalance={insufficientBalance}
          isProviderReady={isProviderReady}
          isQuoting={isQuoting}
          disableNotificationsButton={disableNotificationsButton}
          enableBuyCryptoButton={enableBuyCryptoButton}
          disableFooter={disableFooter}
          networkName={chainId && NETWORKS[chainId] ? NETWORKS[chainId].name : undefined}
          featuredTokensByChain={featuredTokensByChain}
          onSelectToken={handleOpenSelectTokenCustom}
          onSwapTokens={handleSwapTokensCustom}
          onChangeSellAmount={handleChangeSellAmount}
          onChangeBuyAmount={handleChangeBuyAmount}
          onChangeNetwork={handleChangeNetworkCustom}
          onToggleChangeNetwork={handleToggleSwitchNetworkCustom}
          onShowSettings={handleShowSettings}
          onShowTransactions={handleShowTransactions}
          onExec={handleExecSwap}
          onShowTransak={handleShowTransak}
          onSetToken={handleSetToken}
          keepTokenAlwaysPresent={keepTokenAlwaysPresent}
          lockedToken={lockedToken}
          swapFees={swapFees}
        />
      );
    }

    if (variant === SwapVariant.Minimal) {
      return (
        <SwapMinimal
          chainId={chainId}
          selectedChainId={selectedChainId}
          currency={currency}
          quoteFor={quoteFor}
          priceBuy={quoteQueryPrice?.buyPrice}
          priceBuyLoading={quoteQueryPrice?.isLoadingPrice}
          priceSell={quoteQueryPrice?.sellPrice}
          priceSellLoading={quoteQueryPrice?.isLoadingPrice}
          sellToken={sellToken}
          buyToken={buyToken}
          sellAmount={sellAmount}
          buyAmount={buyAmount}
          execType={execType}
          quote={quote}
          isExecuting={isExecuting}
          clickOnMax={clickOnMax}
          sellTokenBalance={sellTokenBalance}
          buyTokenBalance={buyTokenBalance}
          insufficientBalance={insufficientBalance}
          isProviderReady={isProviderReady}
          isQuoting={isQuoting}
          isActive={isActive}
          featuredTokensByChain={featuredTokensByChain}
          onSelectToken={handleOpenSelectTokenCustom}
          onSwapTokens={handleSwapTokensCustom}
          onChangeSellAmount={handleChangeSellAmount}
          onChangeBuyAmount={handleChangeBuyAmount}
          onToggleChangeNetwork={handleToggleSwitchNetworkCustom}
          onExec={handleExecSwap}
          onSetToken={handleSetToken}
          keepTokenAlwaysPresent={keepTokenAlwaysPresent}
          lockedToken={lockedToken}
          swapFees={swapFees}
        />
      );
    }

    if (variant === SwapVariant.Mobile) {
      return (
        <SwapMobile
          chainId={chainId}
          selectedChainId={selectedChainId}
          currency={currency}
          quoteFor={quoteFor}
          quoteQuery={quoteQuery}
          provider={selectedProvider}
          account={account}
          isActivating={isActivating}
          isActive={isActive && !disableWallet}
          isAutoSlippage={isAutoSlippage}
          maxSlippage={maxSlippage}
          priceBuy={quoteQueryPrice?.buyPrice}
          priceBuyLoading={quoteQueryPrice?.isLoadingPrice}
          priceSell={quoteQueryPrice?.sellPrice}
          priceSellLoading={quoteQueryPrice?.isLoadingPrice}
          sellToken={sellToken}
          buyToken={buyToken}
          sellAmount={sellAmount}
          buyAmount={buyAmount}
          execType={execType}
          quote={quote}
          isExecuting={isExecuting}
          clickOnMax={clickOnMax}
          sellTokenBalance={sellTokenBalance}
          buyTokenBalance={buyTokenBalance}
          insufficientBalance={insufficientBalance}
          isProviderReady={isProviderReady}
          isQuoting={isQuoting}
          disableNotificationsButton={disableNotificationsButton}
          enableBuyCryptoButton={enableBuyCryptoButton}
          disableFooter={disableFooter}
          networkName={chainId && NETWORKS[chainId] ? NETWORKS[chainId].name : undefined}
          featuredTokensByChain={featuredTokensByChain}
          onSelectToken={handleOpenSelectTokenCustom}
          onSwapTokens={handleSwapTokensCustom}
          onChangeSellAmount={handleChangeSellAmount}
          onChangeBuyAmount={handleChangeBuyAmount}
          onChangeNetwork={handleChangeNetworkCustom}
          onToggleChangeNetwork={handleToggleSwitchNetworkCustom}
          onShowSettings={handleShowSettings}
          onShowTransactions={handleShowTransactions}
          onExec={handleExecSwap}
          onShowTransak={handleShowTransak}
          onSetToken={handleSetToken}
          keepTokenAlwaysPresent={keepTokenAlwaysPresent}
          lockedToken={lockedToken}
          swapFees={swapFees}
        />
      );
    }

    if (variant === SwapVariant.Glass) {
      return (
        <SwapGlass
          currency={currency}
          disableNotificationsButton={disableNotificationsButton}
          priceBuy={quoteQueryPrice?.buyPrice}
          priceSell={quoteQueryPrice?.sellPrice}
          priceBuyLoading={quoteQueryPrice?.isLoadingPrice}
          priceSellLoading={quoteQueryPrice?.isLoadingPrice}
          chainId={chainId}
          selectedChainId={selectedChainId}
          quoteFor={quoteFor}
          quoteQuery={quoteQuery}
          clickOnMax={clickOnMax}
          isActive={isActive && !disableWallet}
          buyToken={buyToken}
          sellToken={sellToken}
          onSelectToken={handleOpenSelectTokenCustom}
          onSwapTokens={handleSwapTokensCustom}
          sellAmount={sellAmount}
          buyAmount={buyAmount}
          networkName={
            chainId && NETWORKS[chainId] ? NETWORKS[chainId].name : undefined
          }
          onToggleChangeNetwork={handleToggleSwitchNetworkCustom}
          onChangeBuyAmount={handleChangeBuyAmount}
          onChangeSellAmount={handleChangeSellAmount}
          onExec={handleExecSwap}
          execType={execType}
          isExecuting={isExecuting}
          quote={quote}
          isQuoting={isQuoting}
          provider={selectedProvider}
          isProviderReady={isProviderReady}
          sellTokenBalance={sellTokenBalance}
          insufficientBalance={insufficientBalance}
          buyTokenBalance={buyTokenBalance}
          onChangeNetwork={handleChangeNetworkCustom}
          onShowSettings={handleShowSettings}
          onShowTransactions={handleShowTransactions}
          onShowTransak={transakApiKey ? handleShowTransak : undefined}
          disableFooter={disableFooter}
          enableBuyCryptoButton={enableBuyCryptoButton}
          featuredTokensByChain={featuredTokensByChain}
          onSetToken={handleSetToken}
          blurIntensity={options.glassSettings?.blurIntensity}
          glassOpacity={options.glassSettings?.glassOpacity}
          disableBackground={options.glassSettings?.disableBackground}
          textColor={options.glassSettings?.textColor}
          backgroundType={options.glassSettings?.backgroundType}
          backgroundColor={options.glassSettings?.backgroundColor}
          backgroundImage={options.glassSettings?.backgroundImage}
          backgroundSize={options.glassSettings?.backgroundSize}
          backgroundPosition={options.glassSettings?.backgroundPosition}
          gradientStartColor={options.glassSettings?.gradientStartColor}
          gradientEndColor={options.glassSettings?.gradientEndColor}
          gradientDirection={options.glassSettings?.gradientDirection}
          keepTokenAlwaysPresent={keepTokenAlwaysPresent}
          lockedToken={lockedToken}
          disableNetworkChange={disableNetworkChange}
          disableNetworkSelector={disableNetworkSelector}
          swapFees={swapFees}
        />
      );
    }

    return (
      <Swap
        chainId={chainId}
        selectedChainId={selectedChainId}
        currency={currency}
        quoteFor={quoteFor}
        quoteQuery={quoteQuery}
        provider={selectedProvider}
        account={account}
        isActivating={isActivating}
        isActive={isActive && !disableWallet}
        isAutoSlippage={isAutoSlippage}
        maxSlippage={maxSlippage}
        priceBuy={quoteQueryPrice?.buyPrice}
        priceBuyLoading={quoteQueryPrice?.isLoadingPrice}
        priceSell={quoteQueryPrice?.sellPrice}
        priceSellLoading={quoteQueryPrice?.isLoadingPrice}
        sellToken={sellToken}
        buyToken={buyToken}
        sellAmount={sellAmount}
        buyAmount={buyAmount}
        execType={execType}
        quote={quote}
        isExecuting={isExecuting}
        clickOnMax={clickOnMax}
        sellTokenBalance={sellTokenBalance}
        buyTokenBalance={buyTokenBalance}
        insufficientBalance={insufficientBalance}
        isProviderReady={isProviderReady}
        isQuoting={isQuoting}
        disableNotificationsButton={disableNotificationsButton}
        enableBuyCryptoButton={enableBuyCryptoButton}
        disableFooter={disableFooter}
        networkName={chainId && NETWORKS[chainId] ? NETWORKS[chainId].name : undefined}
        featuredTokensByChain={featuredTokensByChain}
        onSelectToken={handleOpenSelectTokenCustom}
        onSwapTokens={handleSwapTokensCustom}
        onChangeSellAmount={handleChangeSellAmount}
        onChangeBuyAmount={handleChangeBuyAmount}
        onChangeNetwork={handleChangeNetworkCustom}
        onToggleChangeNetwork={handleToggleSwitchNetworkCustom}
        onShowSettings={handleShowSettings}
        onShowTransactions={handleShowTransactions}
        onExec={handleExecSwap}
        onShowTransak={handleShowTransak}
        onSetToken={handleSetToken}
        keepTokenAlwaysPresent={keepTokenAlwaysPresent}
        lockedToken={lockedToken}
        disableNetworkChange={disableNetworkChange}
        disableNetworkSelector={disableNetworkSelector}
        swapFees={swapFees}
      />
    );
  };

  const renderConfirmDialog = () => {
    if (variant === SwapVariant.MatchaLike) {
      return (
        <SwapConfirmMatchaDialog
          DialogProps={{
            open: showConfirmSwap,
            maxWidth: "xs",
            fullWidth: true,
            onClose: handleCloseConfirmSwap,
          }}
          quote={quote}
          isQuoting={isQuoting}
          isConfirming={handleConfirmExecSwap.isLoading}
          isLoadingSignGasless={isLoadingSignGasless}
          isLoadingStatusGasless={gaslessSwapState.isLoadingStatusGasless}
          reasonFailedGasless={gaslessSwapState.reasonFailedGasless}
          successTxGasless={gaslessSwapState.successTxGasless}
          confirmedTxGasless={gaslessSwapState.confirmedTxGasless}
          onConfirm={handleConfirmSwap}
          execSwapState={execSwapState}
          execType={execType}
          chainId={chainId}
          currency={currency || "usd"}
          sellToken={sellToken}
          buyToken={buyToken}
        />
      );
    }

    if (variant === SwapVariant.UniswapLike) {
      return (
        <SwapConfirmUniswapDialog
          DialogProps={{
            open: showConfirmSwap,
            maxWidth: "xs",
            fullWidth: true,
            onClose: handleCloseConfirmSwap,
          }}
          quote={quote}
          isQuoting={isQuoting}
          isConfirming={handleConfirmExecSwap.isLoading}
          isLoadingSignGasless={isLoadingSignGasless}
          isLoadingStatusGasless={gaslessSwapState.isLoadingStatusGasless}
          reasonFailedGasless={gaslessSwapState.reasonFailedGasless}
          successTxGasless={gaslessSwapState.successTxGasless}
          confirmedTxGasless={gaslessSwapState.confirmedTxGasless}
          onConfirm={handleConfirmSwap}
          execSwapState={execSwapState}
          execType={execType}
          chainId={chainId}
          currency={currency || "usd"}
          sellToken={sellToken}
          buyToken={buyToken}
        />
      );
    }

    return (
      <SwapConfirmDialog
        DialogProps={{
          open: showConfirmSwap,
          maxWidth: "xs",
          fullWidth: true,
          onClose: handleCloseConfirmSwap,
        }}
        quote={quote}
        isQuoting={isQuoting}
        isConfirming={handleConfirmExecSwap.isLoading}
        isLoadingSignGasless={isLoadingSignGasless}
        isLoadingStatusGasless={gaslessTrades.length > 0}
        reasonFailedGasless={gaslessSwapState.reasonFailedGasless}
        successTxGasless={gaslessSwapState.successTxGasless}
        confirmedTxGasless={gaslessSwapState.confirmedTxGasless}
        onConfirm={handleConfirmSwap}
        execSwapState={execSwapState}
        execType={execType}
        chainId={chainId}
        currency={currency || "usd"}
        sellToken={sellToken}
        buyToken={buyToken}
      />
    );
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted && Boolean(enableUrlParams)) {
      const url = new URL(window.location.href);

      if (chainId !== undefined) {
        url.searchParams.set("chainId", chainId.toString());
      }

      if (sellToken !== undefined) {
        url.searchParams.set("sellToken", sellToken.address);
      }

      if (buyToken !== undefined) {
        url.searchParams.set("buyToken", buyToken.address);
      }

      history.pushState({}, "", url);
    } else {
      setMounted(true);
    }
  }, [sellToken, buyToken, chainId, mounted, enableUrlParams]);

  const handleCloseWarning = () => {
    setSelecteToken(undefined);
    setShowWarningDialog(false);
  };

  const handleConfirmSelectToken = () => {
    if (selectedToken) {
      handleSelectTokenState(selectedToken);
    }
  };

  return (
    <>
      {selectedToken && showWarningDialog && (
        <ExternTokenWarningDialog
          DialogProps={{
            open: showWarningDialog,
            onClose: handleCloseWarning,
            fullWidth: true,
            maxWidth: "sm",
          }}
          onConfirm={handleConfirmSelectToken}
          token={selectedToken}
        />
      )}

      {chainId && renderDialogComponent()}
      <SwitchNetworkDialog
        onChangeNetwork={handleChangeNetworkCustom}
        activeChainIds={filteredChainIds}
        DialogProps={{
          open: showSwitchNetwork,
          maxWidth: "xs",
          fullWidth: true,
          onClose: handleToggleSwitchNetworkCustom,
        }}
        chainId={chainId}
      />
      {showConfirmSwap && renderConfirmDialog()}
      {showSettings && variant === SwapVariant.Glass && (
        <SwapSettingsGlassDialog
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
          blurIntensity={options.glassSettings?.blurIntensity}
          glassOpacity={options.glassSettings?.glassOpacity}
          textColor={options.glassSettings?.textColor}
        />
      )}
      {showSettings && variant !== SwapVariant.Glass && (
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
      {renderSwapComponent()}
    </>
  );
}