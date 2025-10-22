import { Box, InputBaseProps, Link, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";

import { ChainId } from "@dexkit/core/constants/enums";
import { Token } from "@dexkit/core/types";
import React from "react";
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
      sx={{
        px: 2,
        py: 1,
        backgroundColor: 'background.paper',
        borderRadius: (theme) => (theme.shape.borderRadius as any) / 2,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: 'divider',
        "&:focus-within": {
          borderColor: 'primary.main',
          borderWidth: 2,
        },
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary'
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
            sx: {
              fontSize: "2rem",
              flex: 1,
              backgroundColor: 'transparent',
              color: 'text.primary',
              borderRadius: (theme) => theme.spacing(0.5),
              padding: (theme) => theme.spacing(0.5, 1),
              '& .MuiInputBase-input': {
                color: 'text.primary',
                fontWeight: 400,
                backgroundColor: 'transparent',
                '&::placeholder': {
                  color: 'text.secondary',
                  opacity: 1,
                },
              },
              '& input': {
                color: 'text.primary',
                fontWeight: 400,
              }
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
            sx={{ color: 'text.secondary' }}
          >
            {token && priceLoading ? (
              <Skeleton>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary' }}
                >
                  $-,--
                </Typography>
              </Skeleton>
            ) : token && price ? (
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary' }}
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
                color: 'text.secondary'
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
                color: 'primary.main',
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
