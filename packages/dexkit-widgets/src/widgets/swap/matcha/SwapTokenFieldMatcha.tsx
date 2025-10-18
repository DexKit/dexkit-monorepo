import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Button,
  InputBaseProps,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";

import { Token } from "@dexkit/core/types";
import React from "react";
import { formatBigNumber } from "../../../utils";
import { CurrencyField } from "../CurrencyField";
import SwapTokenButton from '../SwapTokenButton';

import type { ChainId } from "@dexkit/core/constants/enums";
import SelectTokenShortcutMatcha from "./SelectTokenShortcutMatcha";

export interface SwapTokenFieldMatchaProps {
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
  enableHalfAmount?: boolean;
  keepTokenAlwaysPresent?: boolean;
  lockedToken?: Token;
}

export default function SwapTokenFieldMatcha({
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
  enableHalfAmount,
  keepTokenAlwaysPresent,
  lockedToken,
}: SwapTokenFieldMatchaProps) {
  const theme = useTheme();

  const handleMaxClick = () => {
    if (balance && !balance.isZero()) {
      onChange(balance, true);
    }
  };

  const handleHalfClick = () => {
    if (balance && !balance.isZero()) {
      onChange(balance.div(2), true);
    }
  };

  const renderTokenButton = () => {
    if (!token) {
      return (
        <Button
          variant="outlined"
          onClick={() => onSelectToken()}
          sx={{
            minWidth: 120,
            height: 48,
            borderRadius: 2,
            borderStyle: 'dashed',
            borderWidth: 2,
            '&:hover': {
              borderStyle: 'solid',
              bgcolor: 'action.hover',
            },
          }}
        >
          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="body2" fontWeight="medium">
              <FormattedMessage id="select.token" defaultMessage="Select token" />
            </Typography>
            <KeyboardArrowDownIcon fontSize="small" />
          </Stack>
        </Button>
      );
    }

    const isLocked = !!lockedToken && keepTokenAlwaysPresent &&
      token.address?.toLowerCase() === lockedToken.address?.toLowerCase() &&
      token.chainId === lockedToken.chainId;

    return (
      <SwapTokenButton
        token={token}
        locked={isLocked}
        ButtonBaseProps={{
          onClick: isLocked ? undefined : () => onSelectToken(),
          sx: {
            minWidth: 120,
            height: 48,
            borderRadius: 2,
          },
        }}
      />
    );
  };

  return (
    <Box
      sx={(theme) => ({
        px: 2,
        py: 1,
        borderRadius: (theme.shape.borderRadius as any) / 2,
        "&:focus-within": {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      })}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="space-between"
        >
          <Typography component="div" variant="caption" color="text.secondary">
            {title}
          </Typography>
          {token && balance && showBalance && (
            <Stack
              direction="row"
              spacing={0.5}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="caption"
                color="text.secondary"
                align="right"
              >
                <FormattedMessage
                  id="token.balance.balance"
                  defaultMessage="Balance: {balance}"
                  values={{
                    balance: formatBigNumber(balance, token?.decimals),
                  }}
                />
              </Typography>
            </Stack>
          )}
        </Stack>

        <Stack direction="row" justifyContent="space-between" spacing={2}>
          {renderTokenButton()}
          {token && balance && showBalance ? (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              {enableHalfAmount && (
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={handleHalfClick}
                  size="small"
                  disableElevation
                  disableTouchRipple
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.background.default
                        : theme.palette.grey[200],
                    borderRadius: (theme) => theme.shape.borderRadius,
                  }}
                >
                  <FormattedMessage id="50.percent" defaultMessage="50%" />
                </Button>
              )}

              <Button
                variant="contained"
                color="inherit"
                onClick={handleMaxClick}
                size="small"
                disableElevation
                disableTouchRipple
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.background.default
                      : theme.palette.grey[200],
                  borderRadius: (theme) => theme.shape.borderRadius,
                }}
              >
                <FormattedMessage id="max" defaultMessage="Max" />
              </Button>
            </Stack>
          ) : isBuyToken && !token ? (
            <SelectTokenShortcutMatcha
              selectedChainId={selectedChainId}
              onSelectToken={(token) => onSetToken!(token)}
              featuredTokensByChain={featuredTokensByChain}
            />
          ) : null}
        </Stack>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={4}
        justifyContent="space-between"
      >
        <CurrencyField
          InputBaseProps={{
            ...InputBaseProps,
            sx: { fontSize: "2rem", flex: 1, pt: 1 },
            disabled,
          }}
          onChange={onChange}
          value={value}
          isUserInput={isUserInput}
          decimals={token?.decimals}
        />
        {token && priceLoading ? (
          <Skeleton>
            <Typography variant="caption" color="text.secondary">
              $-,--
            </Typography>
          </Skeleton>
        ) : token && price ? (
          <Typography variant="caption" color="text.secondary">
            {price}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}
