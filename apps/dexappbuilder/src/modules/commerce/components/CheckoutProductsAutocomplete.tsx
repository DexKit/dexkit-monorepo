import { Autocomplete, TextField } from '@mui/material';

export default function CheckoutProductsAutocomplete() {
  return (
    <Autocomplete
      options={[]}
      renderInput={(params) => <TextField {...params} />}
    />
  );
}
