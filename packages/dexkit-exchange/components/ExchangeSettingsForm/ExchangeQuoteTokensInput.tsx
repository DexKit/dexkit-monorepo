import { ChainId, TOKEN_ICON_URL } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import TokenIcon from "@mui/icons-material/Token";
import {
  Autocomplete,
  Avatar,
  Chip,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useMemo } from "react";

import remove from "lodash/remove";

import { isAddressEqual } from "@dexkit/core/utils";
import { useField } from "formik";

export interface ExchangeQuoteTokensInputProps {
  label?: React.ReactNode;
  tokens: Token[];
  chainId?: ChainId;
}

export default function ExchangeQuoteTokensInput({
  label,
  tokens,
  chainId,
}: ExchangeQuoteTokensInputProps) {
  const [field, meta, helpers] = useField<Token[] | undefined>(
    `defaultTokens.${chainId}.quoteTokens`,
  );

  const [baseField, baseMeta, baseHelpers] = useField<Token[] | undefined>(
    `defaultTokens.${chainId}.baseTokens`,
  );

  const chainTokens = useMemo(() => {
    if (!chainId) {
      return [];
    }

    const res = tokens.filter((t) => t.chainId === chainId);
    return res;
  }, [chainId, tokens]);

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: Token[] | undefined,
  ) => {
    let newTokens = [...chainTokens];

    if (value) {
      remove(newTokens, (token) => {
        return (
          value.findIndex(
            (t) =>
              t.chainId === token.chainId &&
              isAddressEqual(t.address, token.address),
          ) > -1
        );
      });
    }

    if (value) {
      helpers.setValue(value);
    } else {
      helpers.setValue(undefined);
    }

    baseHelpers.setValue(newTokens);
  };

  return (
    <Autocomplete
      disablePortal
      value={field.value}
      options={chainTokens}
      fullWidth
      onChange={handleChange}
      multiple
      isOptionEqualToValue={(opt, value) =>
        opt.chainId === value.chainId &&
        isAddressEqual(opt.address, value.address)
      }
      renderOption={(props, opt) => (
        <MenuItem {...props}>
          <ListItemAvatar>
            <Avatar
              src={
                opt.logoURI
                  ? opt.logoURI
                  : TOKEN_ICON_URL(opt.address, opt.chainId)
              }
            >
              <TokenIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={opt.symbol.toUpperCase()}
            secondary={opt.name}
          />
        </MenuItem>
      )}
      renderTags={(value: readonly Token[], getTagProps) =>
        value.map((option: Token, index: number) => (
          <Chip
            icon={
              <Avatar
                sx={{ height: "1rem", width: "1rem" }}
                src={
                  option.logoURI
                    ? option.logoURI
                    : TOKEN_ICON_URL(option.address, option.chainId)
                }
              >
                <TokenIcon />
              </Avatar>
            }
            variant="outlined"
            label={option.symbol.toUpperCase()}
            {...getTagProps({ index })}
          />
        ))
      }
      getOptionLabel={(opt) => opt.symbol.toUpperCase()}
      renderInput={(params) => {
        return (
          <TextField
            key={params.inputProps.value?.toString()}
            {...params}
            label={label}
          />
        );
      }}
    />
  );
}
