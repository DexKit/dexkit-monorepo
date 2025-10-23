import { ChainId, TOKEN_ICON_URL, useIsMobile } from "@dexkit/core";
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
  size?: "small" | "medium";
}

export default function ExchangeQuoteTokensInput({
  label,
  tokens,
  chainId,
  size: propSize,
}: ExchangeQuoteTokensInputProps) {
  const isMobile = useIsMobile();
  const size = propSize || (isMobile ? "small" : "medium");

  const [field, meta, helpers] = useField<Token[] | undefined>(
    `defaultTokens.${chainId}.quoteTokens`
  );

  const [baseField, baseMeta, baseHelpers] = useField<Token[] | undefined>(
    `defaultTokens.${chainId}.baseTokens`
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
    value: Token[] | undefined
  ) => {
    let newTokens = [...chainTokens];

    if (value) {
      remove(newTokens, (token) => {
        return (
          value.findIndex(
            (t) =>
              t.chainId === token.chainId &&
              isAddressEqual(t.address, token.address)
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
      size={size}
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
              sx={{ width: isMobile ? "1.5rem" : "2rem", height: isMobile ? "1.5rem" : "2rem" }}
            >
              <TokenIcon fontSize={isMobile ? "small" : "medium"} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={opt.symbol.toUpperCase()}
            secondary={opt.name}
            slotProps={{
              primary: { variant: isMobile ? "body2" : "body1" },
              secondary: { variant: isMobile ? "caption" : "body2" }
            }}
          />
        </MenuItem>
      )}
      renderTags={(value: readonly Token[], getTagProps) =>
        value.map((option: Token, index: number) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              key={key}
              icon={
                <Avatar
                  sx={{ height: isMobile ? "0.85rem" : "1rem", width: isMobile ? "0.85rem" : "1rem" }}
                  src={
                    option.logoURI
                      ? option.logoURI
                      : TOKEN_ICON_URL(option.address, option.chainId)
                  }
                >
                  <TokenIcon fontSize="small" />
                </Avatar>
              }
              variant="outlined"
              label={option.symbol.toUpperCase()}
              size={isMobile ? "small" : "medium"}
              {...tagProps}
            />
          );
        })
      }
      getOptionLabel={(opt) => opt.symbol.toUpperCase()}
      renderInput={(params) => {
        return (
          <TextField
            key={params.inputProps.value?.toString()}
            {...params}
            label={label}
            size={size}
          />
        );
      }}
    />
  );
}
