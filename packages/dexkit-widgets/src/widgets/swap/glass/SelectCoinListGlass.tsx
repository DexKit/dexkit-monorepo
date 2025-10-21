import type { TokenBalances } from "@indexed-finance/multicall";
import TipsAndUpdates from "@mui/icons-material/TipsAndUpdates";

import {
  Box,
  Container,
  List,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { memo } from "react";
import { FormattedMessage } from "react-intl";

import { Token } from "@dexkit/core/types";
import SwapSelectCoinListSkeleton from "../SwapSelectCoinListSkeleton";
import SelectCoinListItemGlass from "./SelectCoinListItemGlass";

export interface SelectCoinListGlassProps {
  tokens: Token[];
  externToken?: Token;
  onSelect: (token: Token) => void;
  tokenBalances?: TokenBalances | null;
  subHeader?: React.ReactNode;
  isLoading: boolean;
  showDash: boolean;
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

function SelectCoinListGlass({
  tokens,
  onSelect,
  tokenBalances,
  isLoading,
  subHeader,
  externToken,
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
}: SelectCoinListGlassProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const finalTextColor = textColor || theme.palette.text.primary;

  if (isLoading) {
    return <SwapSelectCoinListSkeleton />;
  }

  if (tokens.length === 0 && !externToken) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            py: {
              xs: theme.spacing(4),
              sm: theme.spacing(6),
              md: theme.spacing(8),
            },
            px: {
              xs: theme.spacing(2),
              sm: theme.spacing(3),
            },
          }}
        >
          <Stack
            spacing={theme.spacing(3)}
            alignItems="center"
            justifyContent="center"
          >
            <TipsAndUpdates
              sx={{
                color: finalTextColor,
                opacity: 0.7,
                fontSize: {
                  xs: theme.spacing(6),
                  sm: theme.spacing(7),
                  md: theme.spacing(8),
                },
              }}
            />
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant={isSmallScreen ? "h6" : "h5"}
                sx={{
                  color: finalTextColor,
                  fontWeight: theme.typography.fontWeightBold,
                  mb: theme.spacing(1),
                  fontSize: {
                    xs: theme.typography.h6.fontSize,
                    sm: theme.typography.h5.fontSize,
                    md: theme.typography.h4.fontSize,
                  },
                }}
              >
                <FormattedMessage id="no.coins" defaultMessage="No coins" />
              </Typography>
              <Typography
                variant={isSmallScreen ? "body2" : "body1"}
                sx={{
                  color: finalTextColor,
                  opacity: 0.8,
                  fontSize: {
                    xs: theme.typography.body2.fontSize,
                    sm: theme.typography.body1.fontSize,
                  },
                }}
              >
                <FormattedMessage
                  id="no.coins.found"
                  defaultMessage="No coins found"
                />
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    );
  }

  if (externToken) {
    return (
      <SelectCoinListItemGlass
        token={externToken}
        isLoading={isLoading}
        onSelect={onSelect}
        tokenBalances={tokenBalances}
        isExtern
        showDash={showDash}
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
      />
    );
  }

  return (
    <List
      disablePadding
      subheader={subHeader}
      sx={{
        '& .MuiListSubheader-root': {
          background: 'transparent',
          borderRadius: 0,
        },
      }}
    >
      {tokens.map((token: Token, index: number) => (
        <SelectCoinListItemGlass
          key={`token-${token.address}-${token.chainId}-${index}`}
          token={token}
          isLoading={isLoading}
          showDash={showDash}
          onSelect={onSelect}
          tokenBalances={tokenBalances}
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
        />
      ))}
    </List>
  );
}

export default memo(SelectCoinListGlass); 