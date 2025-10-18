import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
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
import { Info, Settings, SwapVert } from "@mui/icons-material";
import type { UseQueryResult } from "@tanstack/react-query";
import { SUPPORTED_SWAP_CHAIN_IDS } from "../constants/supportedChainIds";
import SwapTokenFieldCompact from "./SwapTokenFieldCompact";

export interface SwapCompactProps {
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
  keepTokenAlwaysPresent?: boolean;
  lockedToken?: Token;
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
}

export default function SwapCompact({
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
  keepTokenAlwaysPresent = false,
  lockedToken,
  swapFees,
}: SwapCompactProps) {
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

  if (!isNetworkSupported) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          textAlign: "center",
          backgroundColor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: (theme) => theme.shape.borderRadius,
          minWidth: 280,
          boxShadow: (theme) => theme.shadows[2],
        }}
      >
        <Typography variant="body2" gutterBottom color="text.secondary">
          <FormattedMessage
            id="network.not.supported"
            defaultMessage="Network not supported"
          />
        </Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={onToggleChangeNetwork}
          sx={{ mt: 1 }}
        >
          <FormattedMessage id="switch.network" defaultMessage="Switch Network" />
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 320 }, mx: 'auto', p: { xs: 1, sm: 1.5 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
        sx={{ px: { xs: 0.5, sm: 1 } }}
      >
        <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
          <FormattedMessage id="swap" defaultMessage="Swap" />
        </Typography>
        <Tooltip title="Settings">
          <IconButton
            onClick={onShowSettings}
            size="small"
            sx={{ p: 0.5 }}
          >
            <Settings fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: (theme) => theme.shape.borderRadius,
          overflow: 'hidden',
          boxShadow: (theme) => theme.shadows[2],
        }}
      >
        <Stack spacing={0}>
          <SwapTokenFieldCompact
            token={sellToken}
            value={sellAmount}
            balance={sellTokenBalance}
            price={priceSell}
            priceLoading={priceSellLoading}
            onChange={onChangeSellAmount}
            onSelectToken={(token?: Token) => onSelectToken("sell", token)}
            showBalance
            isUserInput={quoteFor === "sell" && clickOnMax === false}
            featuredTokensByChain={featuredTokensByChain}
            onSetToken={onSetToken}
            selectedChainId={selectedChainId}
            keepTokenAlwaysPresent={keepTokenAlwaysPresent}
            lockedToken={lockedToken}
          />

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              position: 'relative',
              zIndex: 2,
              my: -0.5,
              height: 32,
            }}
          >
            <IconButton
              onClick={onSwapTokens}
              size="small"
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                width: 28,
                height: 28,
                '&:hover': {
                  bgcolor: 'primary.main',
                  borderColor: 'primary.main',
                  color: 'primary.contrastText',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <SwapVert fontSize="small" />
            </IconButton>
          </Box>

          <SwapTokenFieldCompact
            token={buyToken}
            value={buyAmount}
            balance={buyTokenBalance}
            price={priceBuy}
            priceLoading={priceBuyLoading}
            onChange={onChangeBuyAmount}
            onSelectToken={(token?: Token) => onSelectToken("buy", token)}
            showBalance
            isUserInput={quoteFor === "buy" && clickOnMax === false}
            isBuyToken
            featuredTokensByChain={featuredTokensByChain}
            onSetToken={onSetToken}
            selectedChainId={selectedChainId}
            keepTokenAlwaysPresent={keepTokenAlwaysPresent}
            lockedToken={lockedToken}
          />
        </Stack>
      </Paper>

      {quote && sellToken && buyToken && !sellAmount.isZero() && !buyAmount.isZero() && (
        <Box sx={{ mt: 1, px: { xs: 0.5, sm: 1 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Rate: 1 {sellToken.symbol} = {(Number(buyAmount.toString()) / Number(sellAmount.toString())).toFixed(4)} {buyToken.symbol}
            </Typography>
            <Tooltip title={
              (() => {
                if (isQuoting) return 'Calculating price impact...';
                if (!quote) return 'Price impact: N/A';

                const priceImpact = calculatePriceImpact(quote, sellAmount, buyAmount);
                return priceImpact !== null ? `Price impact: ${priceImpact.toFixed(2)}%` : 'Price impact: N/A';
              })()
            }>
              <Info sx={{ fontSize: 12, color: 'text.secondary' }} />
            </Tooltip>
          </Stack>
        </Box>
      )}

      <Box sx={{ mt: 1.2, px: { xs: 0.5, sm: 1 } }}>
        {!isActive ? (
          <Button
            fullWidth
            variant="contained"
            size="small"
            disabled={!isProviderReady}
            onClick={onExec}
            sx={{
              py: 0.8,
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            <FormattedMessage id="connect.wallet" defaultMessage="Connect Wallet" />
          </Button>
        ) : execType === "switch" ? (
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={onToggleChangeNetwork}
            sx={{ py: 0.8 }}
          >
            <FormattedMessage id="switch.network" defaultMessage="Switch Network" />
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            size="small"
            disabled={
              isExecuting ||
              isQuoting ||
              !sellToken ||
              !buyToken ||
              sellAmount.isZero() ||
              insufficientBalance
            }
            onClick={onExec}
            sx={{
              py: 0.8,
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {isExecuting ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress size={16} color="inherit" />
                <span>
                  <FormattedMessage id="swapping" defaultMessage="Swapping..." />
                </span>
              </Stack>
            ) : isQuoting ? (
              <FormattedMessage id="getting.quote" defaultMessage="Getting quote..." />
            ) : insufficientBalance ? (
              <FormattedMessage id="insufficient.balance" defaultMessage="Insufficient balance" />
            ) : (
              <FormattedMessage id="swap" defaultMessage="Swap" />
            )}
          </Button>
        )}
      </Box>
    </Box>
  );
} 