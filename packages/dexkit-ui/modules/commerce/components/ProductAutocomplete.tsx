import { useDebounce } from "@dexkit/core";
import {
  Autocomplete,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import { useField } from "formik";
import { ChangeEvent, useState } from "react";

import useProduct from "../hooks/useProduct";
import useProductList from "../hooks/useProductList";

export interface ProductAutocompleteProps {
  name: string;
}

export default function ProductAutocomplete({
  name,
}: ProductAutocompleteProps) {
  const [props, meta, helpers] = useField<string>(`${name}`);

  const [query, setQuery] = useState("");

  const lazyQuery = useDebounce<string>(query, 500);

  const { data: products } = useProductList({
    limit: 10,
    page: 0,
    q: lazyQuery,
  });

  const { data: product, refetch } = useProduct({ id: props.value });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <Autocomplete
      options={products?.items ?? []}
      value={product ?? null}
      sx={{ minWidth: { sm: "300px" } }}
      getOptionLabel={(t) => t.name}
      isOptionEqualToValue={(opt, value) => opt.id === value.id}
      onChange={(e, value, reason) => {
        helpers.setValue(value?.id ?? "");
      }}
      fullWidth
      renderOption={(params, opt) => (
        <ListItem {...params}>
          <ListItemAvatar>
            <Avatar
              src={opt.imageUrl ?? ""}
              sx={{ width: "1.5rem", height: "1.5rem" }}
              variant="rounded"
            />
          </ListItemAvatar>
          <ListItemText primary={opt.name} />
        </ListItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          fullWidth
          error={Boolean(meta.error)}
          helperText={meta.error?.toString() ?? undefined}
          value={query}
          onChange={handleChange}
        />
      )}
    />
  );
}
