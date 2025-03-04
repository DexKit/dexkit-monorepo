import { isAddressEqual } from '@dexkit/core/utils';
import { useTokenList } from '@dexkit/ui';
import {
  Autocomplete,
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import { useField } from 'formik';
import { useMemo } from 'react';

export interface ProductTokenAutocompleteProps {
  name: string;
  prefix: string;
}

export default function ProductTokenAutocomplete({
  name,
  prefix,
}: ProductTokenAutocompleteProps) {
  const [props, meta, helpers] = useField<any>(prefix);
  const [propsField, metaField, helpersField] = useField<string>(name);

  const tokens = useTokenList({
    chainId: props.value.chainId,
    includeNative: true,
  });

  const value = useMemo(() => {
    return (
      tokens.find(
        (t) =>
          isAddressEqual(t.address, propsField.value) &&
          t.chainId === props.value.chainId,
      ) ?? null
    );
  }, [tokens, propsField.value]);

  return (
    <Autocomplete
      options={tokens}
      value={value}
      sx={{ minWidth: { sm: '300px' } }}
      getOptionLabel={(t) => t.name}
      onChange={(e, value, reason) => {
        helpersField.setValue(value?.address ?? '');
      }}
      fullWidth
      renderOption={(params, opt) => (
        <ListItem {...params}>
          <ListItemIcon>
            <Avatar sx={{ width: '1rem', height: '1rem' }} src={opt.logoURI} />
          </ListItemIcon>
          <ListItemText primary={opt.name} />
        </ListItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          fullWidth
          error={Boolean(metaField.error)}
          helperText={metaField.error?.toString() ?? undefined}
        />
      )}
    />
  );
}
