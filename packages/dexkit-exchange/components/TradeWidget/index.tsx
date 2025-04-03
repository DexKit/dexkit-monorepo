import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tabs,
  Typography,
} from "@mui/material";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";

import { FormattedMessage } from "react-intl";
import TradeWidgetTabAlt from "./TradeWidgetTabAlt";
import { TradeWidgetTabs } from "./TradeWidgetTabs";

import { NETWORKS } from "@dexkit/core/constants/networks";
import { useErc20BalanceQuery } from "@dexkit/core/hooks";
import SwapSettingsDialog from "@dexkit/ui/modules/swap/components/dialogs/SwapSettingsDialog";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import SettingsIcon from "@mui/icons-material/Settings";
import { DEFAULT_ZRX_NETWORKS } from "../../constants";
import { useExchangeContext } from "../../hooks";
import LimitForm from "./LimitForm";
import MarketForm from "./SimpleVariant/MarketForm";
import TradeWidgetTab from "./TradeWidgetTab";

// FIXME: base/quote KIT/USDT
export interface TradeWidgetProps {
  isActive: boolean;
}

export default function TradeWidget({ isActive }: TradeWidgetProps) {
  const {
    quoteToken,
    baseToken,
    feeRecipient,
    buyTokenPercentageFee,
    affiliateAddress,
    chainId,
    provider,
    account,
    availNetworks,
    defaultSlippage,
  } = useExchangeContext();

  const [orderType, setOrderType] = useState<"market" | "limit">("market");

  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");

  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [isAutoSlippage, setAutoSlippage] = useState<boolean>(false);

  const [slippage, setSlippage] = useState<number | undefined>(
    (defaultSlippage &&
      chainId &&
      defaultSlippage[chainId] &&
      defaultSlippage[chainId].slippage / 100) ||
      0.01
  );

  useEffect(() => {
    if (
      defaultSlippage &&
      chainId &&
      defaultSlippage[chainId] &&
      defaultSlippage[chainId].slippage
    ) {
      setSlippage(
        defaultSlippage &&
          chainId &&
          defaultSlippage[chainId] &&
          defaultSlippage[chainId].slippage / 100
      );
    }
  }, [chainId]);

  const handleChangeOrderType = (
    e: SyntheticEvent,
    value: "market" | "limit"
  ) => {
    setOrderType(value);
  };

  const handleChangeOrderSide = (e: SyntheticEvent, value: "buy" | "sell") => {
    setOrderSide(value);
  };

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

  const isNativeToken = useMemo(() => {
    if (
      baseToken?.address &&
      baseToken.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS
    ) {
      return true;
    }
    if (
      quoteToken?.address &&
      quoteToken.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS
    ) {
      return true;
    }

    return false;
  }, [baseToken?.address, quoteToken?.address]);

  const renderContent = () => {
    if (
      (chainId && !availNetworks.includes(chainId)) ||
      !baseToken ||
      !quoteToken
    ) {
      return (
        <Stack>
          <Typography align="center" variant="h5">
            <FormattedMessage
              id="unsupported.network"
              defaultMessage="Unsupported Network"
            />
          </Typography>
          <Typography align="center" variant="body1">
            <FormattedMessage
              id="please.switch.to.networks"
              defaultMessage="Please, switch to {networks}"
              values={{
                networks: DEFAULT_ZRX_NETWORKS.map(
                  (chain) => NETWORKS[chain].name
                ).join(", "),
              }}
            />
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack spacing={2}>
        <Tabs
          onChange={handleChangeOrderSide}
          value={orderSide}
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: (theme) =>
                orderSide === "buy"
                  ? theme.palette.success.light
                  : theme.palette.error.light,
            },
            "& .Mui-selected": {
              color: (theme) =>
                orderSide === "buy"
                  ? theme.palette.success.light
                  : theme.palette.error.light,
            },
          }}
        >
          <TradeWidgetTabAlt
            value="buy"
            label={<FormattedMessage id="buy" defaultMessage="Buy" />}
          />
          <TradeWidgetTabAlt
            value="sell"
            label={<FormattedMessage id="sell" defaultMessage="Sell" />}
          />
        </Tabs>
        <Divider />

        {chainId &&
        !DEFAULT_ZRX_NETWORKS.includes(chainId) &&
        orderType === "limit" ? (
          <Stack py={4}>
            <Typography align="center" variant="h5">
              <FormattedMessage
                id="unsupported.network"
                defaultMessage="Unsupported Network"
              />
            </Typography>
            <Typography align="center" variant="body1">
              <FormattedMessage
                id="please.switch.to.networks"
                defaultMessage="Please, switch to {networks}"
                values={{
                  networks: DEFAULT_ZRX_NETWORKS.map(
                    (chain) => NETWORKS[chain].name
                  ).join(", "),
                }}
              />
            </Typography>
          </Stack>
        ) : chainId && isNativeToken && orderType === "limit" ? (
          <Stack py={4}>
            <Typography align="center" variant="h5">
              <FormattedMessage
                id="native.coins.are.not.supported.on.limit.orders"
                defaultMessage="Native coins are not supported on limited orders"
              />
            </Typography>
            <Typography align="center" variant="body1">
              <FormattedMessage
                id="please.use.wrapped.version.of.native.token"
                defaultMessage="Please use wrapped version of native token"
              />
            </Typography>
          </Stack>
        ) : (
          <>
            {orderType == "limit" && quoteToken && baseToken && (
              <LimitForm
                key={`limit-${baseToken.address}-${quoteToken.address}`}
                baseToken={baseToken}
                slippage={slippage}
                quoteToken={quoteToken}
                quoteTokenBalance={quoteTokenBalanceQuery.data}
                feeRecipient={feeRecipient}
                maker={account}
                provider={provider}
                affiliateAddress={affiliateAddress}
                chainId={chainId}
                side={orderSide}
              />
            )}
          </>
        )}

        {orderType === "market" && quoteToken && baseToken ? (
          <MarketForm
            key={`market-${orderSide}-${baseToken.address}-${quoteToken.address}`}
            quoteToken={quoteToken}
            baseToken={baseToken}
            provider={provider}
            side={orderSide}
            account={account}
            affiliateAddress={affiliateAddress}
            feeRecipient={feeRecipient}
            isActive={isActive}
            chainId={chainId}
          />
        ) : null}
      </Stack>
    );
  };

  return (
    <>
      <SwapSettingsDialog
        DialogProps={{
          open: showSettings,
          maxWidth: "xs",
          fullWidth: true,
          onClose: () => setShowSettings(false),
        }}
        title={
          <FormattedMessage
            id="market.settings"
            defaultMessage="Market Settings"
          />
        }
        onAutoSlippage={(auto) => setAutoSlippage(auto)}
        onChangeSlippage={(sl) => setSlippage(sl)}
        maxSlippage={slippage as number}
        isAutoSlippage={isAutoSlippage}
      />

      <Card>
        <CardHeader
          title={
            <>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <FormattedMessage id="trade" defaultMessage="Trade" />
                <IconButton size="small" onClick={() => setShowSettings(true)}>
                  <SettingsIcon />
                </IconButton>
              </Stack>
            </>
          }
          titleTypographyProps={{ variant: "body1" }}
        />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <TradeWidgetTabs
              onChange={handleChangeOrderType}
              value={orderType}
              variant="fullWidth"
            >
              <TradeWidgetTab
                value="market"
                label={<FormattedMessage id="market" defaultMessage="Market" />}
              />
              <TradeWidgetTab
                value="limit"
                label={<FormattedMessage id="limit" defaultMessage="Limit" />}
              />
            </TradeWidgetTabs>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
              }}
            >
              {renderContent()}
            </Paper>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
