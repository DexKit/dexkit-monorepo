import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import { useIntl } from "react-intl";

import { useMemo } from "react";
import type { Checkout } from "../../types";

export interface CheckoutsAutocompleteProps {
  items: Checkout[];
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function CheckoutsAutocomplete({
  items,
  onChange,
  value,
}: CheckoutsAutocompleteProps) {
  const { formatMessage } = useIntl();

  const inputValue = useMemo(() => {
    return items.find((c) => c.id === value) ?? null;
  }, [items, value]);

  return (
    <Autocomplete
      options={items ?? []}
      getOptionLabel={(opt) => opt.title}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={
            value
              ? formatMessage({
                  id: "checkout",
                  defaultMessage: "Checkout",
                })
              : undefined
          }
          placeholder={
            !value
              ? formatMessage({ id: "Checkouts", defaultMessage: "checkouts" })
              : undefined
          }
        />
      )}
      value={inputValue}
      onChange={(e, value, reason) => {
        if (value?.id) {
          onChange(value?.id);
        } else {
          onChange(null);
        }
      }}
      renderOption={(props, opt) => {
        return (
          <li {...props}>
            <Stack spacing={2}>
              <Typography>{opt.title}</Typography>
            </Stack>
          </li>
        );
      }}
      fullWidth
    />
  );
}
