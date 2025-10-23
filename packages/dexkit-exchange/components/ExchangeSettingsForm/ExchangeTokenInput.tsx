import { TOKEN_ICON_URL, useIsMobile } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import TokenIcon from "@mui/icons-material/Token";
import {
  Autocomplete,
  Avatar,
  InputAdornment,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  TextField
} from "@mui/material";
import React from "react";

import { isAddressEqual } from "@dexkit/core/utils";
import { useField, useFormikContext } from "formik";

export interface ExchangeTokenInputProps {
  tokens: Token[];
  label?: React.ReactNode;
  name: string;
  size?: "small" | "medium";
}

export default function ExchangeTokenInput({
  tokens,
  label,
  name,
  size: propSize,
}: ExchangeTokenInputProps) {
  const { errors } = useFormikContext<any>();
  const [field, meta, helpers] = useField<Token | undefined>(name);
  const isMobile = useIsMobile();
  const size = propSize || (isMobile ? "small" : "medium");

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: Token | null
  ) => {
    if (value) {
      helpers.setValue(value);
    } else {
      helpers.setValue(undefined);
    }
  };

  return (
    <Autocomplete
      disablePortal
      value={field?.value}
      options={tokens}
      fullWidth
      onChange={handleChange}
      size={size}
      isOptionEqualToValue={(opt, value) =>
        opt?.chainId === value?.chainId &&
        isAddressEqual(opt?.address, value?.address)
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
      getOptionLabel={(opt) => opt.symbol.toUpperCase()}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label={label}
            size={size}
            InputProps={{
              ...params.InputProps,
              startAdornment: field.value ? (
                <InputAdornment position="end">
                  <Avatar
                    sx={{ width: isMobile ? "0.85rem" : "1rem", height: isMobile ? "0.85rem" : "1rem" }}
                    src={
                      field.value.logoURI
                        ? field.value.logoURI
                        : field.value
                          ? TOKEN_ICON_URL(
                            field.value.address,
                            field.value.chainId
                          )
                          : undefined
                    }
                  />
                </InputAdornment>
              ) : undefined,
            }}
            error={Boolean(meta.error)}
            helperText={meta.error}
          />
        );
      }}
    />
  );
}
