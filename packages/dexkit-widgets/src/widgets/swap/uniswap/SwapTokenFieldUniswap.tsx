import { Box, InputBaseProps, Link, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";

import { ChainId } from "@dexkit/core/constants/enums";
import { Token } from "@dexkit/core/types";
import { useForceThemeMode } from "@dexkit/ui/hooks";
import React, { useEffect, useState } from "react";
import { formatBigNumber } from "../../../utils";
import { CurrencyField } from "../CurrencyField";
import SwapTokenButtonUniswap from "./SwapTokenButtonUniswap";

export interface SwapTokenFieldUniswapProps {
  title?: React.ReactNode;
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
  keepTokenAlwaysPresent?: boolean;
  lockedToken?: Token;
}

export default function SwapTokenFieldUniswap({
  title,
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
  keepTokenAlwaysPresent,
  lockedToken,
}: SwapTokenFieldUniswapProps) {
  const theme = useTheme();
  const { mode: themeMode } = useForceThemeMode();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);


  const handleMaxClick = () => {
    if (balance && !balance.isZero()) {
      onChange(balance, true);
    }
  };

  const renderTokenButton = () => {
    if (!token) {
      return (
        <SwapTokenButtonUniswap ButtonBaseProps={{ onClick: () => onSelectToken() }} />
      );
    }

    const isLocked = !!lockedToken && keepTokenAlwaysPresent &&
      token.address?.toLowerCase() === lockedToken.address?.toLowerCase() &&
      token.chainId === lockedToken.chainId;

    return (
      <SwapTokenButtonUniswap
        token={token}
        locked={isLocked}
        ButtonBaseProps={{
          onClick: isLocked ? undefined : () => onSelectToken(),
        }}
      />
    );
  };

  return (
    <Box
      sx={(theme) => {
        if (!isHydrated) {
          return {
            px: 2,
            py: 1,
            backgroundColor: theme.palette.background.paper,
            borderRadius: (theme.shape.borderRadius as any) / 2,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: theme.palette.divider,
            "&:focus-within": {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },
          };
        }

        const isDark = themeMode === 'dark' || theme.palette.mode === 'dark';
        const backgroundColor = isDark ? '#1a1a1a' : theme.palette.background.paper;
        const borderColor = isDark ? '#333333' : theme.palette.divider;

        return {
          px: 2,
          py: 1,
          backgroundColor,
          borderRadius: (theme.shape.borderRadius as any) / 2,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor,
          "&:focus-within": {
            borderColor: isDark ? '#00d4aa' : theme.palette.primary.main,
            borderWidth: 2,
          },
          ...(isDark && {
            backgroundColor: '#1a1a1a !important',
            borderColor: '#333333 !important',
          }),
        };
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: (theme) => {
              if (!isHydrated) return theme.palette.text.secondary;
              const isDark = themeMode === 'dark' || theme.palette.mode === 'dark';
              return isDark ? '#ffffff' : theme.palette.text.secondary;
            }
          }}
        >
          {title}
        </Typography>
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        justifyContent="center"
      >
        <CurrencyField
          InputBaseProps={{
            ...InputBaseProps,
            sx: (theme) => {
              if (!isHydrated) {
                return {
                  fontSize: "2rem",
                  flex: 1,
                  backgroundColor: 'transparent',
                  color: theme.palette.text.primary,
                  borderRadius: theme.spacing(0.5),
                  padding: theme.spacing(0.5, 1),
                  '& .MuiInputBase-input': {
                    color: theme.palette.text.primary,
                    fontWeight: 400,
                    backgroundColor: 'transparent',
                    '&::placeholder': {
                      color: theme.palette.text.secondary,
                      opacity: 1,
                    },
                  },
                  '& input': {
                    color: theme.palette.text.primary,
                    fontWeight: 400,
                  }
                };
              }

              const isDark = themeMode === 'dark' || theme.palette.mode === 'dark';
              return {
                fontSize: "2rem",
                flex: 1,
                backgroundColor: isDark ? '#1a1a1a' : 'transparent',
                color: isDark ? '#ffffff' : theme.palette.text.primary,
                borderRadius: theme.spacing(0.5),
                padding: theme.spacing(0.5, 1),
                ...(isDark && {
                  backgroundColor: '#1a1a1a !important',
                  color: '#ffffff !important',
                }),
                '& .MuiInputBase-input': {
                  color: isDark ? '#ffffff' : theme.palette.text.primary,
                  fontWeight: isDark ? 600 : 400,
                  backgroundColor: 'transparent',
                  ...(isDark && {
                    color: '#ffffff !important',
                    backgroundColor: 'transparent !important',
                  }),
                  '&::placeholder': {
                    color: isDark ? '#cccccc' : theme.palette.text.secondary,
                    opacity: 1,
                  },
                },
                '& input': {
                  color: isDark ? '#ffffff' : theme.palette.text.primary,
                  fontWeight: isDark ? 600 : 400,
                  ...(isDark && {
                    color: '#ffffff !important',
                    fontWeight: '600 !important',
                  }),
                }
              };
            },
            disabled,
          }}
          onChange={onChange}
          value={value}
          isUserInput={isUserInput}
          decimals={token?.decimals}
        />
        {renderTokenButton()}
      </Stack>
      {token && balance && showBalance && (
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="space-between"
          alignItems="center"
          sx={{
            pt: 0.5,
            pb: 0.7,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}
          >
            {token && priceLoading ? (
              <Skeleton>
                <Typography
                  variant="caption"
                  sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}
                >
                  $-,--
                </Typography>
              </Skeleton>
            ) : token && price ? (
              <Typography
                variant="caption"
                sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#cccccc' : theme.palette.text.secondary }}
              >
                {price}
              </Typography>
            ) : null}
          </Typography>
          <Stack
            direction="row"
            spacing={0.5}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="caption"
              align="right"
              sx={{
                color: (theme) => {
                  if (!isHydrated) return theme.palette.text.secondary;
                  const isDark = themeMode === 'dark' || theme.palette.mode === 'dark';
                  return isDark ? '#cccccc' : theme.palette.text.secondary;
                }
              }}
            >
              <FormattedMessage
                id="token.balance.balance"
                defaultMessage="Balance: {balance}"
                values={{
                  balance: formatBigNumber(balance, token?.decimals),
                }}
              />
            </Typography>
            <Link
              onClick={handleMaxClick}
              variant="caption"
              sx={{
                textDecoration: "none",
                textTransform: "uppercase",
                cursor: "pointer",
                fontWeight: 500,
                color: (theme) => {
                  if (!isHydrated) return theme.palette.primary.main;
                  const isDark = themeMode === 'dark' || theme.palette.mode === 'dark';
                  return isDark ? '#00d4aa' : theme.palette.primary.main;
                },
              }}
            >
              <FormattedMessage id="max" defaultMessage="Max" />
            </Link>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
