import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { isAddressEqual } from "@dexkit/core/utils";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";
import { FormattedMessage } from "react-intl";
import { formatUnits, zeroAddress } from "viem";
import { useMultiTokenBalance } from "../../../hooks/useMultiTokenBalance";

export interface CheckoutTokenAutocompleteProps {
  label?: string | React.ReactNode;
  chainId?: number;
  data?: any;
  disabled?: boolean;
  onChange?: (token: Token | null) => void;
  tokens: Token[];
  token?: Token | null;
}

export default function CheckoutTokenAutocomplete(
  props: CheckoutTokenAutocompleteProps
) {
  const { data, label, onChange, chainId, disabled, tokens, token } = props;

  const { activeAccount, isActive } = useWeb3React();

  const tokenBalances = useMultiTokenBalance({
    tokens: tokens,
    activeAccount,
    chainId,
  });

  const getTokenBalance = (tokenAddress: string) => {
    if (tokenBalances?.data) {
      const balance = tokenBalances
        ? tokenBalances.data[
            isAddressEqual(token?.address, ZEROEX_NATIVE_TOKEN_ADDRESS)
              ? zeroAddress
              : tokenAddress.toLocaleLowerCase()
          ]
        : 0n;

      return balance;
    }

    return 0n;
  };

  return (
    <Autocomplete
      disabled={disabled}
      options={tokens.filter((t) => t.chainId === chainId)}
      autoHighlight
      value={token}
      isOptionEqualToValue={(op, val) =>
        op?.chainId === val?.chainId &&
        op?.address?.toLowerCase() === val?.address?.toLowerCase()
      }
      filterOptions={(x) => x}
      onChange={(event, value) => {
        if (onChange) {
          onChange(value);
        }
      }}
      getOptionLabel={(option) => {
        return option.name ? `${option.name}` : "";
      }}
      renderOption={(props, option) => (
        <Box {...props} component="li" sx={{ display: "block", width: "100%" }}>
          <Stack
            alignItems="center"
            spacing={1}
            direction="row"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Stack
              alignItems="center"
              spacing={1}
              direction="row"
              justifyContent="space-between"
            >
              <Avatar
                src={option.logoURI}
                sx={{ width: "1rem", height: "1rem" }}
              />
              <div>{option.name}</div>
            </Stack>
            <Typography color="text.secondary">
              {formatUnits(getTokenBalance(option.address), option.decimals)}{" "}
              {option?.symbol.toUpperCase() || ""}
            </Typography>
          </Stack>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={
            token ? (
              <FormattedMessage id="token" defaultMessage="Token" />
            ) : (
              <FormattedMessage
                id="search.token"
                defaultMessage="Search token"
              />
            )
          }
          inputProps={{
            ...params.inputProps,
            autoComplete: "off", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
