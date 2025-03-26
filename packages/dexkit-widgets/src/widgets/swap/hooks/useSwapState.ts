import { ChainId } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { useIsGaslessSupportedToken } from "@dexkit/ui/modules/swap/hooks/useIsGaslessSupportedToken";
import {
  SignatureType,
  ZeroExQuoteGasless,
  ZeroExQuoteResponse,
} from "@dexkit/ui/modules/swap/types";
import { isNativeInSell } from "@dexkit/ui/modules/swap/utils";
import { SwapVariant } from "@dexkit/ui/modules/wizard/types";
import { UseMutationResult } from "@tanstack/react-query";
import { Transak } from "@transak/transak-sdk";
import type { providers } from "ethers";

import { BigNumber, constants } from "ethers";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useAccount, useClient, useSignTypedData, useSwitchChain } from "wagmi";

import { splitSignature } from "ethers/lib/utils";
import { Hex } from "viem";
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
import { SwapExecParams } from "./useSwapExec";
import { SwapGaslessExecParams } from "./useSwapGaslessExec";
import { useSwapQuote } from "./useSwapQuote";

export function useSwapState({
  execMutation,
  approveMutation,
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
  execGaslessMutation,
  currency,
  variant,
}: {
  zeroExApiKey?: string;
  execMutation: UseMutationResult<
    providers.TransactionReceipt,
    unknown,
    SwapExecParams,
    unknown
  >;
  execGaslessMutation: UseMutationResult<
    string,
    unknown,
    SwapGaslessExecParams,
    unknown
  >;
  approveMutation: UseMutationResult<
    unknown,
    unknown,
    {
      spender: string;
      amount: BigNumber;
      tokenAddress?: string;
      provider?: providers.Web3Provider;
      token: Token;
    },
    unknown
  >;
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
    (data?: [string, ZeroExQuoteResponse | null]) => {
      if (data) {
        const [quotedFor, quote] = data;

        if (quotedFor === "buy" && quote && quote?.sellAmount) {
          setSellAmount(BigNumber.from(quote?.sellAmount));
        } else if (quotedFor === "sell" && quote && quote?.buyAmount) {
          setBuyAmount(BigNumber.from(quote?.buyAmount));
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

  const quote = useSwapQuote({
    onSuccess: handleQuoteSuccess,
    maxSlippage: !isAutoSlippage ? maxSlippage : undefined,
    zeroExApiKey,
    isGasless,
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

  const { quoteQuery } = quote;

  const signTypeDataMutation = useSignTypeData();

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleSwapTokens = useCallback(() => {
    const sell = sellToken;
    const buy = buyToken;

    const sellValue = sellAmount;
    const buyValue = buyAmount;

    if (quote.params?.quoteFor === "buy") {
      setSellAmount(buyValue);
      setBuyAmount(BigNumber.from(0));
      setQuoteFor("sell");
    } else if (quote.params?.quoteFor === "sell") {
      setBuyAmount(sellValue);
      setSellAmount(BigNumber.from(0));
      setQuoteFor("buy");
    }

    setSellToken(buy);
    setBuyToken(sell);
  }, [sellToken, buyToken, sellAmount, buyAmount, quote.params?.quoteFor]);

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
    quote.setSkipValidation(true);
    quote.setIntentOnFilling(false);
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
  const { signTypedDataAsync } = useSignTypedData();
  const client = useClient();
  const { chain } = useAccount();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const handleConfirmExecSwap = async () => {
    // Gasless not work on native token as sell side
    const canGasless =
      isGasless &&
      lazySellToken &&
      quoteFor &&
      lazyBuyToken &&
      !isNativeInSell({
        sellToken: lazySellToken,
        buyToken: lazyBuyToken,
        side: quoteFor,
      });

    if (
      canGasless &&
      quote.quoteQuery.data &&
      sellToken &&
      buyToken &&
      connectedChainId
    ) {
      const [, data] = quoteQuery.data as unknown as [
        string,
        ZeroExQuoteGasless,
      ];

      const tokenApprovalRequired = data.issues.allowance != null;
      const gaslessApprovalAvailable = data.approval != null;

      let approvalSignature: Hex | null = null;
      let approvalDataToSubmit: any = null;
      let tradeDataToSubmit: any = null;
      let tradeSignature: any = null;

      if (tokenApprovalRequired) {
        if (gaslessApprovalAvailable) {
          approvalSignature = await signTypedDataAsync({
            types: data.approval.eip712.types,
            domain: data.approval.eip712.domain,
            message: data.approval.eip712.message,
            primaryType: data.approval.eip712.primaryType,
          });
        } else {
          // TODO: Implement the  approval process
        }
      }

      if (approvalSignature) {
        const approvalSplitSig = await splitSignature(approvalSignature);
        approvalDataToSubmit = {
          type: data.approval.type,
          eip712: data.approval.eip712,
          signature: {
            ...approvalSplitSig,
            v: Number(approvalSplitSig.v),
            signatureType: SignatureType.EIP712,
          },
        };
      }

      tradeSignature = await signTypedDataAsync({
        types: data.trade.eip712.types,
        domain: data.trade.eip712.domain,
        message: data.trade.eip712.message,
        primaryType: data.trade.eip712.primaryType,
      });
      const tradeSplitSig = await splitSignature(tradeSignature);
      tradeDataToSubmit = {
        type: data.trade.type,
        eip712: data.trade.eip712,
        signature: {
          ...tradeSplitSig,
          v: Number(tradeSplitSig.v),
          signatureType: SignatureType.EIP712,
        },
      };

      try {
        const requestBody: any = {
          trade: tradeDataToSubmit,
          chainId,
        };

        if (approvalDataToSubmit) {
          requestBody.approval = approvalDataToSubmit;
        }

        if (data) {
          requestBody.quote = data;
        }

        const tradeHash = await execGaslessMutation.mutateAsync(requestBody);

        setTradeHash(tradeHash);
        handleCloseConfirmSwap();
        setExecSwapState(ExecSwapState.quote);
      } catch (error) {
        console.error("Error submitting the gasless swap", error);
        setTradeHash(undefined);
      }
    } else if (quoteQuery.data) {
      const onError = async (err: unknown) => {
        enqueueSnackbar(
          formatMessage({
            id: "transaction.rejected",
            defaultMessage: "Transaction rejected",
          }),
          { variant: "error" }
        );
      };

      handleCloseConfirmSwap();

      try {
        const [, data] = quoteQuery.data;
        if (data && sellToken && buyToken) {
          await execMutation.mutateAsync(
            {
              quote: data,
              provider: connectorProvider as providers.Web3Provider,
              onHash: (_hash: string) => {},
              sellToken,
              buyToken,
            },
            {
              onSuccess: (_receipt: providers.TransactionReceipt) => {},
              onError,
            }
          );
          sellTokenBalance.refetch();
          buyTokenBalance.refetch();
        }
      } catch (err: unknown) {}
    }
  };

  const handleShowTransak = () => {
    if (transak) {
      transak.init();
    }
  };

  const handleExecSwap = useCallback(async () => {
    if (execType === "swap" && quoteQuery.data) {
      setShowConfirmSwap(true);
      quote.setSkipValidation(false);
      quote.setIntentOnFilling(true);

      quote.quoteQuery.refetch();
    } else if (execType === "swap_gasless" && quoteQuery.data) {
      setShowConfirmSwap(true);
      quote.setIntentOnFilling(true);
      quote.quoteQuery.refetch();
      setExecSwapState(ExecSwapState.gasless_trade);
    } /*else if (execType === "approve_gasless" && quoteQuery.data) {
      setShowConfirmSwap(true);
      quote.setIntentOnFilling(true);
      setExecSwapState(ExecSwapState.gasless_approval)
      quote.quoteQuery.refetch();
    }*/ else if (execType === "wrap") {
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
    } else if (execType === "approve" && quoteQuery.data) {
      const [, data] = quoteQuery.data;
      setExecSwapState(ExecSwapState.approve);

      if (data && sellToken) {
        await approveMutation.mutateAsync(
          {
            spender: data.issues.allowance.spender || data.allowanceTarget,
            provider: connectorProvider as providers.Web3Provider,
            tokenAddress: sellToken.address || data.sellToken,
            amount: constants.MaxUint256,
            token: sellToken,
          },
          {
            onSuccess: () => {},
          }
        );
      }
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

  /*useEffect(() => {
    if (
      lazySellToken &&
      lazyBuyToken &&
      lazyQuoteFor &&
      (lazySellAmount || lazyBuyAmount)
    ) {
      if (execType === "wrap" || execType === "unwrap") {
        setBuyAmount(lazySellAmount);
      } else if (lazyQuoteFor) {
        if (!quote.enabled) {
          quote.setEnabled(true);
        }
      }
    }

  }, [
    quote,
    lazyQuoteFor,
    lazySellAmount,
    lazyBuyAmount,
    lazySellToken,
    lazyBuyToken,
    execType,
  ]);*/

  const quoteData = useMemo(() => {
    if (quoteQuery.data) {
      const [, data] = quoteQuery.data;

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
    quoteFor: quote.params?.quoteFor,
    insufficientBalance: lazySellAmount?.gt(
      sellTokenBalance.data ?? BigNumber.from(0)
    ),
    clickOnMax,
    isExecuting:
      wrapMutation.isLoading ||
      unwrapMutation.isLoading ||
      execMutation.isLoading ||
      approveMutation.isLoading,
    quote: quoteData,
    quoteQuery: quote.quoteQuery,
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
    handleConfirmExecSwap,
    handleChangeNetwork,
    handleCloseSettings,
    handleShowSettings,
    handleShowTransactions,
    handleClearRecentTokens,
    handleShowTransak,
  };
}
