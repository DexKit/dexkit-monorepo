import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { BigNumber, providers } from "ethers";
import { FormattedMessage } from "react-intl";
import { ExecType, SwapSide } from "../types";

import { ChainId } from "@dexkit/core/constants/enums";
import { Token } from "@dexkit/core/types";
import { SwitchNetworkButton } from "@dexkit/ui/components/SwitchNetworkButton";
import {
  ZeroExGaslessQuoteResponse,
  ZeroExQuoteResponse,
} from "@dexkit/ui/modules/swap/types";
import { SwapVert } from "@mui/icons-material";
import type { UseQueryResult } from "@tanstack/react-query";
import { SUPPORTED_SWAP_CHAIN_IDS } from "../constants/supportedChainIds";
import SwapTokenFieldMinimal from "./SwapTokenFieldMinimal";

export interface SwapMinimalProps {
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
  onToggleChangeNetwork: () => void;
  onExec: () => void;
  onSetToken?: (token?: Token) => void;
  keepTokenAlwaysPresent?: boolean;
  lockedToken?: Token;
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
}

export default function SwapMinimal({
  chainId,
  selectedChainId,
  quoteFor,
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
  isActive,
  featuredTokensByChain,
  onSelectToken,
  onSwapTokens,
  onChangeSellAmount,
  onChangeBuyAmount,
  onToggleChangeNetwork,
  onExec,
  onSetToken,
  keepTokenAlwaysPresent = false,
  lockedToken,
  swapFees,
}: SwapMinimalProps) {
  const isNetworkSupported = chainId && SUPPORTED_SWAP_CHAIN_IDS.includes(chainId);

  if (!isNetworkSupported) {
    return (
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Typography variant="body2" color="text.secondary" mb={2}>
          <FormattedMessage
            id="network.not.supported"
            defaultMessage="Network not supported"
          />
        </Typography>
        <SwitchNetworkButton desiredChainId={ChainId.Ethereum} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 360, mx: 'auto', p: 1 }}>
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
          <SwapTokenFieldMinimal
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
            sx={{
              position: 'relative',
              zIndex: 2,
              my: -1,
            }}
          >
            <IconButton
              onClick={onSwapTokens}
              size="small"
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'rotate(180deg)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <SwapVert fontSize="small" />
            </IconButton>
          </Box>

          <SwapTokenFieldMinimal
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

      <Box sx={{ mt: 1.5 }}>
        {!isActive ? (
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!isProviderReady}
            onClick={onExec}
            sx={{
              py: 1.2,
              fontWeight: 500,
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
            sx={{ py: 1.2 }}
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
            sx={{
              py: 1.2,
              fontWeight: 500,
            }}
          >
            {isExecuting ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <CircularProgress size={18} color="inherit" />
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