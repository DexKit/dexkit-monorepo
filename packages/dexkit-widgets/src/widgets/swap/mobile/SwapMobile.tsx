import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Fab,
  Paper,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import { BigNumber, providers } from "ethers";
import { FormattedMessage } from "react-intl";
import { ExecType, SwapSide } from "../types";

import { ChainId } from "@dexkit/core/constants/enums";
import { Token } from "@dexkit/core/types";
import {
  ZeroExGaslessQuoteResponse,
  ZeroExQuoteResponse,
} from "@dexkit/ui/modules/swap/types";
import {
  CheckCircle,
  Speed,
  SwapVert,
  TouchApp,
  TrendingUp
} from "@mui/icons-material";
import type { UseQueryResult } from "@tanstack/react-query";
import { BigNumber as EthersBigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useRef, useState } from "react";
import { SUPPORTED_SWAP_CHAIN_IDS } from "../constants/supportedChainIds";
import SwapTokenFieldMobile from "./SwapTokenFieldMobile";

export interface SwapMobileProps {
  chainId?: ChainId;
  selectedChainId?: ChainId;
  currency: string;
  disabled?: boolean;
  quoteFor?: SwapSide;
  quoteQuery?: UseQueryResult<
    ZeroExGaslessQuoteResponse | ZeroExQuoteResponse | null
  >;
  provider?: providers.Web3Provider | providers.BaseProvider;
  account?: string;
  isActivating?: boolean;
  isActive?: boolean;
  isAutoSlippage?: boolean;
  maxSlippage?: number;
  priceBuy?: string;
  priceBuyLoading?: boolean;
  priceSell?: string;
  priceSellLoading?: boolean;
  sellToken?: Token;
  buyToken?: Token;
  sellAmount: BigNumber;
  buyAmount: BigNumber;
  execType?: ExecType;
  quote?: ZeroExGaslessQuoteResponse | ZeroExQuoteResponse | null;
  isExecuting: boolean;
  clickOnMax: boolean;
  sellTokenBalance?: BigNumber;
  buyTokenBalance?: BigNumber;
  insufficientBalance?: boolean;
  isProviderReady?: boolean;
  isQuoting?: boolean;
  disableNotificationsButton?: boolean;
  enableBuyCryptoButton?: boolean;
  disableFooter?: boolean;
  networkName?: string;
  featuredTokensByChain: Token[];
  onSelectToken: (selectFor: SwapSide, token?: Token) => void;
  onSwapTokens: () => void;
  onChangeSellAmount: (value: BigNumber, clickOnMax?: boolean) => void;
  onChangeBuyAmount: (value: BigNumber, clickOnMax?: boolean) => void;
  onChangeNetwork: (chanId: ChainId) => void;
  onToggleChangeNetwork: () => void;
  onShowSettings: () => void;
  onShowTransactions: () => void;
  onExec: () => void;
  onShowTransak?: () => void;
  onSetToken?: (token?: Token) => void;
  nativeCurrencyPriceQuery?: UseQueryResult<number>;
}

export default function SwapMobile({
  chainId,
  selectedChainId,
  currency,
  disabled,
  quoteFor,
  quoteQuery,
  provider,
  account,
  isActivating,
  isActive,
  isAutoSlippage,
  maxSlippage,
  priceBuy,
  priceBuyLoading,
  priceSell,
  priceSellLoading,
  sellToken,
  buyToken,
  sellAmount,
  buyAmount,
  execType,
  quote,
  isExecuting,
  clickOnMax,
  sellTokenBalance,
  buyTokenBalance,
  insufficientBalance,
  isProviderReady,
  isQuoting,
  disableNotificationsButton,
  enableBuyCryptoButton,
  disableFooter,
  networkName,
  featuredTokensByChain,
  onSelectToken,
  onSwapTokens,
  onChangeSellAmount,
  onChangeBuyAmount,
  onChangeNetwork,
  onToggleChangeNetwork,
  onShowSettings,
  onShowTransactions,
  onExec,
  onShowTransak,
  onSetToken,
  nativeCurrencyPriceQuery,
}: SwapMobileProps) {
  const theme = useTheme();
  const [showQuoteDetails, setShowQuoteDetails] = useState(false);
  const [swapAnimation, setSwapAnimation] = useState(false);
  const swapRef = useRef<HTMLDivElement>(null);

  const isNetworkSupported = chainId && SUPPORTED_SWAP_CHAIN_IDS.includes(chainId);

  const calculatePriceImpact = (quote: any, sellAmount: BigNumber, buyAmount: BigNumber) => {
    if (!quote || !sellAmount || !buyAmount || sellAmount.isZero() || buyAmount.isZero()) {
      return null;
    }

    try {
      const expectedBuyAmount = Number(quote.buyAmount);
      const actualSellAmount = Number(quote.sellAmount);

      const actualRate = expectedBuyAmount / actualSellAmount;

      const marketRate = Number(buyAmount.toString()) / Number(sellAmount.toString());

      const priceImpact = Math.abs((actualRate - marketRate) / marketRate) * 100;

      return priceImpact;
    } catch (error) {
      return null;
    }
  };

  const handleSwapWithAnimation = () => {
    setSwapAnimation(true);
    setTimeout(() => {
      onSwapTokens();
      setSwapAnimation(false);
    }, 300);
  };

  if (!isNetworkSupported) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          textAlign: "center",
          borderRadius: 3,
          border: 1,
          borderColor: 'divider',
          mx: 2,
          my: 2,
        }}
      >
        <Typography variant="h6" gutterBottom color="text.secondary">
          <FormattedMessage
            id="network.not.supported"
            defaultMessage="Network not supported"
          />
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          <FormattedMessage
            id="tap.to.switch.network"
            defaultMessage="Tap to switch to a supported network"
          />
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={onToggleChangeNetwork}
          startIcon={<TouchApp />}
          sx={{ borderRadius: 3, py: 1.5 }}
        >
          <FormattedMessage id="switch.network" defaultMessage="Switch Network" />
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{
      maxWidth: 400,
      mx: 'auto',
      p: 2,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        mb={3}
        sx={{ pt: 2 }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          <FormattedMessage id="swap" defaultMessage="Swap" />
        </Typography>
      </Stack>

      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          flex: 1,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
        }}
      >
        <Stack spacing={0}>
          <SwapTokenFieldMobile
            token={sellToken}
            value={sellAmount}
            balance={sellTokenBalance}
            price={priceSell}
            priceLoading={priceSellLoading}
            onChange={onChangeSellAmount}
            onSelectToken={(token) => onSelectToken("sell", token)}
            showBalance
            isUserInput={quoteFor !== "sell"}
            featuredTokensByChain={featuredTokensByChain}
            onSetToken={onSetToken}
            selectedChainId={selectedChainId}
            title={<FormattedMessage id="you.pay" defaultMessage="You Pay" />}
          />

          <Box
            ref={swapRef}
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              position: 'relative',
              zIndex: 1,
              my: -2,
              height: 64,
            }}
          >
            <Fab
              onClick={handleSwapWithAnimation}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                width: 56,
                height: 56,
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
                transform: swapAnimation ? 'rotate(180deg) scale(1.2)' : 'rotate(0deg) scale(1)',
                boxShadow: theme.shadows[8],
              }}
            >
              <SwapVert sx={{ fontSize: 28 }} />
            </Fab>
          </Box>

          <SwapTokenFieldMobile
            token={buyToken}
            value={buyAmount}
            balance={buyTokenBalance}
            price={priceBuy}
            priceLoading={priceBuyLoading}
            onChange={onChangeBuyAmount}
            onSelectToken={(token) => onSelectToken("buy", token)}
            showBalance
            isUserInput={quoteFor !== "buy"}
            isBuyToken
            featuredTokensByChain={featuredTokensByChain}
            onSetToken={onSetToken}
            selectedChainId={selectedChainId}
            title={<FormattedMessage id="you.receive" defaultMessage="You Receive" />}
          />
        </Stack>
      </Paper>

      {quote && sellToken && buyToken && !sellAmount.isZero() && !buyAmount.isZero() && (
        <Paper
          elevation={2}
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 3,
            bgcolor: 'success.light',
            color: 'success.contrastText',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <CheckCircle sx={{ fontSize: 20 }} />
            <Typography variant="body2" fontWeight="bold">
              <FormattedMessage id="best.rate.found" defaultMessage="Best Rate Found!" />
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            1 {sellToken.symbol} = {(Number(buyAmount.toString()) / Number(sellAmount.toString())).toFixed(6)} {buyToken.symbol}
          </Typography>

          <Button
            size="small"
            variant="text"
            onClick={() => setShowQuoteDetails(!showQuoteDetails)}
            sx={{
              mt: 1,
              color: 'inherit',
              textTransform: 'none',
            }}
          >
            {showQuoteDetails ? 'Hide Details' : 'Show Details'}
          </Button>

          <Collapse in={showQuoteDetails}>
            <Stack spacing={1} sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption">Price Impact:</Typography>
                <Typography variant="caption" color="success.contrastText">
                  {(() => {
                    if (isQuoting) return '...';
                    if (!quote) return 'N/A';

                    const priceImpact = calculatePriceImpact(quote, sellAmount, buyAmount);
                    return priceImpact !== null ? `${priceImpact.toFixed(2)}%` : 'N/A';
                  })()}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption">Gas Fee:</Typography>
                <Typography variant="caption" color="text.secondary">
                  {(() => {
                    const totalFeeWei = (quote as any)?.totalNetworkFee;

                    if (!totalFeeWei || !nativeCurrencyPriceQuery?.data) {
                      return 'Fee not available';
                    }

                    const ethAmount = Number(formatEther(EthersBigNumber.from(totalFeeWei)));
                    const usdAmount = ethAmount * (nativeCurrencyPriceQuery?.data || 0);

                    return `$${usdAmount.toFixed(6)} (${ethAmount.toFixed(6)} ETH)`;
                  })()}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption">Route:</Typography>
                <Typography variant="caption">
                  {(quote as any)?.route?.fills?.[0]?.source || (isQuoting ? '...' : 'N/A')}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption">Slippage:</Typography>
                <Typography variant="caption">{maxSlippage || 0.5}%</Typography>
              </Stack>
            </Stack>
          </Collapse>
        </Paper>
      )}

      <Box sx={{ mt: 3, pb: 2 }}>
        {!isActive ? (
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!isProviderReady}
            onClick={onExec}
            startIcon={<TouchApp />}
            sx={{
              borderRadius: 3,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: theme.shadows[4],
            }}
          >
            <FormattedMessage id="connect.wallet" defaultMessage="Connect Wallet" />
          </Button>
        ) : execType === "switch" ? (
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={onToggleChangeNetwork}
            startIcon={<TouchApp />}
            sx={{
              borderRadius: 3,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            <FormattedMessage id="switch.network" defaultMessage="Switch Network" />
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={
              isExecuting ||
              isQuoting ||
              !sellToken ||
              !buyToken ||
              sellAmount.isZero() ||
              insufficientBalance
            }
            onClick={onExec}
            startIcon={
              isExecuting ? (
                <CircularProgress size={20} color="inherit" />
              ) : isQuoting ? (
                <Speed />
              ) : (
                <TrendingUp />
              )
            }
            sx={{
              borderRadius: 3,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: theme.shadows[4],
              '&:disabled': {
                opacity: 0.7,
              },
            }}
          >
            {isExecuting ? (
              <FormattedMessage id="swapping" defaultMessage="Swapping..." />
            ) : isQuoting ? (
              <FormattedMessage id="finding.best.price" defaultMessage="Finding best price..." />
            ) : insufficientBalance ? (
              <FormattedMessage id="insufficient.balance" defaultMessage="Insufficient balance" />
            ) : (
              <FormattedMessage id="swap.now" defaultMessage="Swap Now" />
            )}
          </Button>
        )}
      </Box>
    </Box>
  );
} 