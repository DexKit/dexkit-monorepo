import {
  Box,
  Divider,
  IconButton,
  Stack,
  Tabs,
  Typography,
  useColorScheme,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";

import { FormattedMessage } from "react-intl";
import TradeWidgetTabAlt from "./TradeWidgetTabAlt";

import { NETWORKS } from "@dexkit/core/constants/networks";
import { useErc20BalanceQuery } from "@dexkit/core/hooks";
import { useForceThemeMode } from "@dexkit/ui/hooks";
import SwapSettingsDialog from "@dexkit/ui/modules/swap/components/dialogs/SwapSettingsDialog";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import SettingsIcon from "@mui/icons-material/Settings";
import { DEFAULT_ZRX_NETWORKS } from "../../constants";
import { useExchangeContext } from "../../hooks";
import { ExchangeCustomVariantSettings } from "../../types";
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
  customVariantSettings?: ExchangeCustomVariantSettings;
}

export default function TradeWidget({ isActive, customVariantSettings }: TradeWidgetProps) {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const themeModeObj = useForceThemeMode();
  const themeMode = themeModeObj.mode;
  const isMobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const previewContext = usePreviewPlatform();
  const isMobile = previewContext ? previewContext.isMobile : isMobileDevice;
  const [isHydrated, setIsHydrated] = useState(false);
  const isDark = isHydrated ? (themeMode === 'dark' || theme.palette.mode === 'dark') : false;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
  const buyTabColor = glassSettings?.buyTabColor || '#10B981';
  const sellTabColor = glassSettings?.sellTabColor || '#EF4444';
  const buyTabTextColor = glassSettings?.buyTabTextColor || customVariantSettings?.tradeWidgetTabTextColor || theme.palette.text.primary;
  const sellTabTextColor = glassSettings?.sellTabTextColor || customVariantSettings?.tradeWidgetTabTextColor || theme.palette.text.primary;
  const buyText = glassSettings?.buyText || 'BUY';
  const sellText = glassSettings?.sellText || 'SELL';

  const glassStyles = useMemo(() => {
    if (!isGlassVariant) return {};

    if (!isDark) {
      return {
        '& .MuiTypography-root:not([data-pair-button])': {
          color: `${theme.palette.text.primary} !important`,
        },
        '& .MuiIconButton-root:not([data-pair-button])': {
          color: `${theme.palette.text.primary} !important`,
          '&:hover': {
            backgroundColor: `${theme.palette.action.hover} !important`,
          },
        },
      };
    }

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
  }, [isGlassVariant, textColor, theme, isDark]);

  const tabsStyles = useMemo(() => ({
    "& .MuiTabs-indicator": {
      display: 'none',
    },
    "& .MuiTabs-flexContainer": {
      gap: theme.spacing(0.5),
      ...(isMobile && {
        flexDirection: 'column',
        gap: theme.spacing(1),
        px: theme.spacing(1),
      }),
    },
    "& .MuiTab-root": {
      fontWeight: theme.typography.fontWeightBold,
      textTransform: 'none' as const,
      fontSize: theme.typography.body1.fontSize,
      minHeight: theme.spacing(6),
      padding: theme.spacing(1.5, 2),
      transition: theme.transitions.create([
        'all'
      ], {
        duration: theme.transitions.duration.short,
      }),
      borderRadius: theme.spacing(1),
      margin: 0,
      flex: 1,
      ...(isMobile && {
        fontSize: theme.typography.body2.fontSize,
        minHeight: theme.spacing(5),
        width: 'calc(100% - 16px)',
        mb: theme.spacing(0.5),
        mx: theme.spacing(1),
      }),
      '&:first-of-type': {
        color: orderSide === "buy" ? `${buyTabTextColor} !important` : `${buyTabColor} !important`,
        backgroundColor: orderSide === "buy" ? buyTabColor : 'transparent',
        border: `2px solid ${buyTabColor}`,

        '&:hover': {
          backgroundColor: orderSide === "buy" ? buyTabColor : `${buyTabColor}20`,
          color: orderSide === "buy" ? `${buyTabTextColor} !important` : `${buyTabColor} !important`,
        },

        '&.Mui-selected': {
          backgroundColor: `${buyTabColor} !important`,
          color: `${buyTabTextColor} !important`,
          border: `2px solid ${buyTabColor}`,
          '&:hover': {
            backgroundColor: `${buyTabColor} !important`,
            color: `${buyTabTextColor} !important`,
          },
        },
      },
      '&:last-of-type': {
        color: orderSide === "sell" ? `${sellTabTextColor} !important` : `${sellTabColor} !important`,
        backgroundColor: orderSide === "sell" ? sellTabColor : 'transparent',
        border: `2px solid ${sellTabColor}`,

        '&:hover': {
          backgroundColor: orderSide === "sell" ? sellTabColor : `${sellTabColor}20`,
          color: orderSide === "sell" ? `${sellTabTextColor} !important` : `${sellTabColor} !important`,
        },

        '&.Mui-selected': {
          backgroundColor: `${sellTabColor} !important`,
          color: `${sellTabTextColor} !important`,
          border: `2px solid ${sellTabColor}`,
          '&:hover': {
            backgroundColor: `${sellTabColor} !important`,
            color: `${sellTabTextColor} !important`,
          },
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
      <>
        <Tabs
          onChange={handleChangeOrderSide}
          value={orderSide}
          variant="fullWidth"
          orientation={isMobile ? "vertical" : "horizontal"}
          sx={{
            ...tabsStyles,
            mb: theme.spacing(1.5)
          }}
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

        <Divider sx={{
          opacity: isGlassVariant ? 0.3 : 1,
          mb: theme.spacing(1.5)
        }} />

        {chainId &&
          !DEFAULT_ZRX_NETWORKS.includes(chainId) &&
          orderType === "limit" ? (
          <Box sx={{ py: theme.spacing(2), textAlign: 'center' }}>
            <Typography variant="h6" color="text.primary" sx={{ mb: theme.spacing(1) }}>
              <FormattedMessage
                id="unsupported.network"
                defaultMessage="Unsupported Network"
              />
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
          </Box>
        ) : chainId && isNativeToken && orderType === "limit" ? (
          <Box sx={{ py: theme.spacing(2), textAlign: 'center' }}>
            <Typography variant="h6" color="text.primary" sx={{ mb: theme.spacing(1) }}>
              <FormattedMessage
                id="native.coins.are.not.supported.on.limit.orders"
                defaultMessage="Native coins are not supported on limited orders"
              />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage
                id="please.use.wrapped.version.of.native.token"
                defaultMessage="Please use wrapped version of native token"
              />
            </Typography>
          </Box>
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
      </>
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
        onAutoSlippage={(auto: any) => setAutoSlippage(auto)}
        onChangeSlippage={(sl: any) => setSlippage(sl)}
        maxSlippage={slippage as number}
        isAutoSlippage={isAutoSlippage}
      />

      <Box
        sx={{
          p: {
            xs: theme.spacing(2),
            sm: theme.spacing(2.5),
            md: theme.spacing(3)
          },
          ...(customVariantSettings?.tradeWidgetBackgroundColor && {
            backgroundColor: `${customVariantSettings.tradeWidgetBackgroundColor} !important`,
          }),
          ...glassStyles,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: theme.spacing(2) }}
        >
          <Typography
            variant={isMobile ? "body1" : "h6"}
            sx={{
              fontWeight: theme.typography.fontWeightMedium,
              color: isGlassVariant ? textColor : 'inherit'
            }}
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

        {renderContent()}
      </Box>
    </>
  );
}
