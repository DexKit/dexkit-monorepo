import {
  Alert,
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { BigNumber, providers } from "ethers";
import { FormattedMessage } from "react-intl";
import { ExecType, SwapSide } from "../types";

import { ChainId } from "@dexkit/core/constants/enums";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { useIsMobile } from "@dexkit/core/hooks";
import { Token } from "@dexkit/core/types";
import { SwitchNetworkButton } from "@dexkit/ui/components/SwitchNetworkButton";
import {
  ZeroExGaslessQuoteResponse,
  ZeroExQuoteResponse,
} from "@dexkit/ui/modules/swap/types";
import { CreditCard } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import WalletIcon from "@mui/icons-material/Wallet";
import type { UseQueryResult } from "@tanstack/react-query";
import { AppNotificationsBadge } from "../../../components/AppNotificationBadge";
import TransakIcon from "../../../components/icons/TransakIcon";
import { SUPPORTED_SWAP_CHAIN_IDS } from "../constants/supportedChainIds";
import SwapTokenFieldUniswap from "./SwapTokenFieldUniswap";

// @ts-ignore

export interface SwapProps {
  chainId?: ChainId;
  currency: string;
  disabled?: boolean;
  quoteFor?: SwapSide;
  quoteQuery?: UseQueryResult<
    ZeroExGaslessQuoteResponse | ZeroExQuoteResponse | unknown
  >;
  provider?: providers.Web3Provider | providers.BaseProvider;
  account?: string;
  isActivating?: boolean;
  isActive?: boolean;
  isAutoSlippage?: boolean;
  maxSlippage?: number;
  sellToken?: Token;
  buyToken?: Token;
  priceBuy?: string;
  priceBuyLoading?: boolean;
  priceSell?: string;
  priceSellLoading?: boolean;
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
  activeChainIds: number[];
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
}

import { useWalletConnect } from "@dexkit/ui/hooks/wallet";
import { useExecButtonMessage } from "../hooks/useExecButtonMessage";
import SwapFeeSummaryUniswap from "./SwapFeeSummaryUniswap";
import SwapSwitchTokensUniswapButton from "./SwapSwitchTokensUniswapButton";

export default function SwapUniswap({
  chainId,
  priceBuy,
  priceBuyLoading,
  priceSell,
  priceSellLoading,
  networkName,
  disabled,
  quoteFor,
  isActive,
  quoteQuery,
  execType,
  isQuoting,
  buyAmount,
  sellAmount,
  sellToken,
  buyToken,
  currency,
  provider,
  isExecuting,
  disableFooter,
  quote,
  clickOnMax,
  sellTokenBalance,
  buyTokenBalance,
  insufficientBalance,
  isProviderReady,
  disableNotificationsButton,
  enableBuyCryptoButton,
  onSelectToken,
  onSwapTokens,
  onChangeSellAmount,
  onChangeBuyAmount,
  onChangeNetwork,
  onShowSettings,
  onShowTransactions,
  onExec,
  activeChainIds,
  onShowTransak,
  onToggleChangeNetwork,
}: SwapProps) {
  const { connectWallet } = useWalletConnect();
  const handleSelectSellToken = (token?: Token) => {
    onSelectToken("sell", token);
  };

  const handleSelectBuyToken = (token?: Token) => {
    onSelectToken("buy", token);
  };

  const renderExecButtonMessage = useExecButtonMessage({
    quoteQuery,
    insufficientBalance,
    sellTokenSymbol: sellToken?.symbol,
    networkName,
    execType,
  });

  const isMobile = useIsMobile();

  return (
    <Box>
      <Stack spacing={1}>
        <Box>
          {chainId && !SUPPORTED_SWAP_CHAIN_IDS.includes(chainId) && (
            <Alert severity="warning">
              <FormattedMessage
                id="network.not.supported.msg"
                defaultMessage="Network not supported. Please change to a supported network: {networks}"
                values={{
                  networks: Object.values(NETWORKS)
                    .filter((n) => SUPPORTED_SWAP_CHAIN_IDS.includes(n.chainId))
                    .map((n, index, arr) =>
                      index !== arr.length - 1 ? ` ${n.name},` : ` ${n.name}.`
                    ),
                }}
              />
            </Alert>
          )}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <ButtonBase
              sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
                borderRadius: (theme) => theme.shape.borderRadius,
                px: 2,
                py: 1,
                fontWeight: "bold",
              }}
            >
              <FormattedMessage id="swap" defaultMessage="Swap" />
            </ButtonBase>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              {enableBuyCryptoButton && (
                <Button
                  onClick={onShowTransak}
                  size="small"
                  startIcon={<CreditCard />}
                >
                  <FormattedMessage
                    id="buy.crypto"
                    defaultMessage="Buy Crypto"
                  />
                </Button>
              )}
              {!disableNotificationsButton && (
                <IconButton size="small" onClick={onShowTransactions}>
                  <AppNotificationsBadge />
                </IconButton>
              )}
              <IconButton size="small" onClick={onShowSettings}>
                <SettingsIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
        {isQuoting && !disabled && (
          <LinearProgress color="primary" sx={{ height: "1px" }} />
        )}
        <Box>
          <Stack spacing={2}>
            <Stack>
              <SwapTokenFieldUniswap
                title={<FormattedMessage id="sell" defaultMessage="Sell" />}
                InputBaseProps={{ fullWidth: true }}
                onChange={onChangeSellAmount}
                onSelectToken={handleSelectSellToken}
                price={priceSell}
                priceLoading={priceSellLoading}
                token={sellToken}
                value={sellAmount}
                balance={sellTokenBalance}
                showBalance={isActive}
                isUserInput={quoteFor === "sell" && clickOnMax === false}
                disabled={isQuoting && quoteFor === "buy"}
              />
              <Stack alignItems="center">
                <Box
                  sx={(theme) => ({
                    marginTop: -2.25,
                    marginBottom: -2.25,
                  })}
                >
                  <SwapSwitchTokensUniswapButton
                    IconButtonProps={{ onClick: onSwapTokens }}
                  />
                </Box>
              </Stack>
              <SwapTokenFieldUniswap
                title={<FormattedMessage id="buy" defaultMessage="Buy" />}
                InputBaseProps={{ fullWidth: true }}
                onChange={onChangeBuyAmount}
                onSelectToken={handleSelectBuyToken}
                price={priceBuy}
                priceLoading={priceBuyLoading}
                token={buyToken}
                value={buyAmount}
                balance={buyTokenBalance}
                showBalance={isActive}
                isUserInput={quoteFor === "buy" && clickOnMax === false}
                disabled={isQuoting && quoteFor === "sell"}
              />
            </Stack>
            {quote && (
              <SwapFeeSummaryUniswap
                quote={quote}
                chainId={chainId}
                currency={currency}
                sellToken={sellToken}
                buyToken={buyToken}
                provider={provider}
              />
            )}
            {insufficientBalance && isActive && (
              <Alert severity="error">
                <FormattedMessage
                  id="insufficient.symbol.balance"
                  defaultMessage="Insufficient {symbol} balance"
                  values={{ symbol: sellToken?.symbol.toUpperCase() }}
                />
              </Alert>
            )}
            {onShowTransak && insufficientBalance && isActive && (
              <Button
                startIcon={<TransakIcon />}
                onClick={onShowTransak}
                variant="outlined"
                color="primary"
              >
                <FormattedMessage
                  id="buy.crypto.with.transak"
                  defaultMessage="Buy crypto with Transak"
                />
              </Button>
            )}
            {isActive ? (
              execType === "switch" ? (
                <SwitchNetworkButton desiredChainId={chainId} />
              ) : (
                <Button
                  onClick={onExec}
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={
                    isExecuting ||
                    (!quote && execType === "swap") ||
                    insufficientBalance ||
                    disabled ||
                    quoteQuery?.isError ||
                    quoteQuery?.isFetching
                  }
                  startIcon={
                    isExecuting || quoteQuery?.isFetching ? (
                      <CircularProgress color="inherit" size="1rem" />
                    ) : undefined
                  }
                >
                  {renderExecButtonMessage()}
                </Button>
              )
            ) : (
              <Button
                onClick={connectWallet}
                startIcon={<WalletIcon />}
                variant="contained"
                color="primary"
                size="large"
              >
                <FormattedMessage
                  id="connect.wallet"
                  defaultMessage="Connect Wallet"
                />
              </Button>
            )}
          </Stack>
        </Box>
        {!disableFooter && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body1" align="center">
              <FormattedMessage
                id="powered.by.dexkit"
                defaultMessage="Powered by {dexkit}"
                values={{ dexkit: <strong>DexKit</strong> }}
              />
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
