import { isAddressEqual } from '@dexkit/core/utils';
import { useTokenList } from '@dexkit/ui';
import {
  Autocomplete,
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  useTheme,
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
  const theme = useTheme();

  const tokens = useTokenList({
    chainId: props.value.chainId,
    includeNative: true,
  });

  const value = useMemo(() => {
    return (
      tokens.find(
        (t: any) =>
          isAddressEqual(t.address, propsField.value) &&
          t.chainId === props.value.chainId,
      ) ?? null
    );
  }, [tokens, propsField.value]);

  return (
    <Autocomplete
      options={tokens}
      value={value}
      sx={{ minWidth: { sm: theme.spacing(37.5) } }}
      getOptionLabel={(t) => t.name}
      onChange={(e, value, reason) => {
        helpersField.setValue(value?.address ?? '');
      }}
      fullWidth
      renderOption={(params, opt) => (
        <ListItem {...params}>
          <ListItemIcon>
            <Avatar sx={{ width: theme.spacing(2), height: theme.spacing(2) }} src={opt.logoURI} />
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
