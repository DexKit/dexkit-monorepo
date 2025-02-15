import { useDebounce } from "@dexkit/core";
import {
  Autocomplete,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

import useProductList from "../hooks/useProductList";
import { ProductFormType } from "../types";

export interface ProductsAutocompleteProps {
  product: ProductFormType | null;
  onChange: (product: ProductFormType | null) => void;
}

export default function ProductsAutocomplete({
  product,
  onChange,
}: ProductsAutocompleteProps) {
  const [query, setQuery] = useState("");

  const lazyQuery = useDebounce<string>(query, 500);

  const { data: products } = useProductList({
    limit: 10,
    page: 0,
    q: lazyQuery,
  });

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
        onChange(value);
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
          fullWidth
          value={query}
          onChange={handleChange}
        />
      )}
    />
  );
}
