import { ChainId, useErc20BalanceQuery } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import {
  formatBigNumber,
  getChainName,
  isAddressEqual,
} from "@dexkit/core/utils";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { useSwitchNetworkMutation } from "@dexkit/ui/hooks";
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
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";

import { ConnectButton } from "@dexkit/ui/components/ConnectButton";
import { ZEROEX_AFFILIATE_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import { useGaslessTrades } from "@dexkit/ui/modules/swap/hooks/useGaslessTrades";
import { getSwapFeeTokenAddress } from "@dexkit/ui/modules/swap/utils";
import type { providers } from "ethers";
import { BigNumber } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useExchangeContext } from "../../../hooks";
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
  const theme = useTheme();
  const { mode } = useColorScheme();
  const { variant, glassSettings } = useExchangeContext();
  const isGlassVariant = variant === "glass";
  const isDarkMode = mode === 'dark';
  const textColor = isGlassVariant
    ? (glassSettings?.textColor || 'rgba(255, 255, 255, 0.95)')
    : (isDarkMode ? '#ffffff' : theme.palette.text.primary);
  const secondaryTextColor = isGlassVariant
    ? (glassSettings?.textColor || 'rgba(255, 255, 255, 0.7)')
    : (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary);
  const fillButtonBackgroundColor = glassSettings?.fillButtonBackgroundColor || theme.palette.primary.main;
  const fillButtonTextColor = glassSettings?.fillButtonTextColor || theme.palette.primary.contrastText;
  const fillButtonHoverBackgroundColor = glassSettings?.fillButtonHoverBackgroundColor || theme.palette.primary.dark;
  const fillButtonHoverTextColor = glassSettings?.fillButtonHoverTextColor || theme.palette.primary.contrastText;
  const fillButtonDisabledBackgroundColor = glassSettings?.fillButtonDisabledBackgroundColor || theme.palette.action.disabled;
  const fillButtonDisabledTextColor = glassSettings?.fillButtonDisabledTextColor || theme.palette.action.disabledBackground;

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
    sellToken: baseToken,
    chainId: chainId!,
    buyToken: quoteToken,
  });

  const priceQuery = useZrxPriceQuery({
    params: {
      sellAmount: kitAmount,
      buyToken: quoteToken.address,
      sellToken: baseToken.address,
      affiliateAddress: affiliateAddress ? affiliateAddress : "",
      slippageBps: slippage ? slippage * 100 * 100 : 100,
      taker: account || "",
      feeRecipient,
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
      slippageBps: slippage ? slippage * 100 * 100 : 100,
      taker: account || "",
      chainId: chainId!,
      swapFeeRecipient: feeRecipient || ZEROEX_AFFILIATE_ADDRESS,
      swapFeeBps: buyTokenPercentageFee
        ? buyTokenPercentageFee * 100 * 100
        : 30,
      swapFeeToken: getSwapFeeTokenAddress({
        sellTokenAddress: side === "buy" ? price?.buyAmount : price?.sellAmount,
        buyTokenAddress:
          side === "buy" ? quoteToken.address : baseToken.address,
      }),
      tradeSurplusRecipient: ZEROEX_AFFILIATE_ADDRESS,
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
    chainId,
    quote,
    canGasless,
    provider,
    quoteQuery,
    side,
    sellToken: side === "buy" ? quoteToken : baseToken,
    buyAmount: side === "buy" ? amount! : formattedCost,
    buyToken: side === "buy" ? baseToken : quoteToken,
    sellAmount: side === "buy" ? formattedCost : amount!,
  });

  const handleCloseReview = useCallback(() => {
    setShowReview(false);
    setHash(undefined);
    setTradeHash(undefined);
  }, [setShowReview, setHash, setTradeHash]);

  const handleConfirm = async () => {
    await sendTxMutation.mutateAsync();

    if (!canGasless) {
      handleCloseReview();
    }
  };

  const handleExecute = () => {
    setShowReview(true);
  };

  const { chainId: providerChainId } = useWeb3React();
  const switchNetworkMutation = useSwitchNetworkMutation();

  const renderActionButton = useCallback(() => {
    if (!providerChainId) {
      return (
        <ConnectButton
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        />
      );
    }

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
          priceQuery.isFetching || !hasSufficientBalance || priceQuery.isError
        }
        size="large"
        fullWidth
        startIcon={
          priceQuery.isFetching ? (
            <CircularProgress size={"small"} />
          ) : undefined
        }
        variant="contained"
        onClick={handleExecute}
        sx={{
          backgroundColor: `${fillButtonBackgroundColor} !important`,
          color: `${fillButtonTextColor} !important`,
          fontWeight: theme.typography.fontWeightMedium,
          textTransform: 'none',
          borderRadius: isGlassVariant ? theme.spacing(2) : theme.spacing(1),
          transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.short,
            easing: theme.transitions.easing.easeInOut,
          }),
          '&:hover:not(:disabled)': {
            backgroundColor: `${fillButtonHoverBackgroundColor} !important`,
            color: `${fillButtonHoverTextColor} !important`,
            transform: isGlassVariant
              ? `translateY(-${theme.spacing(0.25)}) scale(1.02)`
              : `translateY(-${theme.spacing(0.125)})`,
          },
          '&:active:not(:disabled)': {
            transform: isGlassVariant
              ? `translateY(-${theme.spacing(0.125)}) scale(0.98)`
              : 'translateY(0)',
          },
          '&:disabled, &.Mui-disabled': {
            backgroundColor: `${fillButtonDisabledBackgroundColor} !important`,
            color: `${fillButtonDisabledTextColor} !important`,
            opacity: '1 !important',
          },
        }}
      >
        {errorMsg ? (
          <>{errorMsg}</>
        ) : priceQuery.isFetching ? (
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
    providerChainId,
    chainId,
    priceQuery.isError,
    priceQuery.isFetching,
    priceQuery?.error,
    hasSufficientBalance,
    amount,
    side,
    quoteToken.symbol,
    baseToken.symbol,
    switchNetworkMutation,
    fillButtonBackgroundColor,
    fillButtonTextColor,
    fillButtonHoverBackgroundColor,
    fillButtonHoverTextColor,
    fillButtonDisabledBackgroundColor,
    fillButtonDisabledTextColor,
    isGlassVariant,
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <LazyDecimalInput onChange={handleChangeAmount} token={baseToken} />
        </Box>

        <Box sx={{ visibility: provider ? "visible" : "hidden" }}>
          {side === "buy" ? (
            <Typography variant="body2" color={textColor}>
              <FormattedMessage id="available" defaultMessage="Available" />:{" "}
              {quoteTokenBalanceQuery.isLoading ? (
                <Skeleton sx={{ minWidth: theme.spacing(6.25) }} />
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
              color={textColor}
              sx={{ visibility: account ? "visible" : "hidden" }}
            >
              <FormattedMessage id="available" defaultMessage="Available" />:{" "}
              {baseTokenBalanceQuery.isLoading ? (
                <Skeleton sx={{ minWidth: theme.spacing(6.25) }} />
              ) : (
                <>
                  {baseTokenBalanceFormatted} {baseToken.symbol.toUpperCase()}
                </>
              )}
            </Typography>
          )}
        </Box>

        <Divider />

        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
            alignItems="center"
          >
            <Typography color={textColor}>
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
                <Typography color={textColor}>
                  {priceQuery.isFetching ? (
                    <Skeleton sx={{ minWidth: theme.spacing(6.25) }} />
                  ) : (
                    <>{formattedCost}</>
                  )}
                </Typography>

                <Button
                  sx={{
                    color: secondaryTextColor,
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
                  {filteredQuoteTokens.map((tk: any, key: any) => (
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
              <Typography color={textColor}>
                {quoteQuery.isFetching ? (
                  <Skeleton sx={{ minWidth: theme.spacing(6.25) }} />
                ) : (
                  <>
                    {formattedCost} {quoteToken.symbol.toUpperCase()}
                  </>
                )}
              </Typography>
            )}
          </Stack>
        </Box>

        <Box>
          {renderActionButton()}
        </Box>
      </Box>
    </>
  );
}
