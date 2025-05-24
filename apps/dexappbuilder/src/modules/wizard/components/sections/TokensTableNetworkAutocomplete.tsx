import { NETWORKS } from '@dexkit/core/constants/networks';
import { Network } from '@dexkit/core/types';
import { parseChainId } from '@dexkit/core/utils';
import { useActiveChainIds } from '@dexkit/ui';
import { Autocomplete, TextField, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

export interface TokensTableNetworkAutocompleteProps {
  selectedNetwoks: Network[];
  onChange: (selectedNetwoks: Network[]) => void;
  isMobile?: boolean;
}

export default function TokensTableNetworkAutocomplete({
  selectedNetwoks,
  onChange,
  isMobile,
}: TokensTableNetworkAutocompleteProps) {
  const { activeChainIds } = useActiveChainIds();
  const theme = useTheme();

  const networks = useMemo(() => {
    return Object.keys(NETWORKS)
      .filter((n) => activeChainIds.includes(Number(n)))
      .map((key) => NETWORKS[parseChainId(key)])
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
  }, [activeChainIds]);

  const { formatMessage } = useIntl();

  return (
    <Autocomplete
      componentsProps={{
        popper: { style: { width: 'fit-content' }, placement: 'bottom-start' },
      }}
      options={networks}
      value={selectedNetwoks}
      limitTags={isMobile ? 1 : 2}
      size={isMobile ? "small" : "medium"}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder={
            selectedNetwoks.length > 0
              ? ''
              : formatMessage({
                id: 'select.network.alt',
                defaultMessage: 'Select network',
              })
          }
          InputProps={{
            ...params.InputProps,
            style: {
              fontSize: isMobile ? theme.typography.body2.fontSize : undefined,
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: isMobile ? theme.typography.body2.fontSize : undefined,
            },
          }}
        />
      )}
      getOptionLabel={(opt) => opt.name}
      multiple
      onChange={(e, value) => {
        onChange(value);
      }}
    />
  );
}
