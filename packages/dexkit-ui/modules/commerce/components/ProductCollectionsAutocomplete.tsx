import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import { useIntl } from "react-intl";

import type { ProductCollectionType } from "../types";

export interface ProductCollectionsAutocompleteProps {
  collections: ProductCollectionType[];
  value: ProductCollectionType[];
  onChange: (value: ProductCollectionType[]) => void;
}

export default function ProductCollectionsAutocomplete({
  collections,
  onChange,
  value,
}: ProductCollectionsAutocompleteProps) {
  const { formatMessage } = useIntl();

  return (
    <Autocomplete
      options={collections ?? []}
      getOptionLabel={(opt) => opt.name}
      multiple
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={
            value
              ? formatMessage({
                  id: "collection.s",
                  defaultMessage: "Collections(s)",
                })
              : undefined
          }
          placeholder={
            !value
              ? formatMessage({
                  id: "collection.s",
                  defaultMessage: "Collections(s)",
                })
              : undefined
          }
        />
      )}
      value={value}
      onChange={(e, value, reason) => {
        if (value) {
          onChange(value);
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
