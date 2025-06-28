import { TokenBalance } from '@dexkit/ui/modules/wallet/types';
import { SwapVariant } from '@dexkit/ui/modules/wizard/types';
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

interface Props {
  selectedCoin: TokenBalance;
  onBack: () => void;
  blurIntensity?: number;
  glassOpacity?: number;
  textColor?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  swapVariant?: SwapVariant;
}

export default function GlassTradeContainer({
  selectedCoin,
  onBack,
  blurIntensity = 40,
  glassOpacity = 0.10,
  textColor = '#ffffff',
  backgroundColor,
  backgroundImage,
  backgroundSize = 'cover',
  backgroundPosition = 'center',
  backgroundRepeat = 'no-repeat',
  swapVariant = SwapVariant.Classic
}: Props) {
  const theme = useTheme();

  const isCompactVariant = React.useMemo(() => {
    return swapVariant === SwapVariant.Minimal || swapVariant === SwapVariant.Compact;
  }, [swapVariant]);

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
      variant: swapVariant,
      useGasless: true,
      myTokensOnlyOnSearch: false,
      enableImportExternTokens: true,
      disableNetworkChange: true,
      disableNetworkSelector: true,
      keepTokenAlwaysPresent: true,
      lockedBuyToken: token,
    };
  }, [selectedCoin.token.chainId, selectedCoin.token.address, swapVariant]);

  const swapWidgetKey = React.useMemo(() => {
    return `swap-glass-${selectedCoin.token.chainId}-${selectedCoin.token.address}`;
  }, [selectedCoin.token.chainId, selectedCoin.token.address]);

  const getGlassSwapCardStyles = () => {
    return {
      background: `rgba(255, 255, 255, ${glassOpacity})`,
      backdropFilter: `blur(${blurIntensity}px)`,
      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
      borderRadius: '16px',
      boxShadow: `
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
      `,
      overflow: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 'inherit',
        pointerEvents: 'none',
        zIndex: 1,
      },
      '& > *': {
        position: 'relative',
        zIndex: 2,
      },
      '&:hover': {
        background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.15)})`,
        boxShadow: `
          0 12px 40px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.25),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
        `,
      },
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };
  };

  const getGlassBackButtonStyles = () => {
    return {
      background: `rgba(255, 255, 255, ${glassOpacity})`,
      backdropFilter: `blur(${blurIntensity}px)`,
      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
      borderRadius: '12px',
      color: textColor,
      boxShadow: `
        0 4px 16px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
      '&:hover': {
        background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.2)})`,
        boxShadow: `
          0 6px 20px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.25)
        `,
      },
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };
  };

  return (
    <Box sx={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      background: backgroundColor || 'none',
      backgroundSize: backgroundSize,
      backgroundPosition: backgroundPosition,
      backgroundRepeat: backgroundRepeat,
    }}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Container
          maxWidth={isCompactVariant ? "sm" : "md"}
          sx={{
            py: isCompactVariant ? 2 : 4,
            px: isCompactVariant ? 1 : 3,
          }}
        >
          <Stack spacing={isCompactVariant ? 2 : 3}>
            <Stack direction="row" alignItems="center" spacing={isCompactVariant ? 2 : 3}>
              <IconButton
                onClick={onBack}
                sx={getGlassBackButtonStyles()}
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant="body1"
                component="h2"
                sx={{
                  color: `${textColor} !important`,
                  fontWeight: '600 !important',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  fontSize: isCompactVariant ? '1.25rem !important' : '1.5rem !important',
                  background: 'transparent !important',
                  backgroundColor: 'transparent !important',
                  backdropFilter: 'none !important',
                  WebkitBackdropFilter: 'none !important',
                  border: 'none !important',
                  borderRadius: '0 !important',
                  padding: '0 !important',
                  margin: '0 !important',
                  marginLeft: '8px !important',
                  boxShadow: 'none !important',
                  display: 'inline !important',
                  position: 'static !important',
                  '&::before': {
                    display: 'none !important',
                  },
                  '&:hover': {
                    background: 'transparent !important',
                    backgroundColor: 'transparent !important',
                    backdropFilter: 'none !important',
                    WebkitBackdropFilter: 'none !important',
                    transform: 'none !important',
                    boxShadow: 'none !important',
                    scale: 'none !important',
                  },
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
                    ...getGlassSwapCardStyles(),
                    '& .MuiStack-root': {
                      gap: '24px !important',
                    },
                    '& > div > div': {
                      marginBottom: '16px !important',
                    },
                    '& [role="button"]:has(svg)': {
                      margin: '16px 0 !important',
                      zIndex: 10,
                    },
                    '& .MuiTypography-root.MuiTypography-body2.MuiTypography-alignRight.css-12u9q6g-MuiTypography-root': {
                      background: 'none !important',
                      backgroundColor: 'transparent !important',
                      backdropFilter: 'none !important',
                      WebkitBackdropFilter: 'none !important',
                      border: 'none !important',
                      borderRadius: '0 !important',
                      padding: '0 !important',
                      boxShadow: 'none !important',
                      position: 'static !important',
                      zIndex: 'auto !important',
                      '&::before, &::after': {
                        display: 'none !important',
                      },
                      '&:hover': {
                        background: 'none !important',
                        backgroundColor: 'transparent !important',
                        backdropFilter: 'none !important',
                        WebkitBackdropFilter: 'none !important',
                        transform: 'none !important',
                        boxShadow: 'none !important',
                      },
                    },
                    '& .css-12u9q6g-MuiTypography-root': {
                      background: 'none !important',
                      backgroundColor: 'transparent !important',
                      backdropFilter: 'none !important',
                      WebkitBackdropFilter: 'none !important',
                      border: 'none !important',
                      borderRadius: '0 !important',
                      padding: '0 !important',
                      boxShadow: 'none !important',
                      position: 'static !important',
                      zIndex: 'auto !important',
                      '&::before, &::after': {
                        display: 'none !important',
                      },
                      '&:hover': {
                        background: 'none !important',
                        backgroundColor: 'transparent !important',
                        backdropFilter: 'none !important',
                        WebkitBackdropFilter: 'none !important',
                        transform: 'none !important',
                        boxShadow: 'none !important',
                      },
                    },
                    [theme.breakpoints.up('md')]: {
                      '& .MuiTypography-root.MuiTypography-body2.MuiTypography-alignRight.css-12u9q6g-MuiTypography-root': {
                        background: 'none !important',
                        backgroundColor: 'transparent !important',
                        backdropFilter: 'none !important',
                        WebkitBackdropFilter: 'none !important',
                        border: 'none !important',
                        borderRadius: '0 !important',
                        padding: '0 !important',
                        boxShadow: 'none !important',
                        position: 'static !important',
                        zIndex: 'auto !important',
                        '&::before, &::after': {
                          display: 'none !important',
                        },
                        '&:hover': {
                          background: 'none !important',
                          backgroundColor: 'transparent !important',
                          backdropFilter: 'none !important',
                          WebkitBackdropFilter: 'none !important',
                          transform: 'none !important',
                          boxShadow: 'none !important',
                        },
                      },
                      '& .css-12u9q6g-MuiTypography-root': {
                        background: 'none !important',
                        backgroundColor: 'transparent !important',
                        backdropFilter: 'none !important',
                        WebkitBackdropFilter: 'none !important',
                        border: 'none !important',
                        borderRadius: '0 !important',
                        padding: '0 !important',
                        boxShadow: 'none !important',
                        position: 'static !important',
                        zIndex: 'auto !important',
                        '&::before, &::after': {
                          display: 'none !important',
                        },
                        '&:hover': {
                          background: 'none !important',
                          backgroundColor: 'transparent !important',
                          backdropFilter: 'none !important',
                          WebkitBackdropFilter: 'none !important',
                          transform: 'none !important',
                          boxShadow: 'none !important',
                        },
                      },
                    },
                    '& button[type="button"]:not([aria-label])': {
                      background: `rgba(255, 255, 255, ${glassOpacity}) !important`,
                      backdropFilter: `blur(${blurIntensity}px) !important`,
                      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)}) !important`,
                      borderRadius: '12px !important',
                      color: `${textColor} !important`,
                      fontWeight: '600 !important',
                      boxShadow: `
                      0 4px 16px rgba(0, 0, 0, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important',
                      '&:hover': {
                        background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.2)}) !important`,
                        boxShadow: `
                        0 6px 20px rgba(0, 0, 0, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.25)
                      `,

                        color: `${textColor} !important`,
                      },
                      '&:disabled': {
                        background: `rgba(255, 255, 255, ${glassOpacity * 0.5}) !important`,
                        color: `${textColor}80 !important`,
                      },
                    },
                    '& button[aria-label], & [role="button"]:has(svg)': {
                      background: `rgba(255, 255, 255, ${glassOpacity}) !important`,
                      backdropFilter: `blur(${blurIntensity}px) !important`,
                      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)}) !important`,
                      borderRadius: '50% !important',
                      color: `${textColor} !important`,
                      boxShadow: `
                      0 4px 16px rgba(0, 0, 0, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important',
                      '&:hover': {
                        background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.2)}) !important`,
                        boxShadow: `
                        0 6px 20px rgba(0, 0, 0, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.25)
                      `,
                        color: `${textColor} !important`,
                      },
                      '& svg': {
                        color: `${textColor} !important`,
                      },
                    },
                    '& button:has([data-testid="SettingsIcon"]), & button:has(svg[data-testid="SettingsIcon"])': {
                      background: `rgba(255, 255, 255, ${glassOpacity}) !important`,
                      backdropFilter: `blur(${blurIntensity}px) !important`,
                      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)}) !important`,
                      borderRadius: '50% !important',
                      color: `${textColor} !important`,
                      boxShadow: `
                      0 4px 16px rgba(0, 0, 0, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important',
                      '&:hover': {
                        background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.2)}) !important`,
                        boxShadow: `
                        0 6px 20px rgba(0, 0, 0, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.25)
                      `,
                        color: `${textColor} !important`,
                      },
                      '& svg': {
                        color: `${textColor} !important`,
                      },
                    },
                    '& .MuiButton-root': {
                      '& .MuiButton-startIcon': {
                        marginLeft: '0 !important',
                        marginRight: '4px !important',
                      },
                    },
                    '& button[role="button"]:has(img)': {
                      paddingLeft: '8px !important',
                      '& img': {
                        marginRight: '4px !important',
                      },
                    },
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