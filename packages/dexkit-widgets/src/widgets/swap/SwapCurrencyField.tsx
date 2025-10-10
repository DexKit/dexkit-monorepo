import { Box, InputBaseProps, Link, Stack, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";

import { Token } from "@dexkit/core/types";
import { useForceThemeMode } from "@dexkit/ui/hooks";
import { useEffect, useState } from "react";
import { formatBigNumber } from "../../utils";
import { CurrencyField } from "./CurrencyField";
import SwapTokenButton from "./SwapTokenButton";

export interface SwapTokenFieldProps {
  InputBaseProps?: InputBaseProps;
  disabled?: boolean;
  onChange: (value: BigNumber, clickOnMax?: boolean) => void;
  onInputFocus?: () => void;
  onInputClick?: () => void;
  token?: Token;
  onSelectToken: (token?: Token) => void;
  value: BigNumber;
  balance?: BigNumber;
  showBalance?: boolean;
  isUserInput?: boolean;
  keepTokenAlwaysPresent?: boolean;
  lockedToken?: Token;
}

function SwapTokenField({
  InputBaseProps,
  onChange,
  onSelectToken,
  onInputFocus,
  onInputClick,
  token,
  value,
  disabled,
  balance,
  showBalance,
  isUserInput,
  keepTokenAlwaysPresent,
  lockedToken,
}: SwapTokenFieldProps) {
  const { mode: themeMode } = useForceThemeMode();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleMax = () => {
    if (balance) {
      onChange(balance, true);
    }
  };

  const isLocked = !!lockedToken && keepTokenAlwaysPresent &&
    token?.address?.toLowerCase() === lockedToken.address?.toLowerCase() &&
    token?.chainId === lockedToken.chainId;

  const renderTokenButton = () => {
    if (!token) {
      return (
        <SwapTokenButton
          ButtonBaseProps={{ onClick: () => onSelectToken() }}
        />
      );
    }

    return (
      <SwapTokenButton
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
        return {
          px: 2,
          py: 1,
          backgroundColor: isDark ? '#1a1a1a' : theme.palette.background.paper,
          borderRadius: (theme.shape.borderRadius as any) / 2,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: isDark ? '#333333' : theme.palette.divider,
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
      <Stack direction="row" alignItems="center" spacing={2}>
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
                    background: isLocked
                      ? "rgba(0, 0, 0, 0.08)"
                      : 'transparent',
                    color: theme.palette.text.primary,
                    fontWeight: 400,
                    borderRadius: theme.spacing(0.5),
                    padding: theme.spacing(0.5, 1),
                    opacity: isLocked ? 0.6 : 1,
                    cursor: isLocked ? 'not-allowed' : 'text',
                    pointerEvents: isLocked ? 'none' : 'auto',
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
                  background: isLocked
                    ? (isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.08)"
                    )
                    : 'transparent',
                  color: isDark ? '#ffffff' : theme.palette.text.primary,
                  fontWeight: isDark ? 600 : 400,
                  borderRadius: theme.spacing(0.5),
                  padding: theme.spacing(0.5, 1),
                  opacity: isLocked ? 0.6 : 1,
                  cursor: isLocked ? 'not-allowed' : 'text',
                  pointerEvents: isLocked ? 'none' : 'auto',
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
            disabled: disabled || isLocked,
          }}
          onChange={onChange}
          value={value}
          isUserInput={isUserInput}
          decimals={token?.decimals}
          onFocus={onInputFocus}
          onClick={onInputClick}
        />
        {renderTokenButton()}
      </Stack>
      {token && balance && showBalance && (
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="flex-end"
          alignItems="center"
          sx={{
            pt: 0.5,
            pb: 0.7,
          }}
        >
          <Typography
            variant="body2"
            align="right"
            sx={{
              color: (theme) => {
                if (!isHydrated) return theme.palette.text.primary;
                const isDark = themeMode === 'dark' || theme.palette.mode === 'dark';
                return isDark ? '#cccccc' : theme.palette.text.primary;
              }
            }}
          >
            <FormattedMessage
              id="token.balance"
              defaultMessage="balance: {balance}"
              values={{
                balance: formatBigNumber(balance, token?.decimals),
              }}
            />
          </Typography>
          <Link
            onClick={handleMax}
            variant="body2"
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
      )}
    </Box>
  );
}

export default SwapTokenField;
