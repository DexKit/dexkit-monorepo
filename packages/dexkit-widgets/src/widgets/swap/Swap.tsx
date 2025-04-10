import { ChainId } from "@dexkit/core/constants/enums";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { useIsMobile } from "@dexkit/core/hooks";
import { Token } from "@dexkit/core/types";
import { ConnectButton } from "@dexkit/ui/components/ConnectButton";
import { SwitchNetworkButton } from "@dexkit/ui/components/SwitchNetworkButton";
import { useWalletConnect } from "@dexkit/ui/hooks/wallet";
import {
  ZeroExGaslessQuoteResponse,
  ZeroExQuoteResponse,
} from "@dexkit/ui/modules/swap/types";
import { CreditCard } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import type { UseQueryResult } from "@tanstack/react-query";
import { BigNumber, providers } from "ethers";
import { FormattedMessage } from "react-intl";
import { AppNotificationsBadge } from "../../components/AppNotificationBadge";
import SwitchNetworkSelect from "../../components/SwitchNetworkSelect";
import TransakIcon from "../../components/icons/TransakIcon";
import SwapTokenField from "./SwapCurrencyField";
import SwapFeeSummary from "./SwapFeeSummary";
import SwapSwitchTokensButton from "./SwapSwitchTokensButton";
import { SUPPORTED_SWAP_CHAIN_IDS } from "./constants/supportedChainIds";
import { useExecButtonMessage } from "./hooks/useExecButtonMessage";
import { ExecType, SwapSide } from "./types";
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

export default function Swap({
  chainId,
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
  const handleSelectSellToken = (token?: Token, clickOnMax?: boolean) => {
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
    <Card>
      <Box sx={{ p: 2 }}>
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
          <Box>
            {isProviderReady &&
              chainId &&
              (isMobile ? (
                <Button
                  sx={{
                    color: (theme) => theme.palette.text.primary,
                    borderColor: (theme) => theme.palette.divider,
                  }}
                  onClick={onToggleChangeNetwork}
                  startIcon={
                    NETWORKS[chainId] ? (
                      <Avatar
                        sx={{ width: "1rem", height: "1rem" }}
                        src={NETWORKS[chainId].imageUrl}
                      />
                    ) : undefined
                  }
                  variant="outlined"
                >
                  {NETWORKS[chainId] ? NETWORKS[chainId].name : ""}
                </Button>
              ) : (
                <SwitchNetworkSelect
                  chainId={chainId}
                  activeChainIds={activeChainIds}
                  onChangeNetwork={onChangeNetwork}
                  SelectProps={{ size: "small" }}
                />
              ))}
          </Box>

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
                <FormattedMessage id="buy.crypto" defaultMessage="Buy Crypto" />
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

      {isQuoting && !disabled ? (
        <LinearProgress color="primary" sx={{ height: "1px" }} />
      ) : (
        <Divider />
      )}
      <CardContent>
        <Stack spacing={2}>
          <Stack>
            <SwapTokenField
              InputBaseProps={{ fullWidth: true }}
              onChange={onChangeSellAmount}
              onSelectToken={handleSelectSellToken}
              onInputClick={() => {
                if (!sellToken) {
                  handleSelectSellToken();
                }
              }}
              token={sellToken}
              value={sellAmount}
              balance={sellTokenBalance}
              showBalance={isActive}
              isUserInput={quoteFor === "sell" && clickOnMax === false}
              disabled={isQuoting && quoteFor === "buy"}
            />
            <Stack alignItems="center">
              <Box
                sx={() => ({
                  marginTop: -2,
                  marginBottom: -2,
                })}
              >
                <SwapSwitchTokensButton
                  IconButtonProps={{ onClick: onSwapTokens }}
                />
              </Box>
            </Stack>
            <SwapTokenField
              InputBaseProps={{ fullWidth: true }}
              onChange={onChangeBuyAmount}
              onSelectToken={handleSelectBuyToken}
              onInputClick={() => {
                if (!buyToken) {
                  handleSelectBuyToken();
                }
              }}
              token={buyToken}
              value={buyAmount}
              balance={buyTokenBalance}
              showBalance={isActive}
              isUserInput={quoteFor === "buy" && clickOnMax === false}
              disabled={isQuoting && quoteFor === "sell"}
            />
          </Stack>
          {quote && (
            <SwapFeeSummary
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
            <ConnectButton variant="contained" color="primary" size="large" />
          )}
        </Stack>
      </CardContent>
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
    </Card>
  );
}
