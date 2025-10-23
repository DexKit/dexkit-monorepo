import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { BigNumber, providers } from "ethers";
import { FormattedMessage } from "react-intl";
import { ExecType, SwapSide } from "../types";

import { ChainId } from "@dexkit/core/constants/enums";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import { SwitchNetworkButton } from "@dexkit/ui/components/SwitchNetworkButton";
import {
  ZeroExGaslessQuoteResponse,
  ZeroExQuoteResponse,
} from "@dexkit/ui/modules/swap/types";
import { CreditCard } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import type { UseQueryResult } from "@tanstack/react-query";
import { AppNotificationsBadge } from "../../../components/AppNotificationBadge";
import TransakIcon from "../../../components/icons/TransakIcon";
import { SUPPORTED_SWAP_CHAIN_IDS } from "../constants/supportedChainIds";
import SwapTokenFieldMatcha from "./SwapTokenFieldMatcha";

// @ts-ignore

export interface SwapMatchaProps {
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

import { ConnectButton } from "@dexkit/ui/components/ConnectButton";
import { useExecButtonMessage } from "../hooks/useExecButtonMessage";
import SwapFeeSummaryMatcha from "./SwapFeeSummaryMatcha";
import SwapSwitchTokensMatchaButton from "./SwapSwitchTokensMatchaButton";

export default function SwapMatcha({
  chainId,
  networkName,
  featuredTokensByChain,
  disabled,
  quoteFor,
  priceBuy,
  priceBuyLoading,
  priceSell,
  priceSellLoading,
  isActive,
  selectedChainId,
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
  onShowTransak,
  onToggleChangeNetwork,
  onSetToken,
  keepTokenAlwaysPresent = false,
  lockedToken,
  swapFees,
}: SwapMatchaProps) {
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

  return (
    <Paper variant="elevation">
      <Stack spacing={1}>
        <Box px={1} pt={1}>
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
            <Button
              color="inherit"
              disableElevation
              disableRipple
              disableTouchRipple
            >
              <FormattedMessage id="market" defaultMessage="Market" />
            </Button>

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
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        {isQuoting && !disabled ? (
          <LinearProgress color="primary" sx={{ height: "1px" }} />
        ) : (
          <Divider />
        )}
        <Box pb={2}>
          <Stack spacing={2}>
            <Stack>
              <SwapTokenFieldMatcha
                featuredTokensByChain={[]}
                selectedChainId={selectedChainId}
                enableHalfAmount
                title={<FormattedMessage id="sell" defaultMessage="Sell" />}
                price={priceSell}
                priceLoading={priceSellLoading}
                InputBaseProps={{ fullWidth: true }}
                onChange={onChangeSellAmount}
                onSelectToken={handleSelectSellToken}
                token={sellToken}
                value={sellAmount}
                balance={sellTokenBalance}
                showBalance={isActive}
                isUserInput={quoteFor === "sell" && clickOnMax === false}
                disabled={isQuoting && quoteFor === "buy"}
                keepTokenAlwaysPresent={keepTokenAlwaysPresent}
                lockedToken={lockedToken}
              />
              <Stack
                alignItems="center"
                sx={{
                  borderTop: 1,
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={(theme) => ({
                    marginTop: -2.25,
                    marginBottom: -2.25,
                  })}
                >
                  <SwapSwitchTokensMatchaButton
                    IconButtonProps={{ onClick: onSwapTokens }}
                  />
                </Box>
              </Stack>
              <SwapTokenFieldMatcha
                featuredTokensByChain={featuredTokensByChain}
                selectedChainId={selectedChainId}
                title={<FormattedMessage id="buy" defaultMessage="Buy" />}
                price={priceBuy}
                priceLoading={priceBuyLoading}
                InputBaseProps={{ fullWidth: true }}
                onChange={onChangeBuyAmount}
                onSelectToken={handleSelectBuyToken}
                token={buyToken}
                value={buyAmount}
                balance={buyTokenBalance}
                showBalance={isActive}
                isUserInput={quoteFor === "buy" && clickOnMax === false}
                disabled={isQuoting && quoteFor === "sell"}
                isBuyToken
                onSetToken={(token) => {
                  if (token) {
                    onSetToken!(token);
                  }
                }}
                keepTokenAlwaysPresent={keepTokenAlwaysPresent}
                lockedToken={lockedToken}
              />
            </Stack>
            {quote && (
              <>
                <Divider />
                <Box px={2}>
                  <SwapFeeSummaryMatcha
                    quote={quote}
                    chainId={chainId}
                    currency={currency}
                    sellToken={sellToken}
                    buyToken={buyToken}
                    provider={provider}
                    swapFees={swapFees}
                  />
                </Box>
              </>
            )}
            <Stack spacing={2} sx={{ px: 2 }}>
              {insufficientBalance && isActive && (
                <Alert severity="error">
                  <FormattedMessage
                    id="insufficient.symbol.balance"
                    defaultMessage="Insufficient {symbol} balance"
                    values={{ symbol: sellToken?.symbol.toUpperCase() }}
                  />
                </Alert>
              )}
              {/* TODO: As a workaround for https://github.com/DexKit/dexkit-monorepo/issues/462#event-17351363710 buy button is hidden */}
              {/* {onShowTransak && insufficientBalance && isActive && ( */}
              {false && (
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
                <ConnectButton
                  variant="contained"
                  color="primary"
                  size="large"
                />
              )}
            </Stack>
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
    </Paper>
  );
}
