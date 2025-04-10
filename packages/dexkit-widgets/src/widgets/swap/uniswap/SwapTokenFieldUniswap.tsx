import {
  Box,
  InputBaseProps,
  lighten,
  Link,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { FormattedMessage } from "react-intl";

import { Token } from "@dexkit/core/types";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import React from "react";
import { CurrencyField } from "../CurrencyField";
import SwapTokenButtonUniswap from "./SwapTokenButtonUniswap";

export interface SwapTokenFieldUniswapProps {
  InputBaseProps?: InputBaseProps;
  priceLoading?: boolean;
  price?: string;
  disabled?: boolean;
  onChange: (value: bigint, clickOnMax?: boolean) => void;
  token?: Token;
  onSelectToken: (token?: Token) => void;
  value: bigint;
  balance?: bigint;
  showBalance?: boolean;
  isUserInput?: boolean;
  title?: React.ReactNode;
}

function SwapTokenFieldUniswap({
  InputBaseProps,
  onChange,
  onSelectToken,
  token,
  value,
  disabled,
  price,
  priceLoading,
  balance,
  showBalance,
  isUserInput,
  title,
}: SwapTokenFieldUniswapProps) {
  const handleMax = () => {
    if (balance) {
      onChange(balance, true);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        px: 2,
        py: 1,
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius / 2,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor:
          theme.palette.mode === "dark"
            ? lighten(theme.palette.divider, 0.2)
            : theme.palette.divider,
        "&:focus-within": {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      })}
    >
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        justifyContent="center"
      >
        <CurrencyField
          InputBaseProps={{
            ...InputBaseProps,
            sx: { fontSize: "2rem", flex: 1 },
            disabled,
          }}
          onChange={onChange}
          value={value}
          isUserInput={isUserInput}
          decimals={token?.decimals}
        />
        <SwapTokenButtonUniswap
          token={token}
          ButtonBaseProps={{ onClick: () => onSelectToken(token) }}
        />
      </Stack>
      {token && balance !== undefined && balance > 0 && showBalance && (
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
          <Typography variant="caption" color="text.secondary">
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
          </Typography>
          <Stack
            direction="row"
            spacing={0.5}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="caption" color="text.secondary" align="right">
              <FormattedMessage
                id="token.balance.balance"
                defaultMessage="Balance: {balance}"
                values={{
                  balance: formatUnits(balance, token?.decimals),
                }}
              />
            </Typography>
            <Link
              onClick={handleMax}
              variant="caption"
              sx={{
                textDecoration: "none",
                textTransform: "uppercase",
                cursor: "pointer",
                fontWeight: 500,
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

export default SwapTokenFieldUniswap;
