import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";

import transakSDK from "@transak/transak-sdk";

import { Connector } from "@web3-react/types";
import { BigNumber, ethers, providers } from "ethers";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { WRAPED_TOKEN_ADDRESS } from "../../constants";
import { ERC20Abi } from "../../constants/abis";
import { ChainId } from "../../constants/enum";
import { NETWORKS } from "../../constants/networks";
import {
  useAsyncMemo,
  useDebounce,
  useRecentTokens,
  useTokenBalance,
  useWrapToken,
} from "../../hooks";
import { hasSufficientAllowance } from "../../services";
import { ZeroExApiClient } from "../../services/zeroex";
import {
  ZEROEX_AFFILIATE_ADDRESS,
  ZEROEX_NATIVE_TOKEN_ADDRESS,
} from "../../services/zeroex/constants";
import { ZeroExQuote, ZeroExQuoteResponse } from "../../services/zeroex/types";
import { Token } from "../../types";
import { isAddressEqual, switchNetwork } from "../../utils";
import { ExecType, NotificationCallbackParams, SwapSide } from "./types";

export function useErc20ApproveMutation({
  options,
  onNotification,
}: {
  options?: Omit<UseMutationOptions, any>;
  onNotification: (params: NotificationCallbackParams) => void;
}) {
  const mutation = useMutation(
    async ({
      spender,
      amount,
      tokenAddress,
      provider,
      token,
    }: {
      spender: string;
      token: Token;
      amount: ethers.BigNumber;
      tokenAddress?: string;
      provider?: ethers.providers.Web3Provider;
    }) => {
      if (!provider || tokenAddress === undefined) {
        return undefined;
      }

      const contract = new ethers.Contract(
        tokenAddress,
        ERC20Abi,
        provider.getSigner()
      );

      const tx = await contract.approve(spender, amount);

      const chainId = (await provider.getNetwork()).chainId;

      onNotification({
        chainId,
        title: "Approve token",
        hash: tx.hash,
        params: {
          type: "approve",
          token,
        },
      });

      return await tx.wait();
    },
    options
  );

  return mutation;
}

export interface SwapQuoteParams {
  sellToken?: Token;
  sellTokenAmount?: BigNumber;
  buyToken?: Token;
  buyTokenAmount?: BigNumber;
  chainId: ChainId;
  skipValidation?: boolean;
  quoteFor?: SwapSide;
  account?: string;
  slippagePercentage?: number;
}

export interface UseQuoteSwap {
  enabled: boolean;
  setParams: React.Dispatch<React.SetStateAction<SwapQuoteParams | undefined>>;
  setSkipValidation: React.Dispatch<React.SetStateAction<boolean>>;
  setIntentOnFilling: React.Dispatch<React.SetStateAction<boolean>>;
  params: SwapQuoteParams | undefined;
  setEnabled: React.Dispatch<boolean>;
  quoteQuery: UseQueryResult<
    [string, ZeroExQuoteResponse | null] | undefined,
    unknown
  >;
}

export const SWAP_QUOTE = "SWAP_QUOTE";

export function useSwapQuote({
  onSuccess,
  maxSlippage,
  zeroExApiKey,
  swapFees,
}: {
  onSuccess: (data?: [string, ZeroExQuoteResponse | null]) => void;
  maxSlippage?: number;
  zeroExApiKey?: string;
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
}): UseQuoteSwap {
  const [params, setParams] = useState<SwapQuoteParams>();
  const [enabled, setEnabled] = useState(true);
  const [skipValidation, setSkipValidation] = useState(true);
  const [intentOnFilling, setIntentOnFilling] = useState(false);

  const quoteQuery = useQuery(
    [
      SWAP_QUOTE,
      params,
      maxSlippage,
      zeroExApiKey,
      skipValidation,
      intentOnFilling,
      swapFees,
    ],
    async ({ signal }) => {
      if (!params) {
        return;
      }

      const {
        account,
        chainId,
        buyToken,
        sellToken,
        sellTokenAmount,
        buyTokenAmount,
        skipValidation: canSkipValitaion,
        quoteFor,
      } = { ...params, skipValidation };

      const client = new ZeroExApiClient(chainId, zeroExApiKey);

      if (buyToken && sellToken && quoteFor) {
        const quoteParam: ZeroExQuote = {
          buyToken: buyToken?.contractAddress,
          sellToken: sellToken?.contractAddress,
          affiliateAddress: ZEROEX_AFFILIATE_ADDRESS,
          feeRecipient: swapFees?.recipient,
          buyTokenPercentageFee: swapFees
            ? swapFees.amount_percentage / 100
            : undefined,
          skipValidation: canSkipValitaion,
        };

        if (account && !skipValidation) {
          quoteParam.takerAddress = account;
        }

        if (intentOnFilling && zeroExApiKey) {
          quoteParam.intentOnFilling = true;
        }

        if (maxSlippage !== undefined) {
          quoteParam.slippagePercentage = maxSlippage;
        }

        if (quoteFor === "buy" && buyTokenAmount?.gt(0)) {
          quoteParam.buyAmount = buyTokenAmount?.toString();
          return [quoteFor, await client.quote(quoteParam, { signal })];
        } else if (quoteFor === "sell" && sellTokenAmount?.gt(0)) {
          quoteParam.sellAmount = sellTokenAmount?.toString();
          return [quoteFor, await client.quote(quoteParam, { signal })];
        }
      }

      return null;
    },
    {
      enabled: Boolean(params) && enabled,
      refetchInterval: 10000,
      onSuccess,
    }
  );

  return {
    enabled,
    setParams,
    params,
    setEnabled,
    quoteQuery,
    setSkipValidation,
    setIntentOnFilling,
  };
}

export interface SwapExecParams {
  quote: ZeroExQuoteResponse;
  provider?: ethers.providers.Web3Provider;
  onHash: (hash: string) => void;
  sellToken: Token;
  buyToken: Token;
}

export function useSwapExec({
  onNotification,
}: {
  onNotification: (params: NotificationCallbackParams) => void;
}) {
  const { formatMessage } = useIntl();

  return useMutation(
    async ({
      quote,
      provider,
      onHash,
      sellToken,
      buyToken,
    }: SwapExecParams) => {
      if (!provider) {
        throw new Error("no provider");
      }

      const maxFeePerGas = (await provider.getFeeData()).maxFeePerGas;
      const maxPriorityFeePerGas = (await provider.getFeeData())
        .maxPriorityFeePerGas;

      if (!maxFeePerGas || !maxPriorityFeePerGas) {
        throw new Error("no max fee per gas");
      }

      const chainId = (await provider.getNetwork()).chainId;

      try {
        const tx = await provider.getSigner().sendTransaction({
          data: quote?.data,
          value: ethers.BigNumber.from(quote?.value),
          to: quote?.to,
        });

        onNotification({
          chainId,
          title: formatMessage({
            id: "swap.tokens",
            defaultMessage: "Swap Tokens", // TODO: add token symbols and amounts
          }),
          hash: tx.hash,
          params: {
            type: "swap",
            sellAmount: quote.sellAmount,
            buyAmount: quote.buyAmount,
            sellToken,
            buyToken,
          },
        });

        onHash(tx.hash);

        return await tx.wait();
      } catch (err) {
        throw err;
      }
    }
  );
}

export function useSwapState({
  execMutation,
  approveMutation,
  provider,
  defaultSellToken,
  defaultBuyToken,
  connector,
  connectorProvider,
  account,
  swapFees,
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
}: {
  zeroExApiKey?: string;
  execMutation: UseMutationResult<
    ethers.providers.TransactionReceipt,
    unknown,
    SwapExecParams,
    unknown
  >;
  approveMutation: UseMutationResult<
    unknown,
    unknown,
    {
      spender: string;
      amount: BigNumber;
      tokenAddress?: string;
      provider?: ethers.providers.Web3Provider;
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
  provider?: ethers.providers.BaseProvider;
  connectorProvider?: ethers.providers.Web3Provider;
  connector?: Connector;
  isActive?: boolean;
  isActivating?: boolean;
  account?: string;
  defaultSellToken?: Token;
  defaultBuyToken?: Token;
  transakApiKey?: string;
  onChangeNetwork: (chainId: ChainId) => void;
  onNotification: (params: NotificationCallbackParams) => void;
  onConnectWallet: () => void;
  onShowTransactions: () => void;
  maxSlippage: number;
  isAutoSlippage: boolean;
}) {
  const transak = useMemo(() => {
    if (transakApiKey) {
      return new transakSDK({
        apiKey: transakApiKey, // (Required)
        environment:
          process.env.NODE_ENV === "production" ? "PRODUCTION" : "STAGING", // (Required)
      });
    }
  }, [transakApiKey]);

  useEffect(() => {
    if (transak) {
      let allEventsCallback = transak.on(transak.ALL_EVENTS, (data: any) => {});

      // This will trigger when the user closed the widget
      let widgetCloseCallback = transak.on(
        transak.EVENTS.TRANSAK_WIDGET_CLOSE,
        (orderData: any) => {
          transak.close();
        }
      );

      // This will trigger when the user marks payment is made
      let orderSuccessFulCallback = transak.on(
        transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL,
        (orderData: any) => {
          transak.close();
        }
      );

      return () => {
        // TODO: remove callbacks;
      };
    }
  }, [transak]);

  const { wrapMutation, unwrapMutation } = useWrapToken({ onNotification });

  const [showSelect, setShowSelectToken] = useState(false);

  const [quoteFor, setQuoteFor] = useState<SwapSide>();

  const [sellToken, setSellToken] = useState<Token | undefined>();
  const [buyToken, setBuyToken] = useState<Token | undefined>();

  useEffect(() => {
    setSellToken(defaultSellToken);
    setBuyToken(defaultBuyToken);
  }, [defaultBuyToken, defaultSellToken]);

  const [sellAmount, setSellAmount] = useState<BigNumber>(BigNumber.from(0));
  const [buyAmount, setBuyAmount] = useState<BigNumber>(BigNumber.from(0));
  const [selectSide, setSelectSide] = useState<SwapSide>();

  const [showSettings, setShowSettings] = useState(false);

  const lazySellToken = useDebounce<Token | undefined>(sellToken, 500);
  const lazyBuyToken = useDebounce<Token | undefined>(buyToken, 500);
  const lazySellAmount = useDebounce<BigNumber>(sellAmount, 500);
  const lazyBuyAmount = useDebounce<BigNumber>(buyAmount, 500);
  const lazyQuoteFor = useDebounce<SwapSide>(quoteFor, 500);

  const [showConfirmSwap, setShowConfirmSwap] = useState(false);

  const sellTokenBalance = useTokenBalance({
    provider,
    account,
    contractAddress: lazySellToken?.contractAddress,
  });

  const buyTokenBalance = useTokenBalance({
    provider,
    account,
    contractAddress: lazyBuyToken?.contractAddress,
  });

  const handleQuoteSuccess = useCallback(
    (data?: [string, ZeroExQuoteResponse | null]) => {
      if (data) {
        const [quotedFor, quote] = data;

        if (quotedFor === "buy" && quote) {
          setSellAmount(BigNumber.from(quote?.sellAmount));
        } else if (quotedFor === "sell" && quote) {
          setBuyAmount(BigNumber.from(quote?.buyAmount));
        }

        setQuoteFor(undefined);
      }
    },
    [quoteFor]
  );

  const quote = useSwapQuote({
    onSuccess: handleQuoteSuccess,
    maxSlippage: !isAutoSlippage ? maxSlippage : undefined,
    zeroExApiKey,
    swapFees,
  });

  const { quoteQuery } = quote;

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
        isAddressEqual(token.contractAddress, buyToken.contractAddress)
      ) {
        handleSwapTokens();
      } else {
        setSellToken(token);
      }
    } else {
      if (
        token.chainId === sellToken?.chainId &&
        isAddressEqual(token.contractAddress, sellToken.contractAddress)
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
    (value: BigNumber) => {
      setQuoteFor("buy");

      if (buyToken) {
        setBuyAmount(value);
      }
    },
    [buyToken]
  );

  const handleChangeSellAmount = useCallback(
    (value: BigNumber) => {
      setQuoteFor("sell");
      if (sellToken) {
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
  };

  const chainId = useAsyncMemo<ChainId | undefined>(
    async (initial) => {
      if (provider) {
        return (await provider.getNetwork()).chainId;
      }
    },
    undefined,
    [provider]
  );

  const handleChangeNetwork = async (newChainId: ChainId) => {
    onChangeNetwork(newChainId);
    setQuoteFor(undefined);
    setSellAmount(BigNumber.from(0));
    setBuyAmount(BigNumber.from(0));
    setSellToken(undefined);
    setBuyToken(undefined);
    quote.setParams(undefined);
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

  const execType: ExecType = useAsyncMemo<ExecType>(
    async (initial) => {
      let result: ExecType = initial;

      const isBuyTokenWrapped =
        lazyBuyToken &&
        chainId &&
        isAddressEqual(
          WRAPED_TOKEN_ADDRESS[chainId],
          lazyBuyToken.contractAddress
        );

      const isSellTokenWrapped =
        lazySellToken &&
        chainId &&
        isAddressEqual(
          WRAPED_TOKEN_ADDRESS[chainId],
          lazySellToken.contractAddress
        );

      if (lazyBuyToken && lazySellToken && quoteQuery.data) {
        if (!isBuyTokenWrapped && !isSellTokenWrapped) {
          if (account) {
            const [, data] = quoteQuery.data;
            if (data) {
              const sufficientAllowance = await hasSufficientAllowance({
                spender: data.allowanceTarget,
                tokenAddress: data.sellTokenAddress,
                amount: BigNumber.from(data.sellAmount),
                provider,
                account,
              });

              if (!sufficientAllowance) {
                return "approve";
              }
            }
          }
        }

        const connectorChainId = (await connectorProvider?.getNetwork())
          ?.chainId;

        if (connectorChainId && chainId && chainId !== connectorChainId) {
          return "switch";
        }

        return "swap";
      }

      result =
        isBuyTokenWrapped &&
        isAddressEqual(
          lazySellToken?.contractAddress,
          ZEROEX_NATIVE_TOKEN_ADDRESS
        )
          ? "wrap"
          : isSellTokenWrapped &&
            isAddressEqual(
              lazyBuyToken?.contractAddress,
              ZEROEX_NATIVE_TOKEN_ADDRESS
            )
          ? "unwrap"
          : "swap";

      return result;
    },
    "quote",
    [
      connectorProvider,
      lazyBuyToken,
      lazySellToken,
      quoteQuery.data,
      account,
      lazySellAmount,
      provider,
      chainId,
    ]
  );

  const { enqueueSnackbar } = useSnackbar();

  const { formatMessage } = useIntl();

  const handleConfirmExecSwap = async () => {
    if (quoteQuery.data) {
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
              onHash: (hash: string) => {},
              sellToken,
              buyToken,
            },
            {
              onSuccess: (receipt: ethers.providers.TransactionReceipt) => {},
              onError,
            }
          );
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
    } else if (execType === "wrap") {
      await wrapMutation.mutateAsync(
        {
          provider: connectorProvider as providers.Web3Provider,
          amount: lazySellAmount,
          onHash: (hash: string) => {},
        },
        {
          onSuccess: (receipt: ethers.providers.TransactionReceipt) => {},
        }
      );
    } else if (execType === "approve" && quoteQuery.data) {
      const [, data] = quoteQuery.data;

      if (data && sellToken) {
        await approveMutation.mutateAsync(
          {
            spender: data.allowanceTarget,
            provider: connectorProvider as providers.Web3Provider,
            tokenAddress: data.sellTokenAddress,
            amount: ethers.constants.MaxUint256,
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
          onHash: (hash: string) => {},
        },
        {
          onSuccess: (receipt: ethers.providers.TransactionReceipt) => {
            quoteQuery.refetch();
          },
        }
      );
    } else if (execType === "switch" && connector && chainId) {
      switchNetwork(connector, chainId);
    }
  }, [
    quoteQuery.data,
    execType,
    lazySellAmount,
    sellToken,
    chainId,
    connector,
    connectorProvider,
  ]);

  useEffect(() => {
    (async () => {
      if (
        lazySellToken &&
        lazyBuyToken &&
        lazyQuoteFor &&
        (lazySellAmount || lazyBuyAmount)
      ) {
        if (execType === "wrap" || execType === "unwrap") {
          setBuyAmount(lazySellAmount);
        } else if (provider && lazyQuoteFor) {
          if (!quote.enabled) {
            quote.setEnabled(true);
          }

          quote.setParams({
            chainId: (await provider.getNetwork()).chainId,
            sellToken: lazySellToken,
            buyToken: lazyBuyToken,
            sellTokenAmount: lazySellAmount,
            buyTokenAmount: lazyBuyAmount,
            quoteFor: lazyQuoteFor,
            account,
          });
        }
      }
    })();
  }, [
    quote,
    lazyQuoteFor,
    lazySellAmount,
    lazyBuyAmount,
    lazySellToken,
    lazyBuyToken,
    execType,
    account,
    provider,
  ]);

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
    sellAmount: lazySellAmount,
    buyAmount: lazyBuyAmount,
    quoteFor: quote.params?.quoteFor,
    insufficientBalance: lazySellAmount?.gt(
      sellTokenBalance.data ?? BigNumber.from(0)
    ),
    isExecuting:
      wrapMutation.isLoading ||
      unwrapMutation.isLoading ||
      execMutation.isLoading ||
      approveMutation.isLoading,
    quote: quoteData,
    isQuoting: quoteQuery.isFetching,
    sellTokenBalance: sellTokenBalance.data,
    buyTokenBalance: buyTokenBalance.data,
    showConfirmSwap,
    showSettings,
    isProviderReady,
    recentTokens: recentTokens.tokens,
    setQuoteFor,
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

export function useSwapProvider({
  defaultChainId,
}: {
  defaultChainId?: ChainId;
  disableWallet?: boolean;
}) {
  return useMemo(() => {
    if (defaultChainId) {
      return new ethers.providers.JsonRpcProvider(
        NETWORKS[defaultChainId].providerRpcUrl
      );
    }
  }, [defaultChainId]);
}
