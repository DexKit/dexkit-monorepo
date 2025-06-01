import {
  Avatar,
  Box,
  Button,
  InputBaseProps,
  Stack,
  Typography,
} from "@mui/material";
import { BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";

import { Token } from "@dexkit/core/types";
import { formatBigNumber } from "../../../utils";
import { CurrencyField } from "../CurrencyField";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import type { ChainId } from "@dexkit/core/constants/enums";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
}: SwapTokenFieldCompactProps) {
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

    return (
      <Button
        variant="text"
        onClick={() => onSelectToken()}
        sx={{
          minWidth: { xs: 60, sm: 80 },
          height: 40,
          p: 0.5,
          borderRadius: 1,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Avatar
            src={
              token.logoURI
                ? token.logoURI
                : TOKEN_ICON_URL(token.address, token.chainId)
            }
            imgProps={{ sx: { objectFit: "fill" } }}
            sx={{ width: 20, height: 20 }}
          >
            {token.symbol?.[0]}
          </Avatar>
          <Typography variant="caption" fontWeight="bold" noWrap>
            {token.symbol}
          </Typography>
          <KeyboardArrowDownIcon fontSize="small" />
        </Stack>
      </Button>
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
            {token && price && !value.isZero() && (
              <Typography variant="caption" color="text.secondary">
                ${(Number(formatBigNumber(value, token.decimals)) * Number(price)).toFixed(2)}
              </Typography>
            )}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
} 