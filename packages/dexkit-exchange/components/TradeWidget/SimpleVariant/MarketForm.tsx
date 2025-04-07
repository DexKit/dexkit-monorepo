import { ChainId, useErc20BalanceQuery } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import {
  formatBigNumber,
  getChainName,
  isAddressEqual,
} from "@dexkit/core/utils";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { useSwitchNetworkMutation } from "@dexkit/ui/hooks";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import {
  useSendTxMutation,
  useZrxPriceQuery,
  useZrxQuoteQuery,
} from "@dexkit/ui/hooks/zrx";
import { useCanGasless } from "@dexkit/ui/modules/swap/hooks";
import { useIsGaslessSupportedToken } from "@dexkit/ui/modules/swap/hooks/useIsGaslessSupportedToken";
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

import { useGaslessTrades } from "@dexkit/ui/modules/swap/hooks/useGaslessTrades";
import type { providers } from "ethers";
import { BigNumber } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useMarketTradeGaslessState } from "../../../hooks/zrx/useMarketTradeGaslessState";
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
  const [showReview, setShowReview] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [selectedQuoteToken, setSelectedQuoteToken] = useState<Token>();
  const trackUserEvent = useTrackUserEventsMutation();
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
  const [gaslessTrades] = useGaslessTrades();
  console.log("gaslessTrades", gaslessTrades);
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

  const kitAmount =
    amount && Number(amount) > 0
      ? parseUnits(amount, baseToken.decimals).toString()
      : undefined;

  const isTokenGaslessSupported = useIsGaslessSupportedToken({
    chainId,
    useGasless,
    sellToken: side === "buy" ? quoteToken.address : baseToken.address,
  });

  const canGasless = useCanGasless({
    enabled: !!useGasless && isTokenGaslessSupported,
    side,
    sellToken: side === "buy" ? baseToken : quoteToken,
    chainId: chainId!,
    buyToken: side === "buy" ? baseToken : quoteToken,
  });

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
      taker: account || "",
      buyTokenPercentageFee,
      chainId: chainId!,
    },
    useGasless: canGasless,
  });

  const quote = quoteQuery.data;

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
  const gaslessTradeStatus = useMarketTradeGaslessState({
    chainId,
    tradeHash,
    canGasless,
  });

  const sendTxMutation = useSendTxMutation({
    amount,
    account,
    chainId,
    quote,
    canGasless,
    provider,
    quoteQuery,
    side,
    baseToken,
    formattedCost,
    quoteToken,
  });

  const handleCloseReview = () => {
    baseTokenBalanceQuery.refetch();
    quoteTokenBalanceQuery.refetch();
    setShowReview(false);
    setHash(undefined);
    setTradeHash(undefined);
  };

  const handleConfirm = async () => {
    await quoteQuery.refetch();
    const hash = await sendTxMutation.mutateAsync();
    setHash(hash);
    setTradeHash(hash);
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
          sendTxMutation.isLoading || (canGasless && gaslessTrades.length > 0)
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
