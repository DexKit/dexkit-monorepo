import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { Token } from '@dexkit/core/types';
import { useForceThemeMode } from '@dexkit/ui/hooks';
import { TokenBalance } from '@dexkit/ui/modules/wallet/types';
import { ArrowBack } from '@mui/icons-material';
import {
  Box,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import ExchangeWidget from '../../page-editor/components/ExchangeWidget';

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
}

export default function GlassExchangeContainer({
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
}: Props) {
  const containerId = React.useMemo(() => Math.random().toString(36).substr(2, 9), []);
  const theme = useTheme();
  const themeModeObj = useForceThemeMode();
  const themeMode = themeModeObj.mode;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = themeMode === 'dark' || theme.palette.mode === 'dark';
  const effectiveTextColor = isDark ? textColor : theme.palette.text.primary;

  const quoteToken: Token = {
    address: '0x0000000000000000000000000000000000000000',
    chainId: selectedCoin.token.chainId as ChainId,
    decimals: 18,
    symbol: NETWORKS[selectedCoin.token.chainId]?.coinSymbol || NETWORKS[selectedCoin.token.chainId]?.symbol || 'ETH',
    name: NETWORKS[selectedCoin.token.chainId]?.coinName || NETWORKS[selectedCoin.token.chainId]?.name || 'Ethereum',
    logoURI: NETWORKS[selectedCoin.token.chainId]?.coinImageUrl || NETWORKS[selectedCoin.token.chainId]?.imageUrl || '',
  };

  const exchangeConfig = React.useMemo(() => {
    const { token } = selectedCoin;

    return {
      enableUrlParams: false,
      baseToken: token,
      quoteToken: quoteToken,
      defaultChainId: token.chainId,
      variant: "glass",
      lockedBaseToken: token,
      availNetworks: [token.chainId],
      disableNetworkChange: true,
      glassSettings: {
        blurIntensity: blurIntensity,
        glassOpacity: glassOpacity,
        textColor: textColor,
        backgroundColor: backgroundColor,
        backgroundImage: backgroundImage,
        backgroundSize: backgroundSize,
        backgroundPosition: backgroundPosition,
        backgroundRepeat: backgroundRepeat,
        disableBackground: Boolean(backgroundColor || backgroundImage),
      },
      lockedQuoteToken: quoteToken,
    };
  }, [
    selectedCoin.token,
    blurIntensity,
    glassOpacity,
    textColor,
    backgroundColor,
    backgroundImage,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat
  ]);

  const exchangeWidgetKey = React.useMemo(() => {
    return `exchange-glass-${selectedCoin.token.chainId}-${selectedCoin.token.address}`;
  }, [selectedCoin.token.chainId, selectedCoin.token.address]);

  const getGlassExchangeCardStyles = () => {
    return {
      background: `rgba(255, 255, 255, ${glassOpacity})`,
      backdropFilter: `blur(${blurIntensity}px)`,
      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
      borderRadius: isMobile ? '12px' : '16px',
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
      borderRadius: isMobile ? '8px' : '12px',
      color: effectiveTextColor,
      padding: isMobile ? theme.spacing(0.75) : theme.spacing(1),
      minWidth: isMobile ? 40 : 48,
      width: isMobile ? 40 : 48,
      height: isMobile ? 40 : 48,
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
      minHeight: isMobile ? 'auto' : '100vh',
      height: isMobile ? 'auto' : '100vh',
      overflow: isMobile ? 'visible' : 'hidden',
      background: backgroundColor || 'none',
      backgroundSize: backgroundSize,
      backgroundPosition: backgroundPosition,
      backgroundRepeat: backgroundRepeat,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Container
          maxWidth={isMobile ? false : "lg"}
          disableGutters={isMobile}
          sx={{
            py: isMobile ? 1 : 4,
            px: isMobile ? 1 : 3,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            maxWidth: isMobile ? '100%' : undefined,
          }}
        >
          <Stack
            spacing={isMobile ? 1.5 : 3}
            sx={{
              flex: 1,
              height: '100%',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={isMobile ? 1.5 : 3}
              sx={{
                py: isMobile ? 1 : 0,
                px: isMobile ? 0.5 : 0,
              }}
            >
              <IconButton
                onClick={onBack}
                sx={getGlassBackButtonStyles()}
              >
                <ArrowBack sx={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }} />
              </IconButton>
              <Typography
                variant="body1"
                component="h2"
                sx={{
                  color: `${effectiveTextColor} !important`,
                  fontWeight: '600 !important',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  fontSize: isMobile ? '1.25rem !important' : '1.5rem !important',
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
                  lineHeight: 1.2,
                  '&::before': {
                    display: 'none !important',
                  },
                  '&::after': {
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
                  id="exchange.token"
                  defaultMessage="Exchange {symbol}"
                  values={{ symbol: selectedCoin.token.symbol.toUpperCase() }}
                />
              </Typography>
            </Stack>

            {/* Widget de Exchange */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                flex: 1,
                width: '100%',
              }}
            >
              <Paper
                sx={{
                  width: '100%',
                  maxWidth: isMobile ? '100%' : '1200px',
                  p: 0,
                  ...getGlassExchangeCardStyles(),
                  minHeight: isMobile ? 'auto' : 'auto',
                }}
              >
                <ExchangeWidget
                  key={exchangeWidgetKey}
                  formData={{
                    defaultNetwork: selectedCoin.token.chainId as ChainId,
                    defaultPairs: {
                      [selectedCoin.token.chainId]: {
                        baseToken: selectedCoin.token,
                        quoteToken: quoteToken,
                      },
                    },
                    defaultTokens: {
                      [selectedCoin.token.chainId]: {
                        baseTokens: [selectedCoin.token],
                        quoteTokens: [quoteToken],
                      },
                    },
                    availNetworks: [selectedCoin.token.chainId as ChainId],
                    variant: 'glass',
                    glassSettings: {
                      blurIntensity: blurIntensity,
                      glassOpacity: glassOpacity,
                      textColor: textColor,
                      backgroundColor: backgroundColor,
                      backgroundImage: backgroundImage,
                      backgroundSize: backgroundSize as "cover" | "contain" | "auto" | "100% 100%",
                      backgroundPosition: backgroundPosition as "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right",
                      backgroundRepeat: backgroundRepeat as "no-repeat" | "repeat" | "repeat-x" | "repeat-y",
                      disableBackground: Boolean(backgroundColor || backgroundImage),
                    },
                    lockedBaseToken: selectedCoin.token,
                    lockedQuoteToken: quoteToken,
                  }}
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