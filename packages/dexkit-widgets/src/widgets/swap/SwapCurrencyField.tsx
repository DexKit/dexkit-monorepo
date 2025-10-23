import {
  Box,
  InputBaseProps,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";

import { Token } from "@dexkit/core/types";
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
      sx={{
        px: 2,
        py: 1,
        borderRadius: (theme) => (theme.shape.borderRadius as any) / 2,
        borderWidth: 1,
        borderStyle: "solid",
        "&:focus-within": {
          borderColor: (theme) => theme.palette.primary.main,
          borderWidth: 2,
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <CurrencyField
          InputBaseProps={{
            ...InputBaseProps,
            sx: (theme) => ({
              fontSize: "2rem",
              flex: 1,
              '& .MuiInputBase-input': {
                background: isLocked
                  ? (theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.08)"
                  )
                  : 'transparent',
                borderRadius: theme.spacing(0.5),
                padding: theme.spacing(0.5, 1),
                opacity: isLocked ? 0.6 : 1,
                cursor: isLocked ? 'not-allowed' : 'text',
                pointerEvents: isLocked ? 'none' : 'auto',
              }
            }),
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
          <Typography variant="body2" align="right">
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