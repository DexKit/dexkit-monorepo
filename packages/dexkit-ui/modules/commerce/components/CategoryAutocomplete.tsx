import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { ProductCategoryType } from "../types";

export interface CategoryAutocompleteProps {
  categories: ProductCategoryType[];
  value: ProductCategoryType[];
  onChange: (value: ProductCategoryType[]) => void;
}

export default function CategoryAutocomplete({
  categories,
  onChange,
  value,
}: CategoryAutocompleteProps) {
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
            value.length > 0
              ? formatMessage({
                  id: "categories",
                  defaultMessage: "Categories",
                })
              : undefined
          }
          placeholder={
            value.length === 0
              ? formatMessage({ id: "category", defaultMessage: "Category" })
              : undefined
          }
        />
      )}
      multiple
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
