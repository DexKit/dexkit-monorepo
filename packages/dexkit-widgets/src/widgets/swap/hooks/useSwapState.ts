import { ChainId } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { useIsGaslessSupportedToken } from "@dexkit/ui/modules/swap/hooks/useIsGaslessSupportedToken";
import {
  ZeroExGaslessQuoteResponse,
  ZeroExQuoteResponse,
} from "@dexkit/ui/modules/swap/types";
import { SwapVariant } from "@dexkit/ui/modules/wizard/types";
import { Transak } from "@transak/transak-sdk";
import type { providers } from "ethers";

import { formatBigNumber } from "@dexkit/core/utils";
import { useSendTxMutation, useZrxQuoteQuery } from "@dexkit/ui/hooks/zrx";
import { useCanGasless } from "@dexkit/ui/modules/swap/hooks";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSwitchChain } from "wagmi";
import {
  useAsyncMemo,
  useDebounce,
  useRecentTokens,
  useTokenBalance,
  useWrapToken,
} from "../../../hooks";
import { useSignTypeData } from "../../../hooks/useSignTypeData";
import { isAddressEqual } from "../../../utils";
import { ExecSwapState } from "../constants/enum";
import { NotificationCallbackParams, SwapSide } from "../types";
import { useExecType } from "./useExecType";
import { useGaslessSwapState } from "./useGaslessSwapState";
import { useSwapCurrencyPrice } from "./useSwapCurrencyPrice";

export function useSwapState({
  provider,
  defaultSellToken,
  defaultBuyToken,
  connectorProvider,
  selectedChainId: chainId,
  connectedChainId,
  account,
  swapFees,
  isGasless: useGasless,
  isActive,
  isActivating,
  disableFooter,
  zeroExApiKey,
  maxSlippage,
  isAutoSlippage,
  transakApiKey,
  onChangeNetwork,
  onNotification,
  onConnectWallet,
  onShowTransactions,
  currency,
  variant,
}: {
  zeroExApiKey?: string;
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
  disableFooter?: boolean;
  enableBuyCryptoButton?: boolean;
  provider?: providers.BaseProvider;
  connectorProvider?: providers.Web3Provider;
  isGasless?: boolean;
  isActive?: boolean;
  isActivating?: boolean;
  account?: string;
  selectedChainId?: ChainId;
  connectedChainId?: ChainId;
  defaultSellToken?: Token;
  defaultBuyToken?: Token;
  transakApiKey?: string;
  onChangeNetwork: (chainId: ChainId) => void;
  onNotification: (params: NotificationCallbackParams) => void;
  onConnectWallet: () => void;
  onShowTransactions: () => void;
  maxSlippage: number;
  isAutoSlippage: boolean;
  currency: string;
  variant?: SwapVariant;
}) {
  const { switchChain } = useSwitchChain();

  const transak = useMemo(() => {
    if (transakApiKey) {
      return new Transak({
        apiKey: transakApiKey, // (Required)
        environment: Transak.ENVIRONMENTS.PRODUCTION,
      });
    }
  }, [transakApiKey]);

  const { wrapMutation, unwrapMutation } = useWrapToken({ onNotification });
  const [showSelect, setShowSelectToken] = useState(false);
  const [tradeHash, setTradeHash] = useState<string>();
  const [execSwapState, setExecSwapState] = useState(ExecSwapState.quote);
  const [quoteFor, setQuoteFor] = useState<SwapSide>();
  const [clickOnMax, setClickOnMax] = useState<boolean>(false);
  const [sellToken, setSellToken] = useState<Token | undefined>();
  const [buyToken, setBuyToken] = useState<Token | undefined>();

  useEffect(() => {
    setSellToken(defaultSellToken);
    setBuyToken(defaultBuyToken);
  }, [defaultBuyToken, defaultSellToken, chainId, connectedChainId]);
  const [sellAmount, setSellAmount] = useState<BigNumber>(BigNumber.from(0));
  const [buyAmount, setBuyAmount] = useState<BigNumber>(BigNumber.from(0));
  const [selectSide, setSelectSide] = useState<SwapSide>();
  const [showSettings, setShowSettings] = useState(false);
  const lazySellToken = useDebounce<Token | undefined>(sellToken, 0);
  const lazyBuyToken = useDebounce<Token | undefined>(buyToken, 0);
  const lazySellAmount = useDebounce<BigNumber>(sellAmount, 200);
  const lazyBuyAmount = useDebounce<BigNumber>(buyAmount, 200);
  const lazyQuoteFor = useDebounce<SwapSide>(quoteFor, 0);

  const [showConfirmSwap, setShowConfirmSwap] = useState(false);

  const sellTokenBalance = useTokenBalance({
    provider,
    account,
    contractAddress: lazySellToken?.address,
  });

  const buyTokenBalance = useTokenBalance({
    provider,
    account,
    contractAddress: lazyBuyToken?.address,
  });

  const handleQuoteSuccess = useCallback(
    (data?: ZeroExQuoteResponse | ZeroExGaslessQuoteResponse) => {
      if (data) {
        if (quoteFor === "buy") {
          setSellAmount(BigNumber.from(data.buyAmount));
        } else if (quoteFor === "sell") {
          setBuyAmount(BigNumber.from(data.buyAmount));
        }
      }
    },
    [quoteFor]
  );

  const isTokenGaslessSupported = useIsGaslessSupportedToken({
    chainId,
    useGasless,
    sellToken:
      lazyQuoteFor === "sell" ? lazySellToken?.address : lazyBuyToken?.address,
  });
  const isGasless = useGasless && isTokenGaslessSupported;

  const gaslessSwapState = useGaslessSwapState({
    zeroExApiKey,
    chainId,
    tradeHash,
  });

  const canGasless = useCanGasless({
    enabled: !!isGasless,
    buyToken: lazyBuyToken!,
    sellToken: lazySellToken!,
    side: quoteFor!,
    chainId: chainId!,
  });

  const quoteQuery = useZrxQuoteQuery({
    params: {
      chainId: chainId!,
      sellAmount:
        quoteFor === "buy"
          ? lazyBuyAmount.toString()
          : lazySellAmount.toString(),
      buyToken:
        quoteFor === "buy" ? lazySellToken?.address : lazyBuyToken?.address,
      sellToken:
        quoteFor === "buy" ? lazyBuyToken?.address : lazySellToken?.address,
      taker: account!,
      slippageBps: maxSlippage ? maxSlippage * 100 * 100 : undefined,
    },
    useGasless: canGasless,
    onSuccess: handleQuoteSuccess,
  });

  const quoteQueryPrice = useSwapCurrencyPrice({
    maxSlippage: !isAutoSlippage ? maxSlippage : undefined,
    zeroExApiKey,
    currency,
    swapFees,
    params: {
      chainId: chainId as ChainId,
      sellToken: lazySellToken,
      buyToken: lazyBuyToken,
      sellTokenAmount: lazySellAmount,
      buyTokenAmount: lazyBuyAmount,
      quoteFor: lazyQuoteFor,
      account,
    },
    variant,
  });

  const signTypeDataMutation = useSignTypeData();

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleSwapTokens = useCallback(() => {
    setSellAmount(buyAmount);
    setBuyAmount(sellAmount);
    setSellToken(buyToken);
    setBuyToken(sellToken);
  }, [sellToken, buyToken, sellAmount, buyAmount]);

  const handleOpenSelectToken = (selectFor: SwapSide, token?: Token) => {
    setSelectSide(selectFor);
    setShowSelectToken(true);
  };

  const recentTokens = useRecentTokens();

  const handleSelectToken = (token: Token) => {
    recentTokens.add(token);

    if (selectSide === "sell") {
      if (
        token.chainId === buyToken?.chainId &&
        isAddressEqual(token.address, buyToken?.address)
      ) {
        handleSwapTokens();
      } else {
        setSellToken(token);
      }
    } else {
      if (
        token.chainId === sellToken?.chainId &&
        isAddressEqual(token.address, sellToken?.address)
      ) {
        handleSwapTokens();
      } else {
        setBuyToken(token);
      }
    }

    setSelectSide(undefined);
    setShowSelectToken(false);
  };

  const handleClearRecentTokens = () => {
    recentTokens.clear();
  };

  const handleChangeBuyAmount = useCallback(
    (value: BigNumber, clickMax?: boolean) => {
      setQuoteFor("buy");
      if (buyToken) {
        if (clickMax) {
          setClickOnMax(true);
        } else {
          setClickOnMax(false);
        }
        setBuyAmount(value);
      }
    },
    [buyToken]
  );

  const handleChangeSellAmount = useCallback(
    (value: BigNumber, clickMax?: boolean) => {
      setQuoteFor("sell");
      if (sellToken) {
        if (clickMax) {
          setClickOnMax(true);
        } else {
          setClickOnMax(false);
        }
        setSellAmount(value);
      }
    },
    [sellToken]
  );

  const handleConnectWallet = () => {
    onConnectWallet();
  };

  const handleShowTransactions = () => {
    onShowTransactions();
  };

  const handleCloseSelectToken = () => {
    setShowSelectToken(false);
  };

  const handleCloseConfirmSwap = () => {
    setShowConfirmSwap(false);
    // if there is
    if (gaslessSwapState.confirmedTxGasless) {
      sellTokenBalance.refetch();
      buyTokenBalance.refetch();
    }
    setTradeHash(undefined);

    setExecSwapState(ExecSwapState.quote);
  };

  const handleChangeNetwork = async (newChainId: ChainId) => {
    onChangeNetwork(newChainId);
    setQuoteFor(undefined);
    setSellAmount(BigNumber.from(0));
    setBuyAmount(BigNumber.from(0));
    setSellToken(undefined);
    setBuyToken(undefined);
  };

  const isProviderReady = useAsyncMemo<boolean>(
    async (initial) => {
      if (provider) {
        await provider.ready;

        return true;
      }

      return initial;
    },
    false,
    [provider]
  );

  const execType = useExecType({
    chainId,
    connectedChainId,
    lazyBuyToken,
    lazySellToken,
    account,
    quoteQuery,
    quoteFor,
    isGasless,
    lazySellAmount,
    provider,
  });

  const sendTxMutation = useSendTxMutation({
    quote: quoteQuery.data ? quoteQuery.data : undefined,
    quoteQuery: quoteQuery as any,
    provider: connectorProvider as providers.Web3Provider,
    side: quoteFor! as any,
    account: account!,
    chainId: chainId!,
    canGasless,
    buyAmount: formatBigNumber(lazyBuyAmount, lazyBuyToken?.decimals),
    sellAmount: formatBigNumber(lazySellAmount, lazySellToken?.decimals),
    buyToken: lazyBuyToken!,
    sellToken: lazySellToken!,
  });

  const handleShowTransak = () => {
    if (transak) {
      transak.init();
    }
  };

  const handleExecSwap = useCallback(async () => {
    if (execType === "swap" && quoteQuery.data) {
      setShowConfirmSwap(true);
      quoteQuery.refetch();
    } else if (execType === "swap_gasless" && quoteQuery.data) {
      setShowConfirmSwap(true);
      quoteQuery.refetch();
      setExecSwapState(ExecSwapState.gasless_trade);
    } else if (execType === "wrap") {
      await wrapMutation.mutateAsync(
        {
          provider: connectorProvider as providers.Web3Provider,
          amount: lazySellAmount,
          onHash: (_hash: string) => {},
        },
        {
          onSuccess: (_receipt: providers.TransactionReceipt) => {},
        }
      );
    } else if (execType === "unwrap") {
      await unwrapMutation.mutateAsync(
        {
          provider: connectorProvider as providers.Web3Provider,
          amount: lazySellAmount,
          onHash: (_hash: string) => {},
        },
        {
          onSuccess: (receipt: providers.TransactionReceipt) => {
            quoteQuery.refetch();
          },
        }
      );
    } else if (execType === "switch" && chainId) {
      switchChain({ chainId });
    }
  }, [
    quoteQuery.data,
    execType,
    lazySellAmount,
    sellToken,
    chainId,
    connectorProvider,
  ]);

  const quoteData = useMemo(() => {
    if (quoteQuery.data) {
      const data = quoteQuery.data;

      return data;
    }
  }, [quoteQuery.data]);

  return {
    chainId,
    buyToken: lazyBuyToken,
    sellToken: lazySellToken,
    showSelect,
    selectSide,
    execType,
    quoteQueryPrice,
    sellAmount: lazySellAmount,
    buyAmount: lazyBuyAmount,
    quoteFor,
    insufficientBalance: lazySellAmount?.gt(
      sellTokenBalance.data ?? BigNumber.from(0)
    ),
    clickOnMax,
    isExecuting: wrapMutation.isLoading || unwrapMutation.isLoading,
    quote: quoteData,
    quoteQuery: quoteQuery,
    isQuoting: quoteQuery.isFetching,
    sellTokenBalance: sellTokenBalance.data,
    buyTokenBalance: buyTokenBalance.data,
    showConfirmSwap,
    isLoadingSignGasless: signTypeDataMutation.isLoading,
    showSettings,
    isProviderReady,
    recentTokens: recentTokens.tokens,
    setQuoteFor,
    gaslessSwapState,
    execSwapState,
    setSellAmount,
    setBuyAmount,
    handleConnectWallet,
    handleOpenSelectToken,
    handleSelectToken,
    setBuyToken,
    setSellToken,
    handleSwapTokens,
    handleChangeSellAmount,
    handleChangeBuyAmount,
    handleExecSwap,
    handleCloseSelectToken,
    handleCloseConfirmSwap,
    handleConfirmExecSwap: sendTxMutation,
    handleChangeNetwork,
    handleCloseSettings,
    handleShowSettings,
    handleShowTransactions,
    handleClearRecentTokens,
    handleShowTransak,
  };
}
