import { TOKEN_ICON_URL } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import TokenIcon from "@mui/icons-material/Token";
import {
  Autocomplete,
  Avatar,
  InputAdornment,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import React from "react";

import { isAddressEqual } from "@dexkit/core/utils";
import { useField, useFormikContext } from "formik";

export interface ExchangeTokenInputProps {
  tokens: Token[];
  label?: React.ReactNode;
  name: string;
}

export default function ExchangeTokenInput({
  tokens,
  label,
  name,
}: ExchangeTokenInputProps) {
  const { errors } = useFormikContext<any>();
  const [field, meta, helpers] = useField<Token | undefined>(name);

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: Token | null,
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
      getOptionLabel={(opt) => opt.symbol.toUpperCase()}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              startAdornment: field.value ? (
                <InputAdornment position="end">
                  <Avatar
                    sx={{ width: "1rem", height: "1rem" }}
                    src={
                      field.value.logoURI
                        ? field.value.logoURI
                        : field.value
                          ? TOKEN_ICON_URL(
                              field.value.address,
                              field.value.chainId,
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
