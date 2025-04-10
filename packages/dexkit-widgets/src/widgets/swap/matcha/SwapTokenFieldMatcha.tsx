import {
  Box,
  Button,
  InputBaseProps,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { FormattedMessage } from "react-intl";

import { Token } from "@dexkit/core/types";
import React from "react";
import { formatBigNumber } from "../../../utils";
import { CurrencyField } from "../CurrencyField";
import SwapTokenButtonMatcha from "./SwapTokenButtonMatcha";

import type { ChainId } from "@dexkit/core/constants/enums";
import SelectTokenShortcutMatcha from "./SelectTokenShortcutMatcha";

export interface SwapTokenFieldMatchaProps {
  InputBaseProps?: InputBaseProps;
  disabled?: boolean;
  selectedChainId?: ChainId;
  onChange: (value: bigint, clickOnMax?: boolean) => void;
  token?: Token;
  onSelectToken: (token?: Token) => void;
  value: bigint;
  price?: string;
  priceLoading?: boolean;
  balance?: bigint;
  showBalance?: boolean;
  isUserInput?: boolean;
  title?: React.ReactNode;
  isBuyToken?: boolean;
  onSetToken?: (token?: Token) => void;
  featuredTokensByChain: Token[];
  enableHalfAmount?: boolean;
}

function SwapTokenFieldMatcha({
  InputBaseProps,
  selectedChainId,
  featuredTokensByChain,
  onChange,
  onSelectToken,
  token,
  price,
  priceLoading,
  value,
  disabled,
  balance,
  showBalance,
  isUserInput,
  title,
  isBuyToken,
  onSetToken,
  enableHalfAmount,
}: SwapTokenFieldMatchaProps) {
  const handleMax = () => {
    if (balance) {
      onChange(balance, true);
    }
  };

  const handleHalfAmont = () => {
    if (balance) {
      onChange(balance / BigInt(2), true);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        px: 2,
        py: 1,
        borderRadius: theme.shape.borderRadius / 2,
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
          {token && balance !== undefined && showBalance && (
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
          <SwapTokenButtonMatcha
            token={token}
            ButtonBaseProps={{ onClick: () => onSelectToken(token) }}
          />
          {token && balance && showBalance ? (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              {enableHalfAmount && (
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={handleHalfAmont}
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
                onClick={handleMax}
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
        {priceLoading ? (
          <Skeleton>
            <Typography variant="caption" color="text.secondary">
              $-,--
            </Typography>
          </Skeleton>
        ) : price ? (
          <Typography variant="caption" color="text.secondary">
            {price}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}

export default SwapTokenFieldMatcha;
