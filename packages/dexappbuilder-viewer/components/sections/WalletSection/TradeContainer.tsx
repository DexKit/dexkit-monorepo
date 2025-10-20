import { TokenBalance } from '@dexkit/ui/modules/wallet/types';
import { SwapVariant } from '@dexkit/ui/modules/wizard/types';
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
import SwapWidget from '../../page-editor/components/SwapWidget';

interface Props {
  selectedCoin: TokenBalance;
  onBack: () => void;
  customSettings?: WalletCustomSettings;
}

const LockedBuyTokenSwapWidget = ({ formData, ...props }: any) => {
  return (
    <SwapWidget
      {...props}
      formData={{
        ...formData,
        disableNetworkChange: true,
        disableNetworkSelector: true,
        keepTokenAlwaysPresent: true,
        lockedToken: formData.lockedBuyToken,
      }}
    />
  );
};

export default function TradeContainer({ selectedCoin, onBack, customSettings }: Props) {
  const theme = useTheme();

  const swapConfig = React.useMemo(() => {
    const { token } = selectedCoin;

    return {
      enableUrlParams: false,
      configByChain: {
        [token.chainId]: {
          slippage: 0.5,
          buyToken: token,
        },
      },
      defaultChainId: token.chainId,
      variant: customSettings?.swapConfig?.variant || SwapVariant.Classic,
      useGasless: true,
      myTokensOnlyOnSearch: false,
      enableImportExternTokens: true,
      disableNetworkChange: true,
      disableNetworkSelector: true,
      keepTokenAlwaysPresent: true,
      lockedBuyToken: token,
    };
  }, [selectedCoin.token.chainId, selectedCoin.token.address, customSettings?.swapConfig?.variant]);

  const swapWidgetKey = React.useMemo(() => {
    return `swap-${selectedCoin.token.chainId}-${selectedCoin.token.address}`;
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

  const getSwapCardStyles = () => {
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

  const isCompactVariant = React.useMemo(() => {
    const variant = customSettings?.swapConfig?.variant;
    return variant === SwapVariant.Minimal || variant === SwapVariant.Compact;
  }, [customSettings?.swapConfig?.variant]);

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
          maxWidth={isCompactVariant ? "sm" : "md"}
          sx={{
            py: isCompactVariant ? 2 : 4,
            px: isCompactVariant ? 1 : 3,
          }}
        >
          <Stack spacing={isCompactVariant ? 2 : 3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                onClick={onBack}
                sx={{
                  bgcolor: getContainerBackground(),
                  color: customSettings?.primaryTextColor || theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                  },
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant={isCompactVariant ? "h6" : "h5"}
                sx={{
                  color: customSettings?.primaryTextColor || theme.palette.text.primary,
                  fontWeight: 'bold',
                }}
              >
                <FormattedMessage
                  id="swap.token"
                  defaultMessage="Swap {symbol}"
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
              {isCompactVariant ? (
                <Box sx={{ width: '100%', maxWidth: '400px' }}>
                  <LockedBuyTokenSwapWidget
                    key={swapWidgetKey}
                    formData={swapConfig}
                    isEditMode={false}
                  />
                </Box>
              ) : (
                <Paper
                  sx={{
                    width: '100%',
                    maxWidth: '480px',
                    p: 0,
                    ...getSwapCardStyles(),
                  }}
                >
                  <LockedBuyTokenSwapWidget
                    key={swapWidgetKey}
                    formData={swapConfig}
                    isEditMode={false}
                  />
                </Paper>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
} 