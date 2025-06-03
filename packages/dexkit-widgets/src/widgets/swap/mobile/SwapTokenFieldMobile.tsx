import {
  Avatar,
  Box,
  Button,
  Chip,
  InputBaseProps,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";

import { Token } from "@dexkit/core/types";
import { formatBigNumber } from "../../../utils";
import { CurrencyField } from "../CurrencyField";

import { TOKEN_ICON_URL } from "@dexkit/core/constants";
import type { ChainId } from "@dexkit/core/constants/enums";
import { AccountBalanceWallet, KeyboardArrowDown } from "@mui/icons-material";

export interface SwapTokenFieldMobileProps {
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
  title?: React.ReactNode;
}

export default function SwapTokenFieldMobile({
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
  title,
}: SwapTokenFieldMobileProps) {
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
          variant="outlined"
          onClick={() => onSelectToken()}
          sx={{
            minWidth: 120,
            height: 56,
            borderRadius: 3,
            borderStyle: 'dashed',
            borderWidth: 2,
            '&:hover': {
              borderStyle: 'solid',
              bgcolor: 'action.hover',
              transform: 'scale(1.02)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="body1" fontWeight="bold">
              <FormattedMessage id="select.token" defaultMessage="Select Token" />
            </Typography>
            <KeyboardArrowDown />
          </Stack>
        </Button>
      );
    }

    return (
      <Button
        variant="outlined"
        onClick={() => onSelectToken()}
        sx={{
          minWidth: 120,
          height: 56,
          borderRadius: 3,
          p: 1,
          '&:hover': {
            bgcolor: 'action.hover',
            borderColor: 'primary.main',
            transform: 'scale(1.02)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <Stack alignItems="center" spacing={1} width="100%">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              src={
                token.logoURI
                  ? token.logoURI
                  : TOKEN_ICON_URL(token.address, token.chainId)
              }
              imgProps={{ sx: { objectFit: "fill" } }}
              sx={{ width: 32, height: 32 }}
            >
              {token.symbol?.[0]}
            </Avatar>
            <Typography variant="h6" fontWeight="bold" noWrap>
              {token.symbol}
            </Typography>
            <KeyboardArrowDown />
          </Stack>
        </Stack>
      </Button>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2}>
        {/* Title */}
        {title && (
          <Typography variant="h6" fontWeight="bold" color="text.secondary">
            {title}
          </Typography>
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
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
                    fontSize: '2.5rem',
                    fontWeight: 300,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: 'text.primary',
                    padding: 0,
                    minHeight: 56,
                    ...(disabled || !isUserInput ? { pointerEvents: 'none', opacity: 0.6 } : {}),
                    '&::placeholder': {
                      color: 'text.disabled',
                      opacity: 0.7,
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

        <Stack spacing={1}>
          {showBalance && balance && token && (
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <AccountBalanceWallet sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage id="balance" defaultMessage="Balance" />:{" "}
                  {formatBigNumber(balance, token.decimals)} {token.symbol}
                </Typography>
              </Stack>
              {!isBuyToken && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleMaxClick}
                  sx={{
                    minWidth: 60,
                    height: 32,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <FormattedMessage id="max" defaultMessage="MAX" />
                </Button>
              )}
            </Stack>
          )}

          {priceLoading ? (
            <Box textAlign="right">
              <Chip
                label={<FormattedMessage id="loading.price" defaultMessage="Loading..." />}
                size="medium"
                variant="outlined"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  bgcolor: 'background.paper',
                  borderColor: 'action.disabled',
                  color: 'text.secondary',
                }}
              />
            </Box>
          ) : (
            <Stack spacing={1} alignItems="flex-end">
              {token && price && (
                <Box textAlign="right">
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    {token.symbol}: {price}
                  </Typography>
                </Box>
              )}

              {token && price && !value.isZero() && (
                <Box textAlign="right">
                  <Chip
                    label={`≈ $${(Number(formatBigNumber(value, token.decimals)) * parseFloat(price.replace(/[^0-9.-]+/g, ""))).toFixed(2)}`}
                    size="medium"
                    variant="outlined"
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      bgcolor: 'background.paper',
                      borderColor: 'primary.main',
                      color: 'primary.main',
                    }}
                  />
                </Box>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
} 