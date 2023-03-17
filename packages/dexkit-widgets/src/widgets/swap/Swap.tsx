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
import { BigNumber, providers } from "ethers";
import { FormattedMessage } from "react-intl";
import { Token } from "../../types";
import SwapTokenField from "./SwapCurrencyField";
import SwapSwitchTokensButton from "./SwapSwitchTokensButton";
import { ExecType, SwapSide } from "./types";

import { NETWORKS } from "@dexkit/core/constants/networks";
import { useIsMobile } from "@dexkit/core/hooks";
import { CreditCard } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import WalletIcon from "@mui/icons-material/Wallet";
import { AppNotificationsBadge } from "../../components/AppNotificationBadge";
import TransakIcon from "../../components/icons/TransakIcon";
import SwitchNetworkSelect from "../../components/SwitchNetworkSelect";
import { ChainId } from "../../constants/enum";
import { ZeroExQuoteResponse } from "../../services/zeroex/types";
import SwapFeeSummary from "./SwapFeeSummary";

// @ts-ignore

export interface SwapProps {
  chainId?: ChainId;
  currency: string;
  disabled?: boolean;
  quoteFor?: SwapSide;
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
  quote?: ZeroExQuoteResponse | null;
  isExecuting: boolean;
  sellTokenBalance?: BigNumber;
  buyTokenBalance?: BigNumber;
  insufficientBalance?: boolean;
  isProviderReady?: boolean;
  isQuoting?: boolean;
  disableNotificationsButton?: boolean;
  enableBuyCryptoButton?: boolean;
  disableFooter?: boolean;
  networkName?: string;
  onSelectToken: (selectFor: SwapSide, token?: Token) => void;
  onSwapTokens: () => void;
  onChangeSellAmount: (value: BigNumber) => void;
  onChangeBuyAmount: (value: BigNumber) => void;
  onConnectWallet: () => void;
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
  onConnectWallet,
  onChangeNetwork,
  onShowSettings,
  onShowTransactions,
  onExec,
  onShowTransak,
  onToggleChangeNetwork,
}: SwapProps) {
  const handleSelectSellToken = (token?: Token) => {
    onSelectToken("sell", token);
  };

  const handleSelectBuyToken = (token?: Token) => {
    onSelectToken("buy", token);
  };

  const renderExecButtonMessage = () => {
    if (insufficientBalance) {
      return (
        <FormattedMessage
          id="insufficient.symbol.balance"
          defaultMessage="Insufficient {symbol} balance"
          values={{ symbol: sellToken?.symbol.toUpperCase() }}
        />
      );
    }

    return execType === "wrap" ? (
      <FormattedMessage id="wrap" defaultMessage="Wrap" />
    ) : execType === "unwrap" ? (
      <FormattedMessage id="Unwrap" defaultMessage="Unwrap" />
    ) : execType === "switch" ? (
      <FormattedMessage
        id="switch.network"
        defaultMessage="Switch to {networkName}"
        values={{ networkName }}
      />
    ) : execType === "approve" ? (
      <FormattedMessage id="approve" defaultMessage="Approve" />
    ) : (
      <FormattedMessage id="swap" defaultMessage="Swap" />
    );
  };

  const isMobile = useIsMobile();

  return (
    <Card>
      <Box sx={{ p: 2 }}>
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
              token={sellToken}
              value={sellAmount}
              balance={sellTokenBalance}
              showBalance={isActive}
              disabled={isQuoting && quoteFor === "buy"}
            />
            <Stack alignItems="center">
              <Box
                sx={{
                  marginTop: (theme) => -2,
                  marginBottom: (theme) => -2,
                }}
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
              token={buyToken}
              value={buyAmount}
              balance={buyTokenBalance}
              showBalance={isActive}
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
            <Button
              onClick={onExec}
              variant="contained"
              color="primary"
              size="large"
              disabled={
                isExecuting ||
                (!quote && execType === "swap") ||
                insufficientBalance ||
                disabled
              }
              startIcon={
                isExecuting ? (
                  <CircularProgress color="inherit" size="1rem" />
                ) : undefined
              }
            >
              {renderExecButtonMessage()}
            </Button>
          ) : (
            <Button
              onClick={onConnectWallet}
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
