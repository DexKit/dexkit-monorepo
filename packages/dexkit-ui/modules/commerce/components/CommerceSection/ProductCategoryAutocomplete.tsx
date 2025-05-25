import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import { useIntl } from "react-intl";

import type { ProductCategoryType } from "../../types";

export interface ProductCategoryAutocompleteProps {
  categories: ProductCategoryType[];
  value: ProductCategoryType | null;
  onChange: (value: ProductCategoryType | null) => void;
}

export default function ProductCategoryAutocomplete({
  categories,
  onChange,
  value,
}: ProductCategoryAutocompleteProps) {
  const { formatMessage } = useIntl();

  return (
    <Autocomplete
      options={categories ?? []}
      getOptionLabel={(opt) => opt.name}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={
            value
              ? formatMessage({
                  id: "categories",
                  defaultMessage: "Categories",
                })
              : undefined
          }
          placeholder={
            !value
              ? formatMessage({ id: "category", defaultMessage: "Category" })
              : undefined
          }
        />
      )}
      value={value}
      onChange={(e, value, reason) => {
        onChange(value);
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
