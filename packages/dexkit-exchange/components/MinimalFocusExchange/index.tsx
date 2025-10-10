import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Card,
  CardContent,
  Container,
  Fade,
  Grow,
  IconButton,
  Skeleton,
  Slide,
  Stack,
  Typography,
  useTheme,
  Zoom,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useExchangeContext } from "../../hooks";
import { ExchangeGlassSettings } from "../../types";
import PairInfo from "../PairInfo";
import TradeWidget from "../TradeWidget";

export interface MinimalFocusExchangeProps {
  settings?: ExchangeGlassSettings;
  isActive?: boolean;
}

const defaultSettings: ExchangeGlassSettings = {
  primaryColor: "#007AFF",
  accentColor: "#34C759",
  textColor: "#FFFFFF",
  backgroundType: "solid",
  backgroundColor: "#1a1a1a",
  backgroundGradient: {
    from: "#1a1a1a",
    to: "#2d2d2d",
    direction: "to-br",
  },
  glassmorphism: {
    enabled: true,
    opacity: 0.8,
    blur: 20,
  },
  animations: {
    enabled: true,
    duration: 300,
    easing: "ease-in-out",
  },
  minimalism: {
    hideLabels: false,
    compactMode: false,
    hideSecondaryInfo: false,
  },
  spacing: {
    component: 3,
    internal: 2,
  },
};

export default function MinimalFocusExchange({
  settings = defaultSettings,
  isActive = true,
}: MinimalFocusExchangeProps) {
  const theme = useTheme();
  const { quoteToken, baseToken } = useExchangeContext();
  const [mounted, setMounted] = useState(false);

  const mergedSettings = useMemo(
    () => ({ ...defaultSettings, ...settings }),
    [settings]
  );

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useMemo(() => {
    const { backgroundGradient, glassmorphism } = mergedSettings;

    const backgroundType = settings?.backgroundType || mergedSettings.backgroundType;
    const backgroundColor = settings?.backgroundColor || mergedSettings.backgroundColor;
    const gradientFrom = settings?.gradientStartColor || backgroundGradient?.from;
    const gradientTo = settings?.gradientEndColor || backgroundGradient?.to;
    const gradientDirection = settings?.gradientDirection || backgroundGradient?.direction;

    const getBackground = () => {
      if (backgroundType === 'solid' && backgroundColor) {
        return backgroundColor;
      } else if (gradientFrom && gradientTo) {
        const dirMap: Record<string, string> = {
          'to bottom': '180deg',
          'to top': '0deg',
          'to right': '90deg',
          'to left': '270deg',
          'to bottom right': '135deg',
          'to bottom left': '225deg',
          'to-br': '135deg',
          'to-b': '180deg',
          'to-r': '90deg',
          'to-bl': '225deg'
        };
        const direction = dirMap[gradientDirection || 'to bottom'] || '180deg';
        return `linear-gradient(${direction}, ${gradientFrom}, ${gradientTo})`;
      } else {
        return backgroundGradient
          ? `linear-gradient(${backgroundGradient.direction || "to-br"}, ${backgroundGradient.from}, ${backgroundGradient.to})`
          : theme.palette.background.default;
      }
    };

    return {
      background: getBackground(),
      minHeight: "100vh",
      position: "relative" as const,
      overflow: "hidden",
      "&::before": glassmorphism?.enabled
        ? {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 30% 20%, ${theme.alpha(mergedSettings.primaryColor || "#007AFF", 0.1)} 0%, transparent 50%), radial-gradient(circle at 70% 80%, ${theme.alpha(mergedSettings.accentColor || "#34C759", 0.1)} 0%, transparent 50%)`,
          pointerEvents: "none",
        }
        : {},
    };
  }, [mergedSettings, theme]);

  const cardStyle = useMemo(() => {
    const { glassmorphism, animations } = mergedSettings;

    const blurIntensity = settings?.blurIntensity || glassmorphism?.blur || 40;
    const glassOpacity = settings?.glassOpacity || glassmorphism?.opacity || 0.8;

    return {
      backgroundColor: glassmorphism?.enabled
        ? theme.alpha("#FFFFFF", glassOpacity)
        : theme.palette.background.paper,
      backdropFilter: glassmorphism?.enabled
        ? `blur(${blurIntensity}px) saturate(180%)`
        : "none",
      border: glassmorphism?.enabled
        ? `1px solid ${theme.alpha("#FFFFFF", 0.3)}`
        : `1px solid ${theme.palette.divider}`,
      borderRadius: theme.spacing(3),
      boxShadow: glassmorphism?.enabled
        ? `0 8px 32px ${theme.alpha("#000000", 0.1)}`
        : theme.shadows[4],
      transition: animations?.enabled
        ? `all ${animations.duration || 300}ms ${animations.easing || "ease-in-out"
        }`
        : "none",
      "&:hover": {
        boxShadow: glassmorphism?.enabled
          ? `0 12px 40px ${theme.alpha("#000000", 0.15)}`
          : theme.shadows[8],
      },
    };
  }, [mergedSettings, theme]);

  const animationTimeout = mergedSettings.animations?.duration || 300;

  const renderPairSelector = () => (
    <Fade in={mounted} timeout={animationTimeout}>
      <Card sx={{ ...cardStyle, mb: mergedSettings.spacing?.component || 3 }}>
        <CardContent sx={{ p: mergedSettings.spacing?.internal || 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Zoom in={mounted} timeout={animationTimeout + 100}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${mergedSettings.primaryColor}, ${mergedSettings.accentColor})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 12px ${theme.alpha(mergedSettings.primaryColor || "#007AFF", 0.3)}`,
                  }}
                >
                  <SwapHorizIcon sx={{ color: "#FFFFFF", fontSize: 20 }} />
                </Box>
              </Zoom>
              {quoteToken && baseToken ? (
                <Slide
                  direction="right"
                  in={mounted}
                  timeout={animationTimeout + 200}
                >
                  <Stack>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: mergedSettings.textColor,
                        fontSize: "1.1rem",
                      }}
                    >
                      {baseToken.symbol}/{quoteToken.symbol}
                    </Typography>
                    {!mergedSettings.minimalism?.hideSecondaryInfo && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.alpha(mergedSettings.textColor || "#1D1D1F", 0.6),
                          fontSize: "0.85rem",
                        }}
                      >
                        <FormattedMessage
                          id="quick.trade"
                          defaultMessage="Quick Trade"
                        />
                      </Typography>
                    )}
                  </Stack>
                </Slide>
              ) : (
                <Stack spacing={0.5}>
                  <Skeleton width={120} height={24} />
                  <Skeleton width={80} height={16} />
                </Stack>
              )}
            </Stack>
            <Grow in={mounted} timeout={animationTimeout + 150}>
              <IconButton
                sx={{
                  backgroundColor: theme.alpha(mergedSettings.primaryColor || "#007AFF", 0.1),
                  color: mergedSettings.primaryColor,
                  "&:hover": {
                    backgroundColor: theme.alpha(mergedSettings.primaryColor || "#007AFF", 0.2),
                  },
                }}
              >
                <TrendingUpIcon fontSize="small" />
              </IconButton>
            </Grow>
          </Stack>
        </CardContent>
      </Card>
    </Fade>
  );

  const renderTradeSection = () => (
    <Slide
      direction="up"
      in={mounted}
      timeout={animationTimeout + 300}
      mountOnEnter
      unmountOnExit
    >
      <Card sx={cardStyle}>
        <CardContent sx={{ p: 0 }}>
          <TradeWidget isActive={isActive} />
        </CardContent>
      </Card>
    </Slide>
  );

  const renderPairInfoSection = () => {
    if (mergedSettings.minimalism?.hideSecondaryInfo) return null;

    return (
      <Grow in={mounted} timeout={animationTimeout + 400}>
        <Card sx={{ ...cardStyle, mt: mergedSettings.spacing?.component || 3 }}>
          <CardContent sx={{ p: mergedSettings.spacing?.internal || 2 }}>
            {quoteToken && baseToken ? (
              <PairInfo
                quoteToken={quoteToken}
                baseToken={baseToken}
                isLoading={false}
              />
            ) : (
              <Stack spacing={1}>
                <Skeleton width="100%" height={20} />
                <Skeleton width="70%" height={16} />
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grow>
    );
  };

  const renderTradingGraphSection = () => {
    if (mergedSettings.minimalism?.compactMode) return null;

    return (
      <Fade in={mounted} timeout={animationTimeout + 500}>
        <Card sx={{ ...cardStyle, mt: mergedSettings.spacing?.component || 3 }}>
          <CardContent sx={{ p: mergedSettings.spacing?.internal || 2 }}>
            <Box
              sx={{
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.alpha(mergedSettings.primaryColor || "#007AFF", 0.05)}, ${theme.alpha(mergedSettings.accentColor || "#34C759", 0.05)})`,
                borderRadius: theme.spacing(2),
                border: `1px solid ${theme.alpha(mergedSettings.primaryColor || "#007AFF", 0.1)}`,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: theme.alpha(mergedSettings.textColor || "#1D1D1F", 0.6),
                  fontStyle: 'italic'
                }}
              >
                <FormattedMessage
                  id="trading.chart.placeholder"
                  defaultMessage="Trading Chart - Connect to real data source"
                />
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  return (
    <Box sx={containerStyle}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={mergedSettings.spacing?.component || 3}>
          {renderPairSelector()}
          {renderTradeSection()}
          {renderPairInfoSection()}
          {renderTradingGraphSection()}
        </Stack>
      </Container>
    </Box>
  );
} 