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

    return {
      // Propiedades requeridas por DexkitExchangeSettings
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
      variant: "custom" as const,
      customVariantSettings: {
        showPairInfo: true,
        showTradingGraph: true,
        showTradeWidget: true,
        layout: "horizontal" as const,
        spacing: 3,
        backgroundColor: customSettings?.cardConfig?.backgroundColor,
        borderRadius: customSettings?.cardConfig?.borderRadius,
        padding: 2,
        componentOrder: ['pairInfo', 'tradeWidget', 'tradingGraph'],
        pairInfoBackgroundColor: customSettings?.cardConfig?.backgroundColor,
        pairInfoTextColor: customSettings?.primaryTextColor,
        pairInfoBorderColor: customSettings?.cardConfig?.borderColor,
        tradeWidgetBackgroundColor: customSettings?.cardConfig?.backgroundColor,
        tradeWidgetTextColor: customSettings?.primaryTextColor,
        tradeWidgetBorderColor: customSettings?.cardConfig?.borderColor,
        tradeWidgetButtonColor: customSettings?.swapButtonConfig?.backgroundColor,
        tradeWidgetButtonTextColor: customSettings?.swapButtonConfig?.textColor,
        tradingGraphBackgroundColor: customSettings?.cardConfig?.backgroundColor,
        tradingGraphBorderColor: customSettings?.cardConfig?.borderColor,
      },

      // Propiedades adicionales para bloqueo
      lockedBaseToken: token,
      lockedQuoteToken: quoteToken,
    };
  }, [selectedCoin.token.chainId, selectedCoin.token.address, customSettings]);

  const exchangeWidgetKey = React.useMemo(() => {
    return `exchange-${selectedCoin.token.chainId}-${selectedCoin.token.address}`;
  }, [selectedCoin.token.chainId, selectedCoin.token.address]);

  const getContainerBackground = () => {
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
    return theme.palette.background.default;
  };

  const getExchangeCardStyles = () => {
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
          backgroundSize: customSettings?.backgroundSize || 'cover',
          backgroundPosition: customSettings?.backgroundPosition || 'center',
          backgroundRepeat: customSettings?.backgroundRepeat || 'no-repeat',
          backgroundAttachment: customSettings?.backgroundAttachment || 'scroll',
          filter: typeof customSettings?.backgroundBlur === 'number' && customSettings.backgroundBlur > 0 ? `blur(${customSettings.backgroundBlur}px)` : 'none',
          WebkitFilter: typeof customSettings?.backgroundBlur === 'number' && customSettings.backgroundBlur > 0 ? `blur(${customSettings.backgroundBlur}px)` : 'none',
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
                  bgcolor: customSettings?.backButtonConfig?.backgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
                  color: customSettings?.backButtonConfig?.textColor || customSettings?.primaryTextColor || theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: customSettings?.backButtonConfig?.hoverBackgroundColor || theme.palette.action.hover,
                  },
                  border: customSettings?.backButtonConfig?.borderColor
                    ? `1px solid ${customSettings.backButtonConfig.borderColor}`
                    : `1px solid ${customSettings?.cardConfig?.borderColor || theme.palette.divider}`,
                  borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
                  boxShadow: customSettings?.cardConfig?.shadowIntensity && customSettings.cardConfig.shadowIntensity > 0
                    ? `0 2px 8px rgba(0, 0, 0, ${customSettings.cardConfig.shadowIntensity})`
                    : 'none',
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant="h5"
                sx={{
                  color: customSettings?.primaryTextColor || theme.palette.text.primary,
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