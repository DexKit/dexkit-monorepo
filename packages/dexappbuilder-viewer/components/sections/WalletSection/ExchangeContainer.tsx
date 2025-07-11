import { NETWORKS } from '@dexkit/core/constants/networks';
import { TokenBalance } from '@dexkit/ui/modules/wallet/types';
import { WalletCustomSettings } from '@dexkit/ui/modules/wizard/types/section';
import { ArrowBack } from '@mui/icons-material';
import {
  Box,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import ExchangeWidget from '../../page-editor/components/ExchangeWidget';

interface Props {
  selectedCoin: TokenBalance;
  onBack: () => void;
  customSettings?: WalletCustomSettings;
}

export default function ExchangeContainer({ selectedCoin, onBack, customSettings }: Props) {
  console.log('📦 ExchangeContainer (CUSTOM): Rendering');
  const theme = useTheme();

  const exchangeConfig = React.useMemo(() => {
    const { token } = selectedCoin;

    const nativeTokenAddress = "0x0000000000000000000000000000000000000000";

    const quoteToken = {
      address: nativeTokenAddress,
      chainId: token.chainId,
      decimals: 18,
      symbol: NETWORKS[token.chainId]?.coinSymbol || NETWORKS[token.chainId]?.symbol || 'ETH',
      name: NETWORKS[token.chainId]?.coinName || NETWORKS[token.chainId]?.name || 'Ethereum',
      logoURI: NETWORKS[token.chainId]?.coinImageUrl || NETWORKS[token.chainId]?.imageUrl || '',
    };

    const selectedVariant = customSettings?.exchangeConfig?.variant || "default";

    const baseConfig = {
      defaultNetwork: token.chainId,
      defaultPairs: {
        [token.chainId]: {
          baseToken: token,
          quoteToken: quoteToken,
        },
      },
      defaultTokens: {
        [token.chainId]: {
          baseTokens: [token],
          quoteTokens: [quoteToken],
        },
      },
      availNetworks: [token.chainId],
      variant: selectedVariant as "default" | "custom",
      lockedBaseToken: token,
      lockedQuoteToken: quoteToken,
    };

    if (selectedVariant === "custom") {
      return {
        ...baseConfig,
        customVariantSettings: {
          showPairInfo: true,
          showTradingGraph: true,
          showTradeWidget: true,
          layout: "grid" as const,
          spacing: 3,
          backgroundColor: customSettings?.cardConfig?.backgroundColor,
          borderRadius: customSettings?.cardConfig?.borderRadius,
          padding: 2,
          componentOrder: ['pairInfo', 'tradeWidget', 'tradingGraph'],
          pairInfoBackgroundColor: customSettings?.exchangeTextColors?.pairInfoBackgroundColor || customSettings?.cardConfig?.backgroundColor,
          pairInfoTextColor: customSettings?.exchangeTextColors?.pairInfoTextColor || customSettings?.primaryTextColor || theme.palette.text.primary,
          pairInfoSecondaryTextColor: customSettings?.exchangeTextColors?.pairInfoSecondaryTextColor || theme.palette.text.secondary,
          pairInfoBorderColor: customSettings?.cardConfig?.borderColor,
          tradeWidgetBackgroundColor: customSettings?.exchangeTextColors?.tradeWidgetBackgroundColor || customSettings?.cardConfig?.backgroundColor,
          tradeWidgetTextColor: customSettings?.exchangeTextColors?.tradeWidgetTextColor || customSettings?.primaryTextColor || theme.palette.text.primary,
          tradeWidgetBorderColor: customSettings?.cardConfig?.borderColor,
          tradeWidgetButtonColor: customSettings?.swapButtonConfig?.backgroundColor,
          tradeWidgetButtonTextColor: customSettings?.exchangeTextColors?.tradeWidgetButtonTextColor || customSettings?.swapButtonConfig?.textColor,
          tradeWidgetTabTextColor: customSettings?.exchangeTextColors?.tradeWidgetTabTextColor || (theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'),
          tradeWidgetInputTextColor: customSettings?.exchangeTextColors?.tradeWidgetInputTextColor || theme.palette.text.primary,
          tradingGraphBackgroundColor: customSettings?.exchangeTextColors?.tradingGraphBackgroundColor || customSettings?.cardConfig?.backgroundColor,
          tradingGraphControlTextColor: customSettings?.exchangeTextColors?.tradingGraphControlTextColor || theme.palette.text.primary,
          tradingGraphBorderColor: customSettings?.cardConfig?.borderColor,
        },
      };
    }

    return baseConfig;
  }, [selectedCoin.token.chainId, selectedCoin.token.address, customSettings, theme.palette]);

  const exchangeWidgetKey = React.useMemo(() => {
    return `exchange-${selectedCoin.token.chainId}-${selectedCoin.token.address}`;
  }, [selectedCoin.token.chainId, selectedCoin.token.address]);

  const getContainerBackground = () => {
    const selectedVariant = customSettings?.exchangeConfig?.variant || "default";

    if (selectedVariant === "custom") {
      if (customSettings?.backgroundType === 'image' && customSettings?.backgroundImage) {
        return `url(${customSettings.backgroundImage})`;
      } else if (customSettings?.backgroundType === 'solid') {
        return customSettings.backgroundColor || theme.palette.background.default;
      } else if (customSettings?.backgroundType === 'gradient') {
        const from = customSettings?.gradientStartColor || theme.palette.background.default;
        const to = customSettings?.gradientEndColor || theme.palette.background.paper;
        const direction = customSettings?.gradientDirection || 'to bottom';

        const directionMap: Record<string, string> = {
          'to bottom': '180deg',
          'to top': '0deg',
          'to right': '90deg',
          'to left': '270deg',
          'to bottom right': '135deg',
          'to bottom left': '225deg',
        };
        const gradientDirection = directionMap[direction] || '180deg';
        return `linear-gradient(${gradientDirection}, ${from}, ${to})`;
      }
    }

    return theme.palette.background.default;
  };

  const getExchangeCardStyles = () => {
    const selectedVariant = customSettings?.exchangeConfig?.variant || "default";

    if (selectedVariant === "custom") {
      const shadowIntensity = customSettings?.cardConfig?.shadowIntensity || 0.1;
      const hasShadow = shadowIntensity > 0;

      return {
        borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
        backgroundColor: customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
        border: `1px solid ${customSettings?.cardConfig?.borderColor || theme.palette.divider}`,
        boxShadow: hasShadow ? `0 4px 20px rgba(0, 0, 0, ${shadowIntensity})` : 'none',
        overflow: 'hidden',
        '&:hover': {
          transform: 'none',
          boxShadow: hasShadow ? `0 8px 30px rgba(0, 0, 0, ${shadowIntensity * 1.5})` : 'none',
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      };
    }

    return {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      overflow: 'hidden',
    };
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          zIndex: 0,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: getContainerBackground(),
          backgroundSize: customSettings?.exchangeConfig?.variant === "custom" ? (customSettings?.backgroundSize || 'cover') : 'cover',
          backgroundPosition: customSettings?.exchangeConfig?.variant === "custom" ? (customSettings?.backgroundPosition || 'center') : 'center',
          backgroundRepeat: customSettings?.exchangeConfig?.variant === "custom" ? (customSettings?.backgroundRepeat || 'no-repeat') : 'no-repeat',
          backgroundAttachment: customSettings?.exchangeConfig?.variant === "custom" ? (customSettings?.backgroundAttachment || 'scroll') : 'scroll',
          filter: customSettings?.exchangeConfig?.variant === "custom" && typeof customSettings?.backgroundBlur === 'number' && customSettings.backgroundBlur > 0 ? `blur(${customSettings.backgroundBlur}px)` : 'none',
          WebkitFilter: customSettings?.exchangeConfig?.variant === "custom" && typeof customSettings?.backgroundBlur === 'number' && customSettings.backgroundBlur > 0 ? `blur(${customSettings.backgroundBlur}px)` : 'none',
          pointerEvents: 'none',
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Container
          maxWidth="xl"
          sx={{
            py: 4,
            px: 3,
          }}
        >
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                onClick={onBack}
                sx={{
                  bgcolor: customSettings?.exchangeConfig?.variant === "custom"
                    ? (customSettings?.backButtonConfig?.backgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper)
                    : theme.palette.background.paper,
                  color: customSettings?.exchangeConfig?.variant === "custom"
                    ? (customSettings?.backButtonConfig?.textColor || customSettings?.primaryTextColor || theme.palette.text.primary)
                    : theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: customSettings?.exchangeConfig?.variant === "custom"
                      ? (customSettings?.backButtonConfig?.hoverBackgroundColor || theme.palette.action.hover)
                      : theme.palette.action.hover,
                  },
                  border: customSettings?.exchangeConfig?.variant === "custom"
                    ? (customSettings?.backButtonConfig?.borderColor
                      ? `1px solid ${customSettings.backButtonConfig.borderColor}`
                      : `1px solid ${customSettings?.cardConfig?.borderColor || theme.palette.divider}`)
                    : `1px solid ${theme.palette.divider}`,
                  borderRadius: customSettings?.exchangeConfig?.variant === "custom"
                    ? (customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius)
                    : theme.shape.borderRadius,
                  boxShadow: customSettings?.exchangeConfig?.variant === "custom"
                    ? (customSettings?.cardConfig?.shadowIntensity && customSettings.cardConfig.shadowIntensity > 0
                      ? `0 2px 8px rgba(0, 0, 0, ${customSettings.cardConfig.shadowIntensity})`
                      : 'none')
                    : 'none',
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant="h5"
                sx={{
                  color: customSettings?.exchangeConfig?.variant === "custom"
                    ? (customSettings?.primaryTextColor || theme.palette.text.primary)
                    : theme.palette.text.primary,
                  fontWeight: 'bold',
                }}
              >
                <FormattedMessage
                  id="exchange.token"
                  defaultMessage="Exchange {symbol}"
                  values={{ symbol: selectedCoin.token.symbol.toUpperCase() }}
                />
              </Typography>
            </Stack>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Paper
                sx={{
                  width: '100%',
                  maxWidth: '1400px',
                  p: 0,
                  ...getExchangeCardStyles(),
                }}
              >
                <ExchangeWidget
                  key={exchangeWidgetKey}
                  formData={exchangeConfig}
                  isEditMode={false}
                />
              </Paper>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
} 