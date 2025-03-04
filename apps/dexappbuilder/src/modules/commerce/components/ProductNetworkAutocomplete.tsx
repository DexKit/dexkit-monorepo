import { ChainId } from '@dexkit/core';
import { NETWORKS } from '@dexkit/core/constants/networks';
import { parseChainId } from '@dexkit/core/utils';
import { useActiveChainIds } from '@dexkit/ui';
import {
  Avatar,
  Box,
  FormControl,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { Field } from 'formik';
import { Select } from 'formik-mui';
import { useMemo } from 'react';

export interface ProductNetworkAutocompleteProps {
  name: string;
}

export default function ProductNetworkAutocomplete({
  name,
}: ProductNetworkAutocompleteProps) {
  const { activeChainIds } = useActiveChainIds();

  const options = useMemo(() => {
    return Object.keys(NETWORKS)
      .filter((k) => activeChainIds.includes(Number(k)))
      .map((key) => NETWORKS[parseChainId(key)])
      .map((network) => (
        <MenuItem value={network.chainId} key={network.chainId}>
          <Box mr={2}>
            <Avatar
              src={network.imageUrl}
              sx={{ width: '1.5rem', height: '1.5rem' }}
            />
          </Box>
          <ListItemText primary={network.name} />
        </MenuItem>
      ));
  }, [activeChainIds]);

  return (
    <FormControl fullWidth>
      <Field
        component={Select}
        name={name}
        size="small"
        renderValue={(value: ChainId) => {
          return (
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              spacing={1}
            >
              <Avatar
                src={NETWORKS[value]?.imageUrl || ''}
                style={{ width: 'auto', height: '1rem' }}
              />
              <Typography variant="body1">{NETWORKS[value]?.name}</Typography>
            </Stack>
          );
        }}
        fullWidth
      >
        {options}
      </Field>
    </FormControl>
  );
}
