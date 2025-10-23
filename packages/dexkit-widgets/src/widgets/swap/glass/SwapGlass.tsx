import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import { BigNumber, providers } from "ethers";
import { FormattedMessage } from "react-intl";
import { ExecType, SwapSide } from "../types";

import { ChainId } from "@dexkit/core/constants/enums";
import { useIsMobile } from "@dexkit/core/hooks";
import { Token } from "@dexkit/core/types";
import {
  ZeroExGaslessQuoteResponse,
  ZeroExQuoteResponse,
} from "@dexkit/ui/modules/swap/types";
import { Info, Lock as LockIcon, Settings, SwapVert } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import type { UseQueryResult } from "@tanstack/react-query";
import { SUPPORTED_SWAP_CHAIN_IDS } from "../constants/supportedChainIds";
import SwapTokenFieldGlass from "./SwapTokenFieldGlass";

export interface SwapGlassProps {
  chainId?: ChainId;
  selectedChainId?: ChainId;
  currency: string;
  disabled?: boolean;
  quoteFor?: SwapSide;
  quoteQuery?: UseQueryResult<
    ZeroExGaslessQuoteResponse | ZeroExQuoteResponse | null
  >;
  provider?: providers.Web3Provider | providers.BaseProvider;
  account?: string;
  isActivating?: boolean;
  isActive?: boolean;
  isAutoSlippage?: boolean;
  maxSlippage?: number;
  priceBuy?: string;
  priceBuyLoading?: boolean;
  priceSell?: string;
  priceSellLoading?: boolean;
  sellToken?: Token;
  buyToken?: Token;
  sellAmount: BigNumber;
  buyAmount: BigNumber;
  execType?: ExecType;
  quote?: ZeroExGaslessQuoteResponse | ZeroExQuoteResponse | null;
  isExecuting: boolean;
  clickOnMax: boolean;
  sellTokenBalance?: BigNumber;
  buyTokenBalance?: BigNumber;
  insufficientBalance?: boolean;
  isProviderReady?: boolean;
  isQuoting?: boolean;
  disableNotificationsButton?: boolean;
  enableBuyCryptoButton?: boolean;
  disableFooter?: boolean;
  networkName?: string;
  featuredTokensByChain: Token[];
  onSelectToken: (selectFor: SwapSide, token?: Token) => void;
  onSwapTokens: () => void;
  onChangeSellAmount: (value: BigNumber, clickOnMax?: boolean) => void;
  onChangeBuyAmount: (value: BigNumber, clickOnMax?: boolean) => void;
  onChangeNetwork: (chanId: ChainId) => void;
  onToggleChangeNetwork: () => void;
  onShowSettings: () => void;
  onShowTransactions: () => void;
  onExec: () => void;
  onShowTransak?: () => void;
  onSetToken?: (token?: Token) => void;
  blurIntensity?: number;
  glassOpacity?: number;
  disableBackground?: boolean;
  textColor?: string;
  backgroundType?: "solid" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto" | "100% 100%";
  backgroundPosition?: string;
  gradientStartColor?: string;
  gradientEndColor?: string;
  gradientDirection?: string;
  keepTokenAlwaysPresent?: boolean;
  lockedToken?: Token;
  disableNetworkChange?: boolean;
  disableNetworkSelector?: boolean;
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
}

export default function SwapGlass({
  chainId,
  selectedChainId,
  currency,
  disabled,
  quoteFor,
  quoteQuery,
  provider,
  account,
  isActivating,
  isActive,
  isAutoSlippage,
  maxSlippage,
  priceBuy,
  priceBuyLoading,
  priceSell,
  priceSellLoading,
  sellToken,
  buyToken,
  sellAmount,
  buyAmount,
  execType,
  quote,
  isExecuting,
  clickOnMax,
  sellTokenBalance,
  buyTokenBalance,
  insufficientBalance,
  isProviderReady,
  isQuoting,
  disableNotificationsButton,
  enableBuyCryptoButton,
  disableFooter,
  networkName,
  featuredTokensByChain,
  onSelectToken,
  onSwapTokens,
  onChangeSellAmount,
  onChangeBuyAmount,
  onChangeNetwork,
  onToggleChangeNetwork,
  onShowSettings,
  onShowTransactions,
  onExec,
  onShowTransak,
  onSetToken,
  blurIntensity = 30,
  glassOpacity = 0.10,
  disableBackground = false,
  textColor,
  backgroundType,
  backgroundColor,
  backgroundImage,
  backgroundSize,
  backgroundPosition,
  gradientStartColor,
  gradientEndColor,
  gradientDirection,
  keepTokenAlwaysPresent = false,
  lockedToken,
  disableNetworkChange = false,
  disableNetworkSelector = false,
  swapFees,
}: SwapGlassProps) {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const finalTextColor = textColor || theme.palette.text.primary;

  const getGlassColors = () => {
    const isDark = theme.palette.mode === 'dark';
    return {
      background: isDark
        ? `rgba(0, 0, 0, ${glassOpacity})`
        : `rgba(255, 255, 255, ${glassOpacity})`,
      backgroundHover: isDark
        ? `rgba(0, 0, 0, ${Math.min(glassOpacity + 0.1, 0.3)})`
        : `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
      border: isDark
        ? `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`
        : `rgba(0, 0, 0, ${Math.min(glassOpacity + 0.1, 0.3)})`,
      borderHover: isDark
        ? `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.6)})`
        : `rgba(0, 0, 0, ${Math.min(glassOpacity + 0.3, 0.6)})`,
    };
  };

  const glassColors = getGlassColors();
  const isNetworkSupported = chainId && SUPPORTED_SWAP_CHAIN_IDS.includes(chainId);

  const calculatePriceImpact = (quote: any, sellAmount: BigNumber, buyAmount: BigNumber) => {
    if (!quote || !sellAmount || !buyAmount || sellAmount.isZero() || buyAmount.isZero()) {
      return null;
    }

    try {
      const expectedBuyAmount = Number(quote.buyAmount);
      const actualSellAmount = Number(quote.sellAmount);

      const actualRate = expectedBuyAmount / actualSellAmount;

      const marketRate = Number(buyAmount.toString()) / Number(sellAmount.toString());

      const priceImpact = Math.abs((actualRate - marketRate) / marketRate) * 100;

      return priceImpact;
    } catch (error) {
      return null;
    }
  };

  const getBackgroundStyles = () => {
    if (disableBackground) return { background: 'transparent' };

    switch (backgroundType) {
      case 'solid':
        return {
          background: backgroundColor || glassColors.background,
        };
      case 'gradient':
        const isDark = theme.palette.mode === 'dark';
        const startColor = gradientStartColor || (isDark ? theme.palette.background.default : theme.palette.background.paper);
        const endColor = gradientEndColor || (isDark ? theme.palette.background.paper : theme.palette.grey[100]);
        const direction = gradientDirection || 'to bottom';
        return {
          background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
        };
      case 'image':
        return {
          background: backgroundImage
            ? `url(${backgroundImage})`
            : glassColors.background,
          backgroundSize: backgroundSize || 'cover',
          backgroundPosition: backgroundPosition || 'center',
          backgroundRepeat: 'no-repeat',
        };
      default:
        return {
          background: glassColors.background,
        };
    }
  };

  if (!isNetworkSupported) {
    return (
      <Container maxWidth="xs" disableGutters>
        <Paper
          elevation={0}
          sx={{
            p: theme.spacing(3),
            textAlign: "center",
            ...getBackgroundStyles(),
            backdropFilter: `blur(${blurIntensity}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity}px)`,
            border: `1px solid ${glassColors.border}`,
            borderRadius: theme.shape.borderRadius,
            boxShadow: `0 ${theme.spacing(1)} ${theme.spacing(3)} rgba(0, 0, 0, 0.1)`,
          }}
        >
          <Typography
            variant="body2"
            gutterBottom
            sx={{
              color: finalTextColor,
              opacity: 0.8,
              mb: theme.spacing(2)
            }}
          >
            <FormattedMessage
              id="network.not.supported"
              defaultMessage="Network not supported"
            />
          </Typography>
          <Tooltip
            title={disableNetworkChange || disableNetworkSelector ? <FormattedMessage id="locked.network" defaultMessage="Locked network" /> : ""}
            arrow
            disableHoverListener={!(disableNetworkChange || disableNetworkSelector)}
            disableFocusListener={!(disableNetworkChange || disableNetworkSelector)}
          >
            <span>
              <Button
                size="small"
                variant="outlined"
                onClick={disableNetworkChange || disableNetworkSelector ? undefined : onToggleChangeNetwork}
                disabled={disableNetworkChange || disableNetworkSelector}
                tabIndex={disableNetworkChange || disableNetworkSelector ? -1 : undefined}
                aria-disabled={disableNetworkChange || disableNetworkSelector}
                sx={{
                  background: glassColors.background,
                  backdropFilter: `blur(${blurIntensity * 0.5}px)`,
                  WebkitBackdropFilter: `blur(${blurIntensity * 0.5}px)`,
                  border: `1px solid ${glassColors.border}`,
                  borderRadius: theme.shape.borderRadius,
                  color: finalTextColor,
                  px: theme.spacing(3),
                  py: theme.spacing(1),
                  opacity: disableNetworkChange || disableNetworkSelector ? 0.5 : 1,
                  pointerEvents: disableNetworkChange || disableNetworkSelector ? 'none' : undefined,
                  cursor: disableNetworkChange || disableNetworkSelector ? 'not-allowed' : 'pointer',
                  '&:hover': {
                    background: glassColors.backgroundHover,
                    borderColor: glassColors.borderHover,
                  },
                  transition: theme.transitions.create(['background-color', 'border-color'], {
                    duration: theme.transitions.duration.short,
                  }),
                }}
              >
                <FormattedMessage id="switch.network" defaultMessage="Switch Network" />
                {(disableNetworkChange || disableNetworkSelector) && <LockIcon fontSize="small" sx={{ ml: 0.5, color: 'text.disabled' }} />}
              </Button>
            </span>
          </Tooltip>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" disableGutters>
      <Box
        sx={{
          position: 'relative',
          p: theme.spacing(2),
          pb: theme.spacing(3),
          [theme.breakpoints.up('sm')]: {
            p: theme.spacing(3),
            pb: theme.spacing(4),
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: theme.spacing(1),
            right: theme.spacing(1),
            zIndex: theme.zIndex.fab,
          }}
        >
          <Tooltip title="Settings">
            <IconButton
              onClick={onShowSettings}
              size="small"
              sx={{
                p: theme.spacing(1),
                background: `rgba(0, 0, 0, 0.3)`,
                backdropFilter: `blur(${blurIntensity * 0.5}px)`,
                WebkitBackdropFilter: `blur(${blurIntensity * 0.5}px)`,
                border: `1px solid rgba(255, 255, 255, 0.4)`,
                borderRadius: theme.shape.borderRadius,
                color: 'primary.contrastText',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  background: `rgba(0, 0, 0, 0.5)`,
                  borderColor: `rgba(255, 255, 255, 0.6)`,
                  transform: 'scale(1.05)',
                },
                transition: theme.transitions.create(['background-color', 'border-color', 'transform'], {
                  duration: theme.transitions.duration.short,
                }),
              }}
            >
              <Settings fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Paper
          elevation={0}
          sx={{
            background: 'transparent',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            border: 'none',
            borderRadius: theme.shape.borderRadius,
            overflow: 'hidden',
            boxShadow: 'none',
          }}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              <SwapTokenFieldGlass
                token={sellToken}
                value={sellAmount}
                balance={sellTokenBalance}
                price={priceSell}
                priceLoading={priceSellLoading}
                onChange={onChangeSellAmount}
                onSelectToken={(token?: Token) => onSelectToken("sell", token)}
                showBalance
                isUserInput={quoteFor === "sell" && clickOnMax === false}
                featuredTokensByChain={featuredTokensByChain}
                onSetToken={onSetToken}
                selectedChainId={selectedChainId}
                blurIntensity={blurIntensity}
                glassOpacity={glassOpacity}
                disableBackground={disableBackground}
                textColor={finalTextColor}
                backgroundType={backgroundType}
                backgroundColor={backgroundColor}
                backgroundImage={backgroundImage}
                backgroundSize={backgroundSize}
                backgroundPosition={backgroundPosition}
                gradientStartColor={gradientStartColor}
                gradientEndColor={gradientEndColor}
                gradientDirection={gradientDirection}
                keepTokenAlwaysPresent={keepTokenAlwaysPresent}
                lockedToken={lockedToken}
              />
            </Grid>

            <Grid size={12}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  position: 'relative',
                  zIndex: 2,
                  my: theme.spacing(-1),
                  height: theme.spacing(6),
                }}
              >
                <IconButton
                  onClick={onSwapTokens}
                  size="medium"
                  sx={{
                    background: `rgba(0, 0, 0, 0.4)`,
                    backdropFilter: `blur(${blurIntensity * 0.8}px) saturate(150%)`,
                    WebkitBackdropFilter: `blur(${blurIntensity * 0.8}px) saturate(150%)`,
                    border: `2px solid rgba(255, 255, 255, 0.6)`,
                    borderRadius: theme.shape.borderRadius,
                    color: 'primary.contrastText',
                    width: theme.spacing(6),
                    height: theme.spacing(6),
                    boxShadow: `${theme.shadows[8]}, 0 0 0 1px rgba(255, 255, 255, 0.2) inset`,
                    '&:hover': {
                      background: `rgba(0, 0, 0, 0.6)`,
                      borderColor: `rgba(255, 255, 255, 0.8)`,
                      transform: 'scale(1.05)',
                      boxShadow: `${theme.shadows[12]}, 0 0 0 1px rgba(255, 255, 255, 0.3) inset`,
                    },
                    transition: theme.transitions.create(['background-color', 'border-color', 'transform', 'box-shadow'], {
                      duration: theme.transitions.duration.short,
                    }),
                  }}
                >
                  <SwapVert />
                </IconButton>
              </Box>
            </Grid>

            <Grid size={12}>
              <SwapTokenFieldGlass
                token={buyToken}
                value={buyAmount}
                balance={buyTokenBalance}
                price={priceBuy}
                priceLoading={priceBuyLoading}
                onChange={onChangeBuyAmount}
                onSelectToken={(token?: Token) => onSelectToken("buy", token)}
                showBalance
                isUserInput={quoteFor === "buy" && clickOnMax === false}
                isBuyToken
                featuredTokensByChain={featuredTokensByChain}
                onSetToken={onSetToken}
                selectedChainId={selectedChainId}
                blurIntensity={blurIntensity}
                glassOpacity={glassOpacity}
                disableBackground={disableBackground}
                textColor={finalTextColor}
                backgroundType={backgroundType}
                backgroundColor={backgroundColor}
                backgroundImage={backgroundImage}
                backgroundSize={backgroundSize}
                backgroundPosition={backgroundPosition}
                gradientStartColor={gradientStartColor}
                gradientEndColor={gradientEndColor}
                gradientDirection={gradientDirection}
                keepTokenAlwaysPresent={keepTokenAlwaysPresent}
                lockedToken={lockedToken}
              />
            </Grid>

            {quote && sellToken && buyToken && !sellAmount.isZero() && !buyAmount.isZero() && (
              <Grid size={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: theme.spacing(2),
                    background: disableBackground
                      ? `rgba(128, 128, 128, ${Math.min(glassOpacity * 0.6, 0.06)})`
                      : `rgba(128, 128, 128, ${Math.min(glassOpacity * 0.9, 0.09)})`,
                    backdropFilter: `blur(${blurIntensity * 0.6}px)`,
                    WebkitBackdropFilter: `blur(${blurIntensity * 0.6}px)`,
                    border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity * 0.8, 0.15)})`,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: disableBackground
                      ? `0 ${theme.spacing(0.25)} ${theme.spacing(1)} rgba(0, 0, 0, 0.03)`
                      : `0 ${theme.spacing(0.5)} ${theme.spacing(1.5)} rgba(0, 0, 0, 0.05)`,
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: finalTextColor,
                        opacity: 0.8,
                        fontSize: theme.typography.body2.fontSize,
                        [theme.breakpoints.down('sm')]: {
                          fontSize: theme.typography.caption.fontSize,
                        },
                      }}
                    >
                      Rate: 1 {sellToken.symbol} = {(Number(buyAmount.toString()) / Number(sellAmount.toString())).toFixed(4)} {buyToken.symbol}
                    </Typography>
                    <Tooltip title={
                      (() => {
                        if (isQuoting) return 'Calculating price impact...';
                        if (!quote) return 'Price impact: N/A';

                        const priceImpact = calculatePriceImpact(quote, sellAmount, buyAmount);
                        return priceImpact !== null ? `Price impact: ${priceImpact.toFixed(2)}%` : 'Price impact: N/A';
                      })()
                    }>
                      <Info
                        sx={{
                          fontSize: theme.spacing(2),
                          color: finalTextColor,
                          opacity: 0.8,
                          cursor: 'help',
                        }}
                      />
                    </Tooltip>
                  </Stack>
                </Paper>
              </Grid>
            )}

            <Grid size={12}>
              <Box sx={{
                px: theme.spacing(1),
                pb: theme.spacing(1)
              }}>
                {!isActive ? (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={!isProviderReady}
                    onClick={onExec}
                    sx={{
                      py: theme.spacing(1.2),
                      fontSize: theme.typography.body1.fontSize,
                      fontWeight: theme.typography.fontWeightMedium,
                      borderRadius: theme.shape.borderRadius,
                      background: `rgba(128, 128, 128, ${glassOpacity * 1.4})`,
                      backdropFilter: `blur(${blurIntensity * 0.8}px)`,
                      WebkitBackdropFilter: `blur(${blurIntensity * 0.8}px)`,
                      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.25, 0.55)})`,
                      color: finalTextColor,
                      boxShadow: theme.shadows[4],
                      '&:hover': {
                        background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                        borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.6)})`,
                        boxShadow: theme.shadows[8],
                      },
                      '&:disabled': {
                        background: `rgba(255, 255, 255, ${Math.min(glassOpacity * 0.3, 0.05)})`,
                        color: theme.palette.text.disabled,
                        borderColor: theme.palette.divider,
                      },
                      transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow'], {
                        duration: theme.transitions.duration.short,
                      }),
                    }}
                  >
                    <FormattedMessage id="connect.wallet" defaultMessage="Connect Wallet" />
                  </Button>
                ) : execType === "switch" ? (
                  <Tooltip
                    title={disableNetworkChange || disableNetworkSelector ? <FormattedMessage id="locked.network" defaultMessage="Locked network" /> : ""}
                    arrow
                    disableHoverListener={!(disableNetworkChange || disableNetworkSelector)}
                    disableFocusListener={!(disableNetworkChange || disableNetworkSelector)}
                  >
                    <span>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        onClick={disableNetworkChange || disableNetworkSelector ? undefined : onToggleChangeNetwork}
                        disabled={disableNetworkChange || disableNetworkSelector}
                        tabIndex={disableNetworkChange || disableNetworkSelector ? -1 : undefined}
                        aria-disabled={disableNetworkChange || disableNetworkSelector}
                        sx={{
                          py: theme.spacing(1.5),
                          fontSize: theme.typography.body1.fontSize,
                          fontWeight: theme.typography.fontWeightMedium,
                          borderRadius: theme.shape.borderRadius,
                          background: `rgba(128, 128, 128, ${glassOpacity * 1.4})`,
                          backdropFilter: `blur(${blurIntensity * 0.8}px)`,
                          WebkitBackdropFilter: `blur(${blurIntensity * 0.8}px)`,
                          border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.25, 0.55)})`,
                          color: finalTextColor,
                          opacity: disableNetworkChange || disableNetworkSelector ? 0.5 : 1,
                          pointerEvents: disableNetworkChange || disableNetworkSelector ? 'none' : undefined,
                          cursor: disableNetworkChange || disableNetworkSelector ? 'not-allowed' : 'pointer',
                          '&:hover': {
                            background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.05, 0.2)})`,
                            borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.6)})`,
                          },
                        }}
                      >
                        <FormattedMessage id="switch.network" defaultMessage="Switch Network" />
                        {(disableNetworkChange || disableNetworkSelector) && <LockIcon fontSize="small" sx={{ ml: 0.5, color: 'text.disabled' }} />}
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={
                      isExecuting ||
                      isQuoting ||
                      !sellToken ||
                      !buyToken ||
                      sellAmount.isZero() ||
                      insufficientBalance
                    }
                    onClick={onExec}
                    sx={{
                      py: theme.spacing(1.2),
                      fontSize: theme.typography.body1.fontSize,
                      fontWeight: theme.typography.fontWeightMedium,
                      borderRadius: theme.shape.borderRadius,
                      background: `rgba(128, 128, 128, ${glassOpacity * 1.4})`,
                      backdropFilter: `blur(${blurIntensity * 0.8}px)`,
                      WebkitBackdropFilter: `blur(${blurIntensity * 0.8}px)`,
                      border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.25, 0.55)})`,
                      color: finalTextColor,
                      boxShadow: theme.shadows[4],
                      '&:hover': {
                        background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
                        borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.6)})`,
                        boxShadow: theme.shadows[8],
                      },
                      '&:disabled': {
                        background: `rgba(255, 255, 255, ${Math.min(glassOpacity * 0.3, 0.05)})`,
                        color: theme.palette.text.disabled,
                        borderColor: theme.palette.divider,
                      },
                      transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow'], {
                        duration: theme.transitions.duration.short,
                      }),
                    }}
                  >
                    {isExecuting ? (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CircularProgress size={20} color="inherit" />
                        <Typography component="span" variant="inherit">
                          <FormattedMessage id="swapping" defaultMessage="Swapping..." />
                        </Typography>
                      </Stack>
                    ) : isQuoting ? (
                      <FormattedMessage id="getting.quote" defaultMessage="Getting quote..." />
                    ) : insufficientBalance ? (
                      <FormattedMessage id="insufficient.balance" defaultMessage="Insufficient balance" />
                    ) : (
                      <FormattedMessage id="swap" defaultMessage="Swap" />
                    )}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
} 