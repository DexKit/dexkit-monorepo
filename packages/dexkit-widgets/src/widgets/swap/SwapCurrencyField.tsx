import {
  Box,
  InputBaseProps,
  lighten,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";
import { Token } from "../../types";
import { formatBigNumber } from "../../utils";
import { CurrencyField } from "./CurrencyField";
import SwapTokenButton from "./SwapTokenButton";

export interface SwapTokenFieldProps {
  InputBaseProps?: InputBaseProps;
  disabled?: boolean;
  onChange: (value: BigNumber) => void;
  token?: Token;
  onSelectToken: (token?: Token) => void;
  value: BigNumber;
  balance?: BigNumber;
  showBalance?: boolean;
}

function SwapTokenField({
  InputBaseProps,
  onChange,
  onSelectToken,
  token,
  value,
  disabled,
  balance,
  showBalance,
}: SwapTokenFieldProps) {
  const handleMax = () => {
    if (balance) {
      onChange(balance);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        px: 2,
        py: 1,
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
      <Stack direction="row" alignItems="center" spacing={2}>
        <CurrencyField
          InputBaseProps={{
            ...InputBaseProps,
            sx: { fontSize: "2rem", flex: 1 },
            disabled,
          }}
          onChange={onChange}
          value={value}
          decimals={token?.decimals}
        />
        <SwapTokenButton
          token={token}
          ButtonBaseProps={{ onClick: () => onSelectToken(token) }}
        />
      </Stack>
      {token && balance && showBalance && (
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="flex-end"
          alignItems="center"
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
