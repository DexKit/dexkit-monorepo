import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import { useIntl } from "react-intl";

import { useMemo } from "react";
import type { ProductCollectionType } from "../types";

export interface CollectionsAutocompleteProps {
  items: ProductCollectionType[];
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function CollectionsAutocomplete({
  items,
  onChange,
  value,
}: CollectionsAutocompleteProps) {
  const { formatMessage } = useIntl();

  const inputValue = useMemo(() => {
    return items.find((c) => c.id === value) ?? null;
  }, [items, value]);

  return (
    <Autocomplete
      options={items ?? []}
      getOptionLabel={(opt) => opt.name}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={
            value
              ? formatMessage({
                  id: "collection",
                  defaultMessage: "Collection",
                })
              : undefined
          }
          placeholder={
            !value
              ? formatMessage({
                  id: "collections",
                  defaultMessage: "Collections",
                })
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
              <Typography>{opt.name}</Typography>
            </Stack>
          </li>
        );
      }}
      fullWidth
    />
  );
}
