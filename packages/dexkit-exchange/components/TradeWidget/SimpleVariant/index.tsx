import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
  Tabs,
} from "@mui/material";
import { SyntheticEvent, useMemo, useState } from "react";

import { Token } from "@dexkit/core/types";
import { useUserGaslessSettings } from "@dexkit/ui/modules/swap/hooks/useUserGaslessSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import { providers } from "ethers";
import dynamic from "next/dynamic";
import { FormattedMessage } from "react-intl";
import { OrderMarketType } from "../../../constants";
import TradeWidgetTabAlt from "../TradeWidgetTabAlt";
import MarketForm from "./MarketForm";
const SwapSettingsDialog = dynamic(
  () => import("@dexkit/ui/modules/swap/components/dialogs/SwapSettingsDialog")
);

export interface TradeWidgetSimpleVariantProps {
  isActive: boolean;
  chainId?: number;
  account?: string;
  quoteToken: Token | undefined;
  baseToken: Token | undefined;
  feeRecipient: string;
  affiliateAddress: string;
  defaultSlippage?: number;
  quoteTokens?: Token[];
  provider?: providers.Web3Provider;
  buyTokenPercentageFee?: number;
  defaultOrderSide: "buy" | "sell";
  show: OrderMarketType;
  useGasless?: boolean;
}

export default function TradeWidgetSimpleVariant({
  isActive,
  defaultOrderSide,
  defaultSlippage,
  chainId,
  account,
  provider,
  buyTokenPercentageFee,
  feeRecipient,
  quoteTokens,
  show,
  affiliateAddress,
  quoteToken,
  baseToken,
  useGasless,
}: TradeWidgetSimpleVariantProps) {
  const [userGasless] = useUserGaslessSettings();
  const [selectedOrderSide, setOrderSide] = useState<"buy" | "sell">(
    defaultOrderSide
  );
  const orderSide = useMemo(() => {
    if (selectedOrderSide) {
      return selectedOrderSide;
    }
    return defaultOrderSide;
  }, [selectedOrderSide, defaultOrderSide]);

  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [isAutoSlippage, setAutoSlippage] = useState<boolean>(false);

  const [slippage, setSlippage] = useState<number | undefined>(
    defaultSlippage || 0.01
  );

  const handleChangeOrderSide = (e: SyntheticEvent, value: "buy" | "sell") => {
    setOrderSide(value);
  };

  const renderContent = () => {
    return (
      <Stack spacing={2}>
        {show === OrderMarketType.buyAndSell && (
          <>
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
          </>
        )}

        {quoteToken && baseToken ? (
          <MarketForm
            key={`market-${baseToken.address}-${quoteToken.address}`}
            quoteToken={quoteToken}
            baseToken={baseToken}
            provider={provider}
            account={account}
            affiliateAddress={affiliateAddress}
            buyTokenPercentageFee={buyTokenPercentageFee}
            feeRecipient={feeRecipient}
            isActive={isActive}
            slippage={slippage}
            quoteTokens={quoteTokens}
            chainId={chainId}
            side={orderSide}
            useGasless={userGasless !== undefined ? userGasless : useGasless}
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
        useGasless={useGasless}
        onAutoSlippage={(auto: any) => setAutoSlippage(auto)}
        onChangeSlippage={(sl: any) => setSlippage(sl)}
        maxSlippage={slippage as number}
        isAutoSlippage={isAutoSlippage}
      />

      <Card>
        <CardHeader
          title={
            <>
              {show === OrderMarketType.buyAndSell && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormattedMessage id="trade" defaultMessage="Trade" />
                  <IconButton
                    size="small"
                    onClick={() => setShowSettings(true)}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Stack>
              )}

              {(show === OrderMarketType.buy ||
                show === OrderMarketType.sell) && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {show === OrderMarketType.buy && (
                    <FormattedMessage
                      id="buy.token.symbol"
                      defaultMessage="Buy {tokenSymbol}"
                      values={{
                        tokenSymbol: baseToken?.symbol.toUpperCase(),
                      }}
                    />
                  )}
                  {show === OrderMarketType.sell && (
                    <FormattedMessage
                      id="sell.token.symbol"
                      defaultMessage="Sell {tokenSymbol}"
                      values={{
                        tokenSymbol: baseToken?.symbol.toUpperCase(),
                      }}
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={() => setShowSettings(true)}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Stack>
              )}
            </>
          }
          titleTypographyProps={{ variant: "body1" }}
        />
        <Divider />
        <CardContent>
          <Stack spacing={2} sx={{ p: 1 }}>
            {renderContent()}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
