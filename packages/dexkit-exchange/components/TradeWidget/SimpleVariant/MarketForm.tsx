import {
  ChainId,
  useApproveToken,
  useErc20BalanceQuery,
  useTokenAllowanceQuery,
} from "@dexkit/core";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import {
  formatBigNumber,
  getChainName,
  isAddressEqual,
} from "@dexkit/core/utils";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import {
  useDexKitContext,
  useSwitchNetworkMutation,
  useWaitTransactionConfirmation,
} from "@dexkit/ui/hooks";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { useSignTypeData } from "@dexkit/ui/hooks/web3/useSignTypeData";
import { SUPPORTED_GASLESS_CHAIN } from "@dexkit/ui/modules/swap/constants";
import { useGaslessTrades } from "@dexkit/ui/modules/swap/hooks/useGaslessTrades";
import { useIsGaslessSupportedToken } from "@dexkit/ui/modules/swap/hooks/useIsGaslessSupportedToken";
import { ZeroExGaslessQuoteResponse } from "@dexkit/ui/modules/swap/types";
import { isNativeInSell } from "@dexkit/ui/modules/swap/utils";
import { AppNotificationType } from "@dexkit/ui/types";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import type { providers } from "ethers";
import { BigNumber, utils } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { concat, Hex, numberToHex, size } from "viem";
import { useClient, useSignTypedData } from "wagmi";
import { EXCHANGE_NOTIFICATION_TYPES } from "../../../constants/messages";
import { useZrxQuoteQuery } from "../../../hooks/zrx";
import { useMarketTradeGaslessExec } from "../../../hooks/zrx/useMarketTradeGaslessExec";
import { useMarketTradeGaslessState } from "../../../hooks/zrx/useMarketTradeGaslessState";
import { getZrxExchangeAddress } from "../../../utils";
import LazyDecimalInput from "../LazyDecimalInput";
import ReviewMarketOrderDialog from "../ReviewMarketOrderDialog";

export interface MarketBuyFormProps {
  quoteToken: Token;
  baseToken: Token;
  quoteTokens?: Token[];
  side: "sell" | "buy";
  provider?: providers.Web3Provider;
  account?: string;
  slippage?: number;
  feeRecipient?: string;
  buyTokenPercentageFee?: number;
  affiliateAddress?: string;
  chainId?: ChainId;
  isActive?: boolean;
  useGasless?: boolean;
}

export default function MarketForm({
  chainId,
  baseToken: baseToken,
  quoteToken: defaultQuoteToken,
  account,
  side,
  provider,
  slippage,
  affiliateAddress,
  buyTokenPercentageFee,
  feeRecipient,
  quoteTokens,
  useGasless,
  isActive,
}: MarketBuyFormProps) {
  const { createNotification } = useDexKitContext();
  const [showReview, setShowReview] = useState(false);
  const [gaslessTrades, setGaslessTrades] = useGaslessTrades();
  const { signTypedDataAsync } = useSignTypedData();
  const client = useClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [selectedQuoteToken, setSelectedQuoteToken] = useState<Token>();

  const quoteToken = useMemo(() => {
    if (selectedQuoteToken) {
      return selectedQuoteToken;
    }
    return defaultQuoteToken;
  }, [selectedQuoteToken]);

  const filteredQuoteTokens = useMemo(() => {
    if (baseToken && quoteTokens) {
      return quoteTokens.filter(
        (tk) =>
          !(
            (isAddressEqual(baseToken.address, tk.address) &&
              baseToken.chainId === tk.chainId) ||
            (isAddressEqual(quoteToken.address, tk.address) &&
              quoteToken.chainId === tk.chainId)
          )
      );
    }
  }, [quoteToken, quoteTokens, baseToken]);

  const baseTokenBalanceQuery = useErc20BalanceQuery({
    account,
    provider,
    contractAddress: baseToken?.address,
  });

  const quoteTokenBalanceQuery = useErc20BalanceQuery({
    account,
    provider,
    contractAddress: quoteToken?.address,
  });

  const quoteTokenBalance = quoteTokenBalanceQuery.data;
  const baseTokenBalance = baseTokenBalanceQuery.data;

  const handleChangeAmount = useCallback((value?: string) => {
    setAmount(value);
  }, []);

  const [amount, setAmount] = useState<string | undefined>("0.0");

  const quoteTokenBalanceFormatted = useMemo(() => {
    if (quoteTokenBalance) {
      return formatBigNumber(quoteTokenBalance, quoteToken.decimals);
    }

    return "0.0";
  }, [quoteTokenBalance, quoteToken]);

  const baseTokenBalanceFormatted = useMemo(() => {
    if (baseTokenBalance) {
      return formatBigNumber(baseTokenBalance, baseToken.decimals);
    }

    return "0.0";
  }, [quoteTokenBalance, baseToken]);

  //const [quote, setQuote] = useState<ZeroExQuoteResponse>();

  const approveMutation = useApproveToken();
  const amountToTrade =
    amount && Number(amount) > 0
      ? parseUnits(amount, baseToken.decimals).toString()
      : undefined;

  const sideToBuy: any = {};
  if (side === "buy") {
    sideToBuy.buyAmount = amountToTrade;
  } else {
    sideToBuy.sellAmount = amountToTrade;
  }

  const isTokenGaslessSupported = useIsGaslessSupportedToken({
    chainId,
    useGasless,
    sellToken: side === "buy" ? quoteToken.address : baseToken.address,
  });

  const canGasless = useMemo(() => {
    if (
      isTokenGaslessSupported &&
      useGasless &&
      chainId &&
      SUPPORTED_GASLESS_CHAIN.includes(chainId) &&
      !isNativeInSell({
        side,
        sellToken: {
          address: side === "buy" ? baseToken.address : quoteToken.address,
        },
        buyToken: {
          address: side === "buy" ? quoteToken.address : baseToken.address,
        },
      })
    ) {
      return true;
    }
    return false;
  }, [useGasless, chainId, quoteToken?.address, baseToken?.address, side]);

  const quoteQuery = useZrxQuoteQuery({
    params: {
      sellAmount: amountToTrade,
      buyToken: quoteToken.address,
      sellToken: baseToken.address,
      affiliateAddress: affiliateAddress ? affiliateAddress : "",
      slippageBps: slippage ? slippage * 100 * 100 : undefined,
      slippagePercentage: slippage,
      taker: account || "",
      feeRecipient,
      buyTokenPercentageFee,
      chainId: chainId!,
    },
    useGasless: canGasless,
  });

  const marketTradeGasless = useMarketTradeGaslessExec({
    onNotification: createNotification,
  });

  const quote = quoteQuery.data;

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account,
    provider,
    spender: getZrxExchangeAddress(chainId),
    tokenAddress: quote?.sellToken,
  });

  const [formattedCost, hasSufficientBalance] = useMemo(() => {
    if (side === "buy" && quote && quoteTokenBalance && quoteToken) {
      const total = formatBigNumber(
        BigNumber.from(quote.buyAmount),
        quoteToken.decimals
      );

      const hasAmount = quoteTokenBalance.gte(BigNumber.from(quote.sellAmount));

      return [total, hasAmount];
    }

    if (
      side === "sell" &&
      quote &&
      baseTokenBalance &&
      baseToken &&
      quoteToken
    ) {
      const total = formatBigNumber(
        BigNumber.from(quote.buyAmount),
        quoteToken.decimals
      );

      const hasAmount = baseTokenBalance.gte(BigNumber.from(quote.sellAmount));

      return [total, hasAmount];
    }

    return ["0.0", false];
  }, [quote, quoteTokenBalance, quoteToken, side, baseToken, baseTokenBalance]);

  const [hash, setHash] = useState<string>();
  const [tradeHash, setTradeHash] = useState<string>();
  const [approvalSignature, setApprovalSignature] = useState<string>();
  const trackUserEvent = useTrackUserEventsMutation();
  const gaslessTradeStatus = useMarketTradeGaslessState({ chainId, tradeHash });

  const waitTxResult = useWaitTransactionConfirmation({
    transactionHash: hash,
    provider,
  });

  const signTypeDataMutation = useSignTypeData();

  const sendTxMutation = useMutation(async () => {
    if (amount && chainId && quote) {
      if (canGasless) {
        const data = quote as unknown as ZeroExGaslessQuoteResponse;

        if (data.trade) {
          const { eip712, type } = data.trade;
          const signature = await signTypeDataMutation.mutateAsync({
            domain: eip712.domain,
            value: eip712.message,
            primaryType: eip712.primaryType,
            types: eip712.types,
          });
          if (signature) {
            const sign = utils.splitSignature(signature);
            const trade = {
              type: type,
              eip712: eip712,
              signature: {
                v: sign.v,
                r: sign.r,
                s: sign.s,
                signatureType: 2,
              },
            };

            let approval;
            if (approvalSignature) {
              const signAppr = utils.splitSignature(approvalSignature);
              const { eip712: eip721Appr, type: ApprType } = data.approval;
              approval = {
                type: ApprType,
                eip712: eip721Appr,
                signature: {
                  v: signAppr.v,
                  r: signAppr.r,
                  s: signAppr.s,
                  signatureType: 2,
                },
              };
            }
            const trHash = await marketTradeGasless.mutateAsync({
              trade: trade,
              approval: approval,
              quote: data,
              chainId,
              sellToken: baseToken,
              buyToken: quoteToken,
              side,
            });
            if (trHash) {
              const subType = side == "buy" ? "marketBuy" : "marketSell";
              const messageType = EXCHANGE_NOTIFICATION_TYPES[
                subType
              ] as AppNotificationType;

              gaslessTrades.push({
                type: subType,
                chainId,
                tradeHash: trHash,
                icon: messageType.icon,
                values: {
                  sellAmount: amount,
                  sellTokenSymbol: baseToken.symbol.toUpperCase(),
                  buyAmount: formattedCost,
                  buyTokenSymbol: quoteToken.symbol.toUpperCase(),
                },
              });
              // We use this on gasless trade updater to issue swap trades notifications
              setGaslessTrades(gaslessTrades);

              setTradeHash(trHash);
            }
          }
        }
      } else {
        const { to, value } = quote.transaction;
        const { domain, types, message, primaryType } = quote.permit2.eip712;

        const signature = await signTypedDataAsync({
          domain,
          types,
          message,
          primaryType,
          account: account! as `0x${string}`,
        });

        const signatureLengthInHex = numberToHex(size(signature), {
          signed: false,
          size: 32,
        });

        const transactionData = quote.transaction.data as Hex;
        const sigLengthHex = signatureLengthInHex as Hex;
        const sig = signature as Hex;

        quote.transaction.data = concat([transactionData, sigLengthHex, sig]);

        const nonce = await provider?.getTransactionCount(account!);
        const tx = await provider?.getSigner().sendTransaction({
          data: quote.transaction.data,
          value: BigNumber.from(value),
          to,
          nonce,
          chainId,
          gasLimit: !!quote?.transaction.gas
            ? BigInt(quote?.transaction.gas)
            : undefined,
          gasPrice: !!quote?.transaction.gasPrice
            ? BigInt(quote?.transaction.gasPrice)
            : undefined,
        });

        const subType = side == "buy" ? "marketBuy" : "marketSell";
        const messageType = EXCHANGE_NOTIFICATION_TYPES[
          subType
        ] as AppNotificationType;

        createNotification({
          type: "transaction",
          icon: messageType.icon,
          subtype: subType,
          metadata: {
            hash: tx?.hash,
            chainId,
          },
          values: {
            sellAmount: amount,
            sellTokenSymbol: baseToken.symbol.toUpperCase(),
            buyAmount: formattedCost,
            buyTokenSymbol: quoteToken.symbol.toUpperCase(),
          },
        });

        trackUserEvent.mutate({
          event: side == "buy" ? UserEvents.marketBuy : UserEvents.marketSell,
          hash: tx?.hash,
          chainId,
          metadata: JSON.stringify({
            quote,
          }),
        });

        setHash(tx?.hash);
      }
    }
  });

  const handleCloseReview = () => {
    baseTokenBalanceQuery.refetch();
    quoteTokenBalanceQuery.refetch();
    setShowReview(false);
    setTradeHash(undefined);
    setApprovalSignature(undefined);
  };

  const handleApprove = async () => {
    if (canGasless) {
      const gaslessQuote =
        quoteQuery.data as unknown as ZeroExGaslessQuoteResponse;
      if (gaslessQuote?.approval && gaslessQuote?.approval.isRequired) {
        if (gaslessQuote.approval.isGasslessAvailable) {
          const { eip712 } = gaslessQuote.approval;
          const signature = await signTypeDataMutation.mutateAsync({
            domain: eip712.domain,
            value: eip712.message,
            primaryType: eip712.primaryType,
            types: eip712.types,
          });
          if (signature) {
            setApprovalSignature(signature);
          }
        } else {
          await approveMutation.mutateAsync({
            onSubmited: (hash: string) => {},
            amount: BigNumber.from(quote?.sellAmount),
            provider,
            spender: getZrxExchangeAddress(chainId),
            tokenContract: quote?.sellToken,
          });
          await quoteQuery.refetch();
        }
      }
    } else {
      await approveMutation.mutateAsync({
        onSubmited: (hash: string) => {},
        amount: BigNumber.from(quote?.sellAmount),
        provider,
        spender: quoteQuery.data?.issues.allowance?.spender,
        tokenContract: quote?.sellToken,
      });
      await quoteQuery.refetch();
    }
  };

  const handleConfirm = async () => {
    await sendTxMutation.mutateAsync();
  };

  const handleExecute = () => {
    setShowReview(true);
  };

  const { chainId: providerChainId, connector } = useWeb3React();
  const switchNetworkMutation = useSwitchNetworkMutation();

  const isApproval = useMemo(() => {
    if (canGasless) {
      const gaslessQuote =
        quoteQuery.data as unknown as ZeroExGaslessQuoteResponse;
      if (gaslessQuote?.approval) {
        return gaslessQuote?.approval?.isRequired && !approvalSignature;
      }
    } else {
      return quote?.issues.allowance !== null;
    }
  }, [
    tokenAllowanceQuery.data,
    quote?.sellAmount,
    canGasless,
    approvalSignature,
    quoteQuery.data,
  ]);

  const renderActionButton = useCallback(() => {
    if (providerChainId && chainId && providerChainId !== chainId) {
      return (
        <Button
          disabled={switchNetworkMutation.isLoading}
          size="large"
          fullWidth
          variant="contained"
          onClick={async () => {
            switchNetworkMutation.mutateAsync({ chainId });
          }}
        >
          <FormattedMessage
            id="switch.to.network"
            defaultMessage="Switch to {network}"
            values={{ network: getChainName(chainId) }}
          />
        </Button>
      );
    }
    let errorMsg = null;

    if (quoteQuery?.isError) {
      if (quoteQuery?.error) {
        const errorResponse = (quoteQuery?.error as any)?.response;

        if (
          errorResponse?.data.validationErrors &&
          Array.isArray(errorResponse?.data.validationErrors)
        ) {
          const validationError = errorResponse?.data.validationErrors[0];

          if (validationError?.reason) {
            errorMsg = validationError?.reason.split("_").join(" ");
          }
        }
      }
    }

    return (
      <Button
        disabled={
          quoteQuery.isLoading || !hasSufficientBalance || quoteQuery.isError
        }
        size="large"
        fullWidth
        startIcon={
          quoteQuery.isLoading ? <CircularProgress size={"small"} /> : undefined
        }
        variant="contained"
        onClick={handleExecute}
      >
        {errorMsg ? (
          <>{errorMsg}</>
        ) : quoteQuery.isLoading ? (
          <FormattedMessage
            id="loading.quote"
            defaultMessage="Loading quote..."
          />
        ) : !amount || amount === "0.0" ? (
          <FormattedMessage id="fill.amount" defaultMessage="Fill amount" />
        ) : !hasSufficientBalance ? (
          <FormattedMessage
            id="insufficient"
            defaultMessage="Insufficient {symbol}"
            values={{
              symbol:
                side === "buy"
                  ? quoteToken.symbol.toUpperCase()
                  : baseToken.symbol.toUpperCase(),
            }}
          />
        ) : side === "buy" ? (
          <FormattedMessage
            id="buy.symbol"
            defaultMessage="Buy {symbol}"
            values={{ symbol: baseToken.symbol.toUpperCase() }}
          />
        ) : (
          <FormattedMessage
            id="sell.symbol"
            defaultMessage="Sell {symbol}"
            values={{ symbol: baseToken.symbol.toUpperCase() }}
          />
        )}
      </Button>
    );
  }, [
    chainId,
    side,
    connector,
    providerChainId,
    baseToken,
    quoteToken,
    handleExecute,
    hasSufficientBalance,
  ]);

  return (
    <>
      <ReviewMarketOrderDialog
        DialogProps={{
          open: showReview,
          maxWidth: "sm",
          fullWidth: true,
          onClose: handleCloseReview,
        }}
        isApproving={
          approveMutation.isLoading || signTypeDataMutation.isLoading
        }
        isApproval={isApproval}
        chainId={chainId}
        price={quote?.price}
        pendingHash={gaslessTradeStatus?.successTxGasless?.hash}
        hash={hash || gaslessTradeStatus?.confirmedTxGasless?.hash}
        reasonFailedGasless={gaslessTradeStatus?.reasonFailedGasless}
        quoteToken={quoteToken}
        baseToken={baseToken}
        baseAmount={BigNumber.from(quote?.sellAmount || 0)}
        quoteAmount={BigNumber.from(quote?.buyAmount || 0)}
        side={side}
        isPlacingOrder={
          sendTxMutation.isLoading ||
          waitTxResult.isFetching ||
          gaslessTradeStatus?.isLoadingStatusGasless
        }
        onConfirm={handleConfirm}
        onApprove={handleApprove}
        canGasless={canGasless}
      />
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <LazyDecimalInput onChange={handleChangeAmount} token={baseToken} />
          </Grid>
          <Grid item xs={12}>
            {side === "buy" ? (
              <Typography variant="body2">
                <FormattedMessage id="available" defaultMessage="Available" />:{" "}
                {quoteTokenBalanceQuery.isLoading ? (
                  <Skeleton sx={{ minWidth: "50px" }} />
                ) : (
                  <>
                    {quoteTokenBalanceFormatted}{" "}
                    {quoteToken.symbol.toUpperCase()}
                  </>
                )}
              </Typography>
            ) : (
              <Typography
                variant="body2"
                sx={{ visibility: account ? "visible" : "hidden" }}
              >
                <FormattedMessage id="available" defaultMessage="Available" />:{" "}
                {baseTokenBalanceQuery.isLoading ? (
                  <Skeleton sx={{ minWidth: "50px" }} />
                ) : (
                  <>
                    {baseTokenBalanceFormatted} {baseToken.symbol.toUpperCase()}
                  </>
                )}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                  alignItems="center"
                >
                  <Typography>
                    {side === "buy" ? (
                      <FormattedMessage id="cost" defaultMessage="Cost" />
                    ) : (
                      <FormattedMessage
                        id="You will.receive"
                        defaultMessage="You will receive"
                      />
                    )}
                  </Typography>
                  {filteredQuoteTokens && filteredQuoteTokens.length > 0 ? (
                    <Box
                      display={"flex"}
                      alignContent={"center"}
                      alignItems={"center"}
                    >
                      <Typography color="text.secondary">
                        {quoteQuery.isLoading ? (
                          <Skeleton sx={{ minWidth: "50px" }} />
                        ) : (
                          <>{formattedCost}</>
                        )}
                      </Typography>

                      <Button
                        sx={{
                          color: "text.secondary",
                        }}
                        size={"large"}
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        {open ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                        {quoteToken.symbol.toUpperCase()}
                      </Button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        {filteredQuoteTokens.map((tk, key) => (
                          <MenuItem
                            onClick={() => {
                              setSelectedQuoteToken(tk);
                              handleClose();
                            }}
                            key={key}
                          >
                            {tk?.symbol.toUpperCase()}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      {quoteQuery.isLoading ? (
                        <Skeleton sx={{ minWidth: "50px" }} />
                      ) : (
                        <>
                          {formattedCost} {quoteToken.symbol.toUpperCase()}
                        </>
                      )}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12}>
            {renderActionButton()}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
