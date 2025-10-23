import {
  Box,
  Button,
  Grid,
  InputBaseProps,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";

import { Token } from "@dexkit/core/types";
import { formatBigNumber } from "../../../utils";
import { CurrencyField } from "../CurrencyField";

import type { ChainId } from "@dexkit/core/constants/enums";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SwapTokenButton from '../SwapTokenButton';

export interface SwapTokenFieldGlassProps {
  InputBaseProps?: InputBaseProps;
  disabled?: boolean;
  selectedChainId?: ChainId;
  onChange: (value: BigNumber, clickOnMax?: boolean) => void;
  token?: Token;
  onSelectToken: (token?: Token) => void;
  value: BigNumber;
  price?: string;
  priceLoading?: boolean;
  balance?: BigNumber;
  showBalance?: boolean;
  isUserInput?: boolean;
  isBuyToken?: boolean;
  onSetToken?: (token?: Token) => void;
  featuredTokensByChain: Token[];
  // Glass configuration props
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
}

export default function SwapTokenFieldGlass({
  InputBaseProps,
  disabled,
  selectedChainId,
  onChange,
  token,
  onSelectToken,
  value,
  price,
  priceLoading,
  balance,
  showBalance,
  isUserInput,
  isBuyToken,
  onSetToken,
  featuredTokensByChain,
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
  keepTokenAlwaysPresent,
  lockedToken,
}: SwapTokenFieldGlassProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const finalTextColor = textColor || theme.palette.text.primary;

  const getBackgroundStyles = () => {
    if (disableBackground) return { background: 'transparent' };

    const isDark = theme.palette.mode === 'dark';
    const baseBackground = isDark
      ? `rgba(0, 0, 0, ${glassOpacity})`
      : `rgba(255, 255, 255, ${glassOpacity})`;

    switch (backgroundType) {
      case 'solid':
        return {
          background: backgroundColor || baseBackground,
        };
      case 'gradient':
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
            : baseBackground,
          backgroundSize: backgroundSize || 'cover',
          backgroundPosition: backgroundPosition || 'center',
          backgroundRepeat: 'no-repeat',
        };
      default:
        return {
          background: baseBackground,
        };
    }
  };

  const handleMaxClick = () => {
    if (balance && !balance.isZero()) {
      onChange(balance, true);
    }
  };

  const isLocked = !!lockedToken && keepTokenAlwaysPresent &&
    token?.address?.toLowerCase() === lockedToken.address?.toLowerCase() &&
    token?.chainId === lockedToken.chainId;

  const renderTokenButton = () => {
    if (!token) {
      return (
        <Button
          variant="text"
          onClick={() => onSelectToken()}
          sx={{
            minWidth: {
              xs: theme.spacing(10),
              sm: theme.spacing(12),
              md: theme.spacing(14),
            },
            height: {
              xs: theme.spacing(5),
              sm: theme.spacing(6),
              md: theme.spacing(7),
            },
            p: theme.spacing(1, 1.5),
            borderRadius: theme.shape.borderRadius,
            color: finalTextColor,
            background: `rgba(128, 128, 128, ${glassOpacity * 0.5})`,
            backdropFilter: `blur(${blurIntensity * 0.4}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity * 0.4}px)`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
            boxShadow: theme.shadows[2],
            '&:hover': {
              background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.5)})`,
              borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.6)})`,
              color: finalTextColor,
              transform: 'scale(1.02)',
              boxShadow: theme.shadows[4],
            },
            transition: theme.transitions.create(['background-color', 'border-color', 'color', 'transform', 'box-shadow'], {
              duration: theme.transitions.duration.short,
            }),
          }}
        >
          <Stack alignItems="center" spacing={0.5}>
            <Typography
              variant={isSmallScreen ? "caption" : "body2"}
              fontWeight={theme.typography.fontWeightMedium}
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              <FormattedMessage id="select" defaultMessage="Select" />
            </Typography>
            <KeyboardArrowDownIcon fontSize={isSmallScreen ? "small" : "medium"} />
          </Stack>
        </Button>
      );
    }

    return (
      <SwapTokenButton
        token={token}
        locked={isLocked}
        ButtonBaseProps={{
          onClick: isLocked ? undefined : () => onSelectToken(),
          sx: {
            minWidth: {
              xs: theme.spacing(10),
              sm: theme.spacing(12),
              md: theme.spacing(14),
            },
            height: {
              xs: theme.spacing(5),
              sm: theme.spacing(6),
              md: theme.spacing(7),
            },
            p: theme.spacing(1, 1.5),
            borderRadius: theme.shape.borderRadius,
            color: finalTextColor,
            background: `rgba(128, 128, 128, ${glassOpacity * 0.5})`,
            backdropFilter: `blur(${blurIntensity * 0.4}px)`,
            WebkitBackdropFilter: `blur(${blurIntensity * 0.4}px)`,
            border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
            boxShadow: theme.shadows[2],
            '&:hover': {
              background: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.5)})`,
              borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.6)})`,
              color: finalTextColor,
              transform: 'scale(1.02)',
              boxShadow: theme.shadows[4],
            },
            transition: theme.transitions.create(['background-color', 'border-color', 'color', 'transform', 'box-shadow'], {
              duration: theme.transitions.duration.short,
            }),
          },
        }}
      />
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: theme.spacing(2),
          sm: theme.spacing(2.5),
          md: theme.spacing(3),
        },
        background: disableBackground
          ? `rgba(128, 128, 128, ${glassOpacity * 0.3})`
          : `rgba(128, 128, 128, ${glassOpacity * 0.5})`,
        backdropFilter: `blur(${blurIntensity * 0.4}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity * 0.4}px)`,
        border: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.08, 0.25)})`,
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        boxShadow: disableBackground
          ? `0 ${theme.spacing(0.5)} ${theme.spacing(2)} rgba(0, 0, 0, 0.05)`
          : theme.shadows[1],
        transition: theme.transitions.create(['border-color', 'box-shadow'], {
          duration: theme.transitions.duration.short,
        }),
        '&:hover': {
          borderColor: `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.3)})`,
          boxShadow: disableBackground
            ? `0 ${theme.spacing(1)} ${theme.spacing(3)} rgba(0, 0, 0, 0.1)`
            : theme.shadows[2],
        },
      }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid size="auto">
              {renderTokenButton()}
            </Grid>

            <Grid size="grow">
              <Box sx={{ textAlign: 'right' }}>
                <CurrencyField
                  value={value}
                  onChange={onChange}
                  decimals={token?.decimals}
                  isUserInput={isUserInput}
                  InputBaseProps={{
                    ...InputBaseProps,
                    sx: {
                      '& .MuiInputBase-input': {
                        textAlign: 'right',
                        fontSize: {
                          xs: theme.typography.h6.fontSize,
                          sm: theme.typography.h5.fontSize,
                          md: theme.typography.h4.fontSize,
                        },
                        fontWeight: theme.typography.fontWeightMedium,
                        border: 'none',
                        outline: 'none',
                        background: isLocked
                          ? 'rgba(255, 255, 255, 0.15)'
                          : 'transparent',
                        borderRadius: theme.spacing(0.5),
                        color: finalTextColor,
                        padding: theme.spacing(0.5, 1),
                        opacity: isLocked ? 0.6 : 1,
                        cursor: isLocked ? 'not-allowed' : 'text',
                        pointerEvents: isLocked ? 'none' : 'auto',
                        ...(disabled || !isUserInput ? {
                          pointerEvents: 'none',
                          opacity: 0.6
                        } : {}),
                      },
                      '& .MuiInputBase-root': {
                        border: 'none',
                        '&:before, &:after': {
                          display: 'none',
                        },
                      },
                    },
                    disabled: disabled || isLocked,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}>
          <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
            <Grid size="auto">
              {showBalance && balance && token && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant={isSmallScreen ? "caption" : "body2"}
                    sx={{
                      color: finalTextColor,
                      opacity: 0.8,
                      fontSize: {
                        xs: theme.typography.caption.fontSize,
                        sm: theme.typography.body2.fontSize,
                      },
                    }}
                  >
                    {formatBigNumber(balance, token.decimals)}
                  </Typography>
                  {!isBuyToken && (
                    <Button
                      size="small"
                      variant="text"
                      onClick={handleMaxClick}
                      sx={{
                        minWidth: 'auto',
                        p: theme.spacing(0.5, 1),
                        fontSize: {
                          xs: theme.typography.caption.fontSize,
                          sm: theme.typography.body2.fontSize,
                        },
                        fontWeight: theme.typography.fontWeightMedium,
                        color: finalTextColor,
                        background: theme.palette.mode === 'dark'
                          ? `rgba(255, 255, 255, ${glassOpacity * 0.2})`
                          : `rgba(128, 128, 128, ${glassOpacity * 0.7})`,
                        backdropFilter: `blur(${blurIntensity * 0.6}px)`,
                        WebkitBackdropFilter: `blur(${blurIntensity * 0.6}px)`,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: theme.shape.borderRadius,
                        '&:hover': {
                          background: theme.palette.mode === 'dark'
                            ? `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.1, 0.4)})`
                            : `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.6)})`,
                          borderColor: theme.palette.mode === 'dark'
                            ? `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.5)})`
                            : `rgba(255, 255, 255, ${Math.min(glassOpacity + 0.3, 0.7)})`,
                          color: finalTextColor,
                          transform: 'scale(1.05)',
                        },
                        transition: theme.transitions.create(['background-color', 'border-color', 'color', 'transform'], {
                          duration: theme.transitions.duration.short,
                        }),
                      }}
                    >
                      <FormattedMessage id="max" defaultMessage="MAX" />
                    </Button>
                  )}
                </Stack>
              )}
            </Grid>

            <Grid size="auto">
              {price && (
                <Typography
                  variant={isSmallScreen ? "caption" : "body2"}
                  sx={{
                    color: finalTextColor,
                    opacity: 0.8,
                    fontSize: {
                      xs: theme.typography.caption.fontSize,
                      sm: theme.typography.body2.fontSize,
                    },
                    textAlign: 'right',
                  }}
                >
                  ~{price}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
} 