import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import type { TokenBalances } from "@indexed-finance/multicall";
import {
  Avatar,
  Badge,
  Box,
  Grid,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { BigNumber, constants } from "ethers";
import { memo } from "react";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import Warning from "@mui/icons-material/Warning";
import { FormattedMessage } from "react-intl";
import { isDexKitToken } from "../../../constants/tokens";
import { formatBigNumber } from "../../../utils";

export interface SelectCoinListItemGlassProps {
  token: Token;
  onSelect: (token: Token, isExtern?: boolean) => void;
  tokenBalances?: TokenBalances | null;
  isLoading: boolean;
  showDash: boolean;
  isExtern?: boolean;
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
}

function SelectCoinListItemGlass({
  token,
  onSelect,
  tokenBalances,
  isLoading,
  isExtern,
  showDash,
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
}: SelectCoinListItemGlassProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const finalTextColor = textColor || theme.palette.text.primary;

  const getTokenBalance = () => {
    if (!tokenBalances || !token) {
      return BigNumber.from(0);
    }

    const isNativeToken =
      token.address.toLowerCase() ===
      ZEROEX_NATIVE_TOKEN_ADDRESS?.toLowerCase();

    let balance = tokenBalances[token.address];
    if (balance) {
      return balance;
    }

    balance = tokenBalances[token.address.toLowerCase()];
    if (balance) {
      return balance;
    }

    if (isNativeToken) {
      balance = tokenBalances[constants.AddressZero];
      if (balance) {
        return balance;
      }
    }

    return BigNumber.from(0);
  };

  const balance = getTokenBalance();
  const isKitToken = isDexKitToken(token);

  const renderAvatar = () => {
    const avatarSize = {
      xs: theme.spacing(5),
      sm: theme.spacing(6),
      md: theme.spacing(7),
    };

    const avatarStyles = {
      width: avatarSize,
      height: avatarSize,
      border: `2px solid rgba(255, 255, 255, ${glassOpacity * 2})`,
      boxShadow: theme.shadows[2],
      ...(isKitToken &&
        theme.palette.mode === "dark" && {
        filter: "invert(1)",
      }),
    };

    if (isExtern) {
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <Tooltip
              title={
                <FormattedMessage
                  id="this.token.is.not.whitelisted.by.this.app"
                  defaultMessage="This token is not whitelisted by this app"
                />
              }
            >
              <Warning
                sx={{
                  color: theme.palette.warning.main,
                  fontSize: {
                    xs: theme.spacing(2),
                    sm: theme.spacing(2.5),
                  },
                  filter: `drop-shadow(0 2px 4px ${theme.palette.warning.main}40)`,
                }}
              />
            </Tooltip>
          }
        >
          <Avatar
            src={
              token.logoURI
                ? token.logoURI
                : TOKEN_ICON_URL(token.address, token.chainId)
            }
            imgProps={{ sx: { objectFit: "fill" } }}
            sx={avatarStyles}
          />
        </Badge>
      );
    }

    return (
      <Avatar
        src={
          token.logoURI
            ? token.logoURI
            : TOKEN_ICON_URL(token.address, token.chainId)
        }
        imgProps={{ sx: { objectFit: "fill" } }}
        sx={avatarStyles}
      />
    );
  };

  return (
    <ListItemButton
      onClick={() => onSelect(token, isExtern)}
      sx={{
        px: {
          xs: theme.spacing(2),
          sm: theme.spacing(3),
        },
        py: theme.spacing(2),
        backgroundColor: disableBackground
          ? `rgba(128, 128, 128, ${Math.min(glassOpacity * 0.5, 0.05)})`
          : 'transparent',
        backdropFilter: `blur(${blurIntensity * 0.4}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity * 0.4}px)`,
        borderBottom: `1px solid rgba(255, 255, 255, ${glassOpacity * 0.8})`,
        transition: theme.transitions.create(['background-color', 'backdrop-filter', 'transform'], {
          duration: theme.transitions.duration.short,
        }),
        '&:hover': {
          backgroundColor: disableBackground
            ? `rgba(128, 128, 128, ${Math.min(glassOpacity * 0.9, 0.09)})`
            : `rgba(128, 128, 128, ${Math.min(glassOpacity + 0.2, 0.3)})`,
          backdropFilter: `blur(${blurIntensity * 0.8}px) saturate(150%)`,
          WebkitBackdropFilter: `blur(${blurIntensity * 0.8}px) saturate(150%)`,
          transform: 'translateX(4px)',
          borderBottom: `1px solid rgba(255, 255, 255, ${Math.min(glassOpacity + 0.2, 0.7)})`,
        },
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid size="auto">
          <ListItemAvatar
            sx={{
              minWidth: {
                xs: theme.spacing(7),
                sm: theme.spacing(8),
                md: theme.spacing(9),
              },
              mr: 0,
            }}
          >
            {renderAvatar()}
          </ListItemAvatar>
        </Grid>

        <Grid size="grow">
          <ListItemText
            primary={
              <Typography
                variant={isSmallScreen ? "body2" : "body1"}
                sx={{
                  color: finalTextColor,
                  fontWeight: theme.typography.fontWeightBold,
                  fontSize: {
                    xs: theme.typography.body2.fontSize,
                    sm: theme.typography.body1.fontSize,
                    md: theme.typography.h6.fontSize,
                  },
                  textShadow: finalTextColor.includes('255, 255, 255')
                    ? '0 1px 2px rgba(0, 0, 0, 0.3)'
                    : '0 1px 2px rgba(255, 255, 255, 0.3)',
                }}
              >
                {token.symbol.toUpperCase()}
              </Typography>
            }
            secondary={
              <Typography
                variant={isSmallScreen ? "caption" : "body2"}
                sx={{
                  color: finalTextColor,
                  opacity: 0.8,
                  fontSize: {
                    xs: theme.typography.caption.fontSize,
                    sm: theme.typography.body2.fontSize,
                  },
                  textShadow: finalTextColor.includes('255, 255, 255')
                    ? '0 1px 2px rgba(0, 0, 0, 0.2)'
                    : '0 1px 2px rgba(255, 255, 255, 0.2)',
                  mt: theme.spacing(0.5),
                }}
              >
                {token.name}
              </Typography>
            }
          />
        </Grid>

        <Grid size="auto">
          <Box
            sx={{
              minWidth: {
                xs: theme.spacing(8),
                sm: theme.spacing(10),
                md: theme.spacing(12),
              },
              textAlign: 'right',
            }}
          >
            {isLoading ? (
              <Skeleton
                variant="text"
                width="100%"
                height={theme.spacing(3)}
                sx={{
                  backgroundColor: `rgba(255, 255, 255, ${glassOpacity * 0.3})`,
                  '&::after': {
                    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, ${glassOpacity}), transparent)`,
                  },
                }}
              />
            ) : balance && !balance.isZero() ? (
              <Typography
                variant={isSmallScreen ? "body2" : "body1"}
                sx={{
                  color: finalTextColor,
                  fontWeight: theme.typography.fontWeightMedium,
                  fontSize: {
                    xs: theme.typography.body2.fontSize,
                    sm: theme.typography.body1.fontSize,
                  },
                  textShadow: finalTextColor.includes('255, 255, 255')
                    ? '0 1px 2px rgba(0, 0, 0, 0.3)'
                    : '0 1px 2px rgba(255, 255, 255, 0.3)',
                }}
              >
                {formatBigNumber(balance, token.decimals)}
              </Typography>
            ) : (
              <Typography
                variant={isSmallScreen ? "body2" : "body1"}
                sx={{
                  color: finalTextColor,
                  opacity: 0.6,
                  fontSize: {
                    xs: theme.typography.body2.fontSize,
                    sm: theme.typography.body1.fontSize,
                  },
                  textShadow: finalTextColor.includes('255, 255, 255')
                    ? '0 1px 2px rgba(0, 0, 0, 0.2)'
                    : '0 1px 2px rgba(255, 255, 255, 0.2)',
                }}
              >
                {showDash ? "-.-" : "0.0"}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </ListItemButton>
  );
}

export default memo(SelectCoinListItemGlass); 