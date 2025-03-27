import { SignatureType } from "@0x/protocol-utils";
import {
  ChainId,
  useApproveToken,
  useErc20BalanceQuery,
  useTokenAllowanceQuery,
  ZEROEX_NATIVE_TOKEN_ADDRESS,
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
import { BigNumber } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import {
  concat,
  erc20Abi,
  Hex,
  maxUint256,
  numberToHex,
  publicActions,
  size,
} from "viem";
import {
  useClient,
  useSendTransaction,
  useSignTypedData,
  useSimulateContract,
  useWriteContract,
} from "wagmi";
import { EXCHANGE_NOTIFICATION_TYPES } from "../../../constants/messages";
import { useZrxPriceQuery, useZrxQuoteQuery } from "../../../hooks/zrx";
import { useMarketTradeGaslessExec } from "../../../hooks/zrx/useMarketTradeGaslessExec";
import { useMarketTradeGaslessState } from "../../../hooks/zrx/useMarketTradeGaslessState";
import { getZrxExchangeAddress, splitSignature } from "../../../utils";
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
  const { sendTransactionAsync } = useSendTransaction();
  const { signTypedDataAsync } = useSignTypedData();
  const client = useClient()?.extend(publicActions);
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

  const approveMutation = useApproveToken();
  const kitAmount =
    amount && Number(amount) > 0
      ? parseUnits(amount, baseToken.decimals).toString()
      : undefined;

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
          address: side === "buy" ? quoteToken.address : baseToken.address,
        },
        buyToken: {
          address: side === "buy" ? baseToken.address : quoteToken.address,
        },
      })
    ) {
      return true;
    }

    return false;
  }, [useGasless, chainId, quoteToken?.address, baseToken?.address, side]);

  const priceQuery = useZrxPriceQuery({
    params: {
      sellAmount: kitAmount,
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

  const price = priceQuery.data;

  const quoteQuery = useZrxQuoteQuery({
    params: {
      sellAmount: side === "buy" ? price?.buyAmount : price?.sellAmount,
      buyToken: side === "buy" ? baseToken.address : quoteToken.address,
      sellToken: side === "buy" ? quoteToken.address : baseToken.address,
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

  const quote = quoteQuery.data;

  const marketTradeGasless = useMarketTradeGaslessExec({
    onNotification: createNotification,
  });

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account,
    provider,
    spender: getZrxExchangeAddress(chainId),
    tokenAddress: quote?.sellToken,
  });

  const [formattedCost, hasSufficientBalance] = useMemo(() => {
    if (side === "buy" && price && quoteTokenBalance && quoteToken) {
      const total = formatBigNumber(
        BigNumber.from(price.buyAmount),
        quoteToken.decimals
      );

      const hasAmount = quoteTokenBalance.gte(BigNumber.from(price.buyAmount));

      return [total, hasAmount];
    }

    if (
      side === "sell" &&
      price &&
      baseTokenBalance &&
      baseToken &&
      quoteToken
    ) {
      const total = formatBigNumber(
        BigNumber.from(price.buyAmount),
        quoteToken.decimals
      );

      const hasAmount = baseTokenBalance.gte(BigNumber.from(price.sellAmount));

      return [total, hasAmount];
    }

    return ["0.0", false];
  }, [price, quoteTokenBalance, quoteToken, side, baseToken, baseTokenBalance]);

  const [hash, setHash] = useState<string>();
  const [tradeHash, setTradeHash] = useState<string>();
  const [approvalSignature, setApprovalSignature] = useState<string>();
  const trackUserEvent = useTrackUserEventsMutation();
  const gaslessTradeStatus = useMarketTradeGaslessState({ chainId, tradeHash });

  const simulateApproveRequest = useSimulateContract({
    abi: erc20Abi,
    address: quote?.sellToken as Hex,
    functionName: "approve",
    args: [quote?.issues.allowance?.spender, maxUint256],
  });

  const { writeContractAsync } = useWriteContract();

  const waitTxResult = useWaitTransactionConfirmation({
    transactionHash: hash,
    provider,
  });

  const signTypeDataMutation = useSignTypeData();

  const sendTxMutation = useMutation(async () => {
    if (amount && chainId && quote) {
      if (canGasless) {
        const data = quote as unknown as ZeroExGaslessQuoteResponse;

        const tokenApprovalRequired = data.issues.allowance != null;
        const gaslessApprovalAvailable = data.approval != null;

        let successfulTradeHash: any = null;

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
            if (quote.issues.allowance !== null) {
              try {
                const simulateRequest = await simulateApproveRequest;

                console.log(
                  "Approving Permit2 to spend sellToken...",
                  simulateApproveRequest
                );

                const tx = await writeContractAsync({
                  abi: erc20Abi,
                  address: quote?.sellToken as Hex,
                  functionName: "approve",
                  args: simulateRequest.data?.request.args!,
                });

                await provider?.waitForTransaction(tx);

                await quoteQuery.refetch();
              } catch (error) {
                console.log("Error approving Permit2:", error);
                return;
              }
            } else {
              console.log("USDC already approved for Permit2");
            }
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

          successfulTradeHash =
            await marketTradeGasless.mutateAsync(requestBody);

          if (successfulTradeHash) {
            const subType = side == "buy" ? "marketBuy" : "marketSell";
            const messageType = EXCHANGE_NOTIFICATION_TYPES[
              subType
            ] as AppNotificationType;

            gaslessTrades.push({
              type: subType,
              chainId,
              tradeHash: successfulTradeHash,
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

            setTradeHash(successfulTradeHash);
          }
        } catch (error) {
          console.error("Error submitting the gasless swap", error);
        }
      } else {
        if (quote?.sellToken === ZEROEX_NATIVE_TOKEN_ADDRESS) {
          console.log("Native token detected, no need for allowance check");
        } else if (quote?.issues.allowance !== null) {
          try {
            const simulateRequest = await simulateApproveRequest;

            console.log(
              "Approving Permit2 to spend sellToken...",
              simulateApproveRequest
            );

            const tx = await writeContractAsync({
              abi: erc20Abi,
              address: quote?.sellToken as Hex,
              functionName: "approve",
              args: simulateRequest.data?.request.args!,
            });

            await provider?.waitForTransaction(tx);

            await quoteQuery.refetch();
          } catch (error) {
            console.log("Error approving Permit2:", error);
            return;
          }
        }

        let signature: Hex | undefined;
        let hash: Hex | undefined;

        if (quote.permit2?.eip712) {
          signature = await signTypedDataAsync(quote.permit2.eip712);

          const signatureLengthInHex = numberToHex(
            size(signature as `0x${string}`),
            {
              signed: false,
              size: 32,
            }
          );

          const transactionData = quote.transaction.data as Hex;
          const sigLengthHex = signatureLengthInHex as Hex;
          const sig = signature as Hex;

          quote.transaction.data = concat([transactionData, sigLengthHex, sig]);
        }

        const nonce = await client?.getTransactionCount({
          address: account! as Hex,
        });

        if (quote?.sellToken === ZEROEX_NATIVE_TOKEN_ADDRESS) {
          // Directly sign and send the native token transaction
          hash = await sendTransactionAsync({
            account: account! as Hex,
            chainId: client!.chain.id,
            gas: !!quote?.transaction.gas
              ? BigInt(quote?.transaction.gas)
              : undefined,
            to: quote?.transaction.to,
            data: quote.transaction.data,
            value: BigInt(quote.transaction.value),
            gasPrice: !!quote?.transaction.gasPrice
              ? BigInt(quote?.transaction.gasPrice)
              : undefined,
            nonce,
          });

          console.log("Transaction hash:", hash);
          console.log(`See tx details at https://basescan.org/tx/${hash}`);
        } else if (signature && quote.transaction.data) {
          hash = await sendTransactionAsync({
            chainId: chainId,
            data: quote.transaction.data,
            gas: quote.transaction.gas,
            gasPrice: quote.transaction.gasPrice,
            nonce: nonce,
            to: quote.transaction.to,
            value: quote.transaction.value,
          });

          console.log("Transaction hash:", hash);
          console.log(`See tx details at https://basescan.org/tx/${hash}`);
        } else {
          console.error("Failed to obtain a signature, transaction not sent.");
        }

        const subType = side == "buy" ? "marketBuy" : "marketSell";
        const messageType = EXCHANGE_NOTIFICATION_TYPES[
          subType
        ] as AppNotificationType;

        createNotification({
          type: "transaction",
          icon: messageType.icon,
          subtype: subType,
          metadata: {
            hash,
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
          hash,
          chainId,
          metadata: JSON.stringify({
            quote,
          }),
        });

        setHash(hash);
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

  const handleConfirm = async () => {
    await quoteQuery.refetch();
    await sendTxMutation.mutateAsync();
  };

  const handleExecute = () => {
    setShowReview(true);
  };

  const { chainId: providerChainId, connector } = useWeb3React();
  const switchNetworkMutation = useSwitchNetworkMutation();

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

    if (priceQuery?.isError) {
      if (priceQuery?.error) {
        const errorResponse = (priceQuery?.error as any)?.response;

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
          priceQuery.isLoading || !hasSufficientBalance || priceQuery.isError
        }
        size="large"
        fullWidth
        startIcon={
          priceQuery.isLoading ? <CircularProgress size={"small"} /> : undefined
        }
        variant="contained"
        onClick={handleExecute}
      >
        {errorMsg ? (
          <>{errorMsg}</>
        ) : priceQuery.isLoading ? (
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
        chainId={chainId}
        pendingHash={gaslessTradeStatus?.successTxGasless?.hash}
        hash={hash || gaslessTradeStatus?.confirmedTxGasless?.hash}
        reasonFailedGasless={gaslessTradeStatus?.reasonFailedGasless}
        quoteToken={quoteToken}
        baseToken={baseToken}
        baseAmount={BigNumber.from(price?.sellAmount || 0)}
        quoteAmount={BigNumber.from(price?.buyAmount || 0)}
        side={side}
        isPlacingOrder={
          sendTxMutation.isLoading ||
          waitTxResult.isFetching ||
          gaslessTradeStatus?.isLoadingStatusGasless
        }
        onConfirm={handleConfirm}
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
                        {priceQuery.isLoading ? (
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
