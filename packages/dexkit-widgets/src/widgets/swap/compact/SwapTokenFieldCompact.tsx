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

export interface SwapTokenFieldCompactProps {
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

export default function SwapTokenFieldCompact({
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
}: SwapTokenFieldCompactProps) {
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
            minWidth: { xs: 60, sm: 80 },
            height: 40,
            p: 0.5,
            borderRadius: 1,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'primary.main',
            },
          }}
        >
          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="caption" fontWeight="medium">
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
            minWidth: { xs: 60, sm: 80 },
            height: 40,
            p: 0.5,
            borderRadius: 1,
          },
        }}
      />
    );
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
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
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: 'text.primary',
                    padding: 0,
                    ...(disabled || !isUserInput ? { pointerEvents: 'none', opacity: 0.6 } : {}),
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

              {token && price && !value.isZero() && !priceLoading && (
                <Typography variant="caption" color="text.secondary" fontWeight="medium">
                  ~${(Number(formatBigNumber(value, token.decimals)) * parseFloat(price.replace(/[^0-9.-]+/g, ""))).toFixed(2)}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
} 