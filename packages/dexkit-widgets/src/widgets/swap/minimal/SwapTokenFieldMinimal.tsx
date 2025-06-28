import {
  Box,
  Button,
  InputBaseProps,
  Stack,
  Typography,
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

export interface SwapTokenFieldMinimalProps {
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
  placeholder?: string;
  keepTokenAlwaysPresent?: boolean;
  lockedToken?: Token;
}

export default function SwapTokenFieldMinimal({
  InputBaseProps,
  disabled,
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
  placeholder = "0.0",
  keepTokenAlwaysPresent,
  lockedToken,
}: SwapTokenFieldMinimalProps) {
  const theme = useTheme();

  const handleMaxClick = () => {
    if (balance && !balance.isZero()) {
      onChange(balance, true);
    }
  };

  const renderTokenButton = () => {
    if (!token) {
      return (
        <Button
          variant="text"
          onClick={() => onSelectToken()}
          sx={{
            minWidth: 'auto',
            p: 0.5,
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body2">
              <FormattedMessage id="select" defaultMessage="Select" />
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
            minWidth: 'auto',
            p: 0.5,
          },
        }}
      />
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        {renderTokenButton()}

        <Box flex={1} textAlign="right">
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
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'text.primary',
                  ...(disabled || !isUserInput ? { pointerEvents: 'none', opacity: 0.6 } : {}),
                  '&::placeholder': {
                    color: 'text.disabled',
                    opacity: 0.5,
                  },
                },
                '& .MuiInputBase-root': {
                  border: 'none',
                  '&:before, &:after': {
                    display: 'none',
                  },
                },
              },
            }}
          />
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          {showBalance && balance && token && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                {formatBigNumber(balance, token.decimals)}
              </Typography>
              {!isBuyToken && (
                <Button
                  size="small"
                  variant="text"
                  onClick={handleMaxClick}
                  sx={{
                    minWidth: 'auto',
                    p: 0.25,
                    fontSize: '0.6rem',
                    color: 'primary.main',
                  }}
                >
                  <FormattedMessage id="max" defaultMessage="MAX" />
                </Button>
              )}
            </Stack>
          )}
        </Box>

        <Box textAlign="right">
          <Stack spacing={0.25} alignItems="flex-end">
            {token && priceLoading ? (
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage id="loading.price" defaultMessage="Loading..." />
              </Typography>
            ) : (
              token && price && (
                <Typography variant="caption" color="text.secondary">
                  {price}
                </Typography>
              )
            )}

            {!value.isZero() && price && !priceLoading && (
              <Typography variant="caption" color="text.secondary" fontWeight="medium">
                ~${(Number(formatBigNumber(value, token?.decimals || 18)) * parseFloat(price.replace(/[^0-9.-]+/g, ""))).toFixed(2)}
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
} 