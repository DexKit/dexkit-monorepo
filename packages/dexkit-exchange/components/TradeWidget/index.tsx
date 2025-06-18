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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";

import { FormattedMessage } from "react-intl";
import TradeWidgetTabAlt from "./TradeWidgetTabAlt";

import { NETWORKS } from "@dexkit/core/constants/networks";
import { useErc20BalanceQuery } from "@dexkit/core/hooks";
import SwapSettingsDialog from "@dexkit/ui/modules/swap/components/dialogs/SwapSettingsDialog";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import SettingsIcon from "@mui/icons-material/Settings";
import { DEFAULT_ZRX_NETWORKS } from "../../constants";
import { useExchangeContext } from "../../hooks";
import LimitForm from "./LimitForm";
import MarketForm from "./SimpleVariant/MarketForm";

const usePreviewPlatform = () => {
  try {
    const { usePreviewPlatform } = require("@dexkit/dexappbuilder-viewer/components/SectionsRenderer");
    return usePreviewPlatform();
  } catch {
    return null;
  }
};

// FIXME: base/quote KIT/USDT
export interface TradeWidgetProps {
  isActive: boolean;
}

export default function TradeWidget({ isActive }: TradeWidgetProps) {
  const theme = useTheme();
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const previewContext = usePreviewPlatform();
  const isMobile = previewContext ? previewContext.isMobile : isMobileDevice;

  const {
    quoteToken,
    baseToken,
    feeRecipient,
    buyTokenPercentageFee,
    affiliateAddress,
    chainId,
    signer,
    provider,
    account,
    availNetworks,
    defaultSlippage,
    variant,
    glassSettings,
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

  const isGlassVariant = variant === "glass";
  const textColor = glassSettings?.textColor || theme.palette.text.primary;
  const buyTabColor = glassSettings?.buyTabColor || theme.palette.success.main;
  const sellTabColor = glassSettings?.sellTabColor || theme.palette.error.main;
  const buyTabTextColor = glassSettings?.buyTabTextColor || theme.palette.common.white;
  const sellTabTextColor = glassSettings?.sellTabTextColor || theme.palette.common.white;
  const buyText = glassSettings?.buyText || 'BUY';
  const sellText = glassSettings?.sellText || 'SELL';

  const glassStyles = useMemo(() => {
    if (!isGlassVariant) return {};

    return {
      backgroundColor: 'transparent !important',
      boxShadow: 'none !important',
      border: 'none !important',
      '& .MuiCard-root': {
        backgroundColor: 'transparent !important',
        boxShadow: 'none !important',
        border: 'none !important',
      },
      '& .MuiCardHeader-root': {
        backgroundColor: 'transparent !important',
        borderBottom: `1px solid ${theme.palette.divider}20 !important`,
        pb: theme.spacing(2),
        '& .MuiTypography-root': {
          color: `${textColor} !important`,
          fontWeight: theme.typography.fontWeightMedium,
          textShadow: textColor.includes('255, 255, 255')
            ? `0 ${theme.spacing(0.125)} ${theme.spacing(0.25)} rgba(0, 0, 0, 0.3)`
            : `0 ${theme.spacing(0.125)} ${theme.spacing(0.25)} rgba(255, 255, 255, 0.3)`,
        },
      },
      '& .MuiCardContent-root': {
        backgroundColor: 'transparent !important',
        p: { xs: theme.spacing(2), sm: theme.spacing(2.5), md: theme.spacing(3) },
      },
      '& .MuiPaper-root': {
        backgroundColor: 'transparent !important',
        boxShadow: 'none !important',
        border: 'none !important',
      },
      '& .MuiDivider-root': {
        backgroundColor: `${theme.palette.divider}40 !important`,
        borderColor: `${theme.palette.divider}40 !important`,
      },
      '& .MuiIconButton-root': {
        color: `${textColor} !important`,
        '&:hover': {
          backgroundColor: `${theme.palette.common.white}10 !important`,
        },
      },
      '& .MuiTypography-root': {
        color: `${textColor} !important`,
      },
    };
  }, [isGlassVariant, textColor, theme]);

  const tabsStyles = useMemo(() => ({
    "& .MuiTabs-indicator": {
      display: 'none',
    },
    ...(isMobile && {
      '& .MuiTabs-flexContainer': {
        flexDirection: 'column',
        gap: theme.spacing(1),
      },
    }),
    "& .MuiTab-root": {
      fontWeight: theme.typography.fontWeightMedium,
      textTransform: 'none' as const,
      fontSize: theme.typography.body1.fontSize,
      minHeight: theme.spacing(5),
      transition: theme.transitions.create([
        'all'
      ], {
        duration: theme.transitions.duration.short,
      }),
      borderRadius: theme.shape.borderRadius * 1.5,
      mx: theme.spacing(0.5),
      ...(isMobile && {
        fontSize: theme.typography.body2.fontSize,
        minHeight: theme.spacing(4),
        mx: 0,
        width: '100%',
        mb: theme.spacing(0.5),
      }),
      ...(isGlassVariant && {
        backdropFilter: `blur(${theme.spacing(1.25)}) saturate(150%)`,
        WebkitBackdropFilter: `blur(${theme.spacing(1.25)}) saturate(150%)`,
        border: `1px solid ${theme.palette.divider}30`,
      }),
      '&:first-of-type': {
        color: orderSide === "buy" ? `${buyTabTextColor} !important` : `${buyTabColor}80 !important`,
        backgroundColor: orderSide === "buy"
          ? `${buyTabColor}${isGlassVariant ? '40' : '20'}`
          : 'transparent',
        ...(isMobile && {
          color: orderSide === "buy" ? `${buyTabTextColor} !important` : `${buyTabColor}DD !important`,
          backgroundColor: orderSide === "buy"
            ? `${buyTabColor}${isGlassVariant ? '60' : '40'}`
            : `${buyTabColor}20`,
          border: `1px solid ${buyTabColor}${orderSide === "buy" ? '80' : '50'}`,
          fontWeight: orderSide === "buy" ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
        }),
        ...(isGlassVariant && orderSide === "buy" && {
          backdropFilter: `blur(${theme.spacing(1.875)}) saturate(170%)`,
          WebkitBackdropFilter: `blur(${theme.spacing(1.875)}) saturate(170%)`,
          borderColor: `${buyTabColor}60`,
          boxShadow: `0 ${theme.spacing(0.5)} ${theme.spacing(1.5)} ${buyTabColor}20`,
        }),
        '&:hover': {
          backgroundColor: `${buyTabColor}20`,
          color: `${buyTabTextColor} !important`,
          ...(isGlassVariant && {
            transform: 'scale(1.02)',
            backdropFilter: `blur(${theme.spacing(1.5)}) saturate(160%)`,
            WebkitBackdropFilter: `blur(${theme.spacing(1.5)}) saturate(160%)`,
          }),
        },
        '&.Mui-selected': {
          color: `${buyTabTextColor} !important`,
          backgroundColor: `${buyTabColor}${isGlassVariant ? '50' : '30'}`,
          fontWeight: theme.typography.fontWeightBold,
          ...(isGlassVariant && {
            transform: 'scale(1.05)',
            backdropFilter: `blur(${theme.spacing(2.5)}) saturate(180%)`,
            WebkitBackdropFilter: `blur(${theme.spacing(2.5)}) saturate(180%)`,
            boxShadow: `0 ${theme.spacing(0.75)} ${theme.spacing(2)} ${buyTabColor}30`,
          }),
        },
      },
      '&:last-of-type': {
        color: orderSide === "sell" ? `${sellTabTextColor} !important` : `${sellTabColor}80 !important`,
        backgroundColor: orderSide === "sell"
          ? `${sellTabColor}${isGlassVariant ? '40' : '20'}`
          : 'transparent',
        ...(isMobile && {
          color: orderSide === "sell" ? `${sellTabTextColor} !important` : `${sellTabColor}DD !important`,
          backgroundColor: orderSide === "sell"
            ? `${sellTabColor}${isGlassVariant ? '60' : '40'}`
            : `${sellTabColor}20`,
          border: `1px solid ${sellTabColor}${orderSide === "sell" ? '80' : '50'}`,
          fontWeight: orderSide === "sell" ? theme.typography.fontWeightBold : theme.typography.fontWeightMedium,
        }),
        ...(isGlassVariant && orderSide === "sell" && {
          backdropFilter: `blur(${theme.spacing(1.875)}) saturate(170%)`,
          WebkitBackdropFilter: `blur(${theme.spacing(1.875)}) saturate(170%)`,
          borderColor: `${sellTabColor}60`,
          boxShadow: `0 ${theme.spacing(0.5)} ${theme.spacing(1.5)} ${sellTabColor}20`,
        }),
        '&:hover': {
          backgroundColor: `${sellTabColor}20`,
          color: `${sellTabTextColor} !important`,
          ...(isGlassVariant && {
            transform: 'scale(1.02)',
            backdropFilter: `blur(${theme.spacing(1.5)}) saturate(160%)`,
            WebkitBackdropFilter: `blur(${theme.spacing(1.5)}) saturate(160%)`,
          }),
        },
        '&.Mui-selected': {
          color: `${sellTabTextColor} !important`,
          backgroundColor: `${sellTabColor}${isGlassVariant ? '50' : '30'}`,
          fontWeight: theme.typography.fontWeightBold,
          ...(isGlassVariant && {
            transform: 'scale(1.05)',
            backdropFilter: `blur(${theme.spacing(2.5)}) saturate(180%)`,
            WebkitBackdropFilter: `blur(${theme.spacing(2.5)}) saturate(180%)`,
            boxShadow: `0 ${theme.spacing(0.75)} ${theme.spacing(2)} ${sellTabColor}30`,
          }),
        },
      },
    },
  }), [
    theme,
    isGlassVariant,
    orderSide,
    buyTabColor,
    sellTabColor,
    buyTabTextColor,
    sellTabTextColor,
    isMobile
  ]);

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
    return (
      <Stack spacing={theme.spacing(2)}>
        <Tabs
          onChange={handleChangeOrderSide}
          value={orderSide}
          variant="fullWidth"
          orientation={isMobile ? "vertical" : "horizontal"}
          sx={tabsStyles}
        >
          <TradeWidgetTabAlt
            value="buy"
            label={buyText}
          />
          <TradeWidgetTabAlt
            value="sell"
            label={sellText}
          />
        </Tabs>

        <Divider sx={{ opacity: isGlassVariant ? 0.3 : 1 }} />

        {chainId &&
          !DEFAULT_ZRX_NETWORKS.includes(chainId) &&
          orderType === "limit" ? (
          <Stack py={theme.spacing(4)} spacing={theme.spacing(2)}>
            <Typography align="center" variant="h6" color="text.primary">
              <FormattedMessage
                id="unsupported.network"
                defaultMessage="Unsupported Network"
              />
            </Typography>
            <Typography align="center" variant="body2" color="text.secondary">
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
          <Stack py={theme.spacing(4)} spacing={theme.spacing(2)}>
            <Typography align="center" variant="h6" color="text.primary">
              <FormattedMessage
                id="native.coins.are.not.supported.on.limit.orders"
                defaultMessage="Native coins are not supported on limited orders"
              />
            </Typography>
            <Typography align="center" variant="body2" color="text.secondary">
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
                signer={signer}
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

      <Card
        sx={{
          borderRadius: theme.shape.borderRadius * 2,
          border: `1px solid ${theme.palette.divider}`,
          ...glassStyles,
        }}
      >
        <CardHeader
          title={
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant={isMobile ? "h6" : "h5"}
                sx={{ fontWeight: theme.typography.fontWeightMedium }}
              >
                <FormattedMessage id="trade" defaultMessage="Trade" />
              </Typography>
              <IconButton
                size={isMobile ? "small" : "medium"}
                onClick={() => setShowSettings(true)}
                sx={{
                  color: isGlassVariant ? textColor : theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: isGlassVariant
                      ? `${theme.palette.common.white}10`
                      : theme.palette.action.hover,
                  },
                }}
              >
                <SettingsIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Stack>
          }
          sx={{
            p: { xs: theme.spacing(2), sm: theme.spacing(2.5), md: theme.spacing(3) },
            pb: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
          }}
        />

        <Divider sx={{ opacity: isGlassVariant ? 0.3 : 1 }} />

        <CardContent
          sx={{
            p: { xs: theme.spacing(2), sm: theme.spacing(2.5), md: theme.spacing(3) },
            '&:last-child': {
              pb: { xs: theme.spacing(2), sm: theme.spacing(2.5), md: theme.spacing(3) },
            },
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: { xs: theme.spacing(2), sm: theme.spacing(2.5) },
              borderRadius: theme.shape.borderRadius * 1.5,
              ...(isGlassVariant && {
                backgroundColor: 'transparent !important',
                boxShadow: 'none !important',
                border: 'none !important',
              }),
            }}
          >
            {renderContent()}
          </Paper>
        </CardContent>
      </Card>
    </>
  );
}
