import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useMemo } from 'react';

import { isAddressEqual } from '@dexkit/core/utils';
import { getChainName, getChainSymbol } from '@dexkit/core/utils/blockchain';
import { FormattedMessage } from 'react-intl';
import { useAppWizardConfig } from '../../hooks';

type Data = {
  image: string;
  name: string;
  backgroundImage: string;
  network: string;
  chainId: number;
  contractAddress: string;
  description?: string;
  uri?: string;
};

interface Props {
  value: {
    chainId?: number;
    contractAddress?: string;
    backgroundImageUrl?: string;
  };
  filterByChainId?: boolean;
  chainId?: number;
  onChange: (formValue: any) => void;
  disabled?: boolean;
}

export function CollectionItemAutocomplete(props: Props) {
  const { value, onChange, filterByChainId, chainId, disabled } = props;
  const { wizardConfig } = useAppWizardConfig();

  const collections = useMemo(() => {
    return chainId
      ? wizardConfig.collections
          ?.filter((c) => c.chainId === chainId)
          .map((value) => {
            return {
              name: value.name,
              contractAddress: value.contractAddress,
              backgroundImage: value.backgroundImage,
              network: getChainName(value.chainId) as string,
              chainId: value.chainId,
              image: value.image,
            };
          }) || []
      : wizardConfig.collections?.map((value) => {
          return {
            name: value.name,
            contractAddress: value.contractAddress,
            backgroundImage: value.backgroundImage,
            network: getChainName(value.chainId) as string,
            chainId: value.chainId,
            image: value.image,
          };
        }) || [];
  }, [chainId]);

  const defaultValue = useMemo(() => {
    const collection = collections.find(
      (c) =>
        c.chainId === value.chainId &&
        isAddressEqual(value.contractAddress, c.contractAddress),
    );

    if (collection) {
      return collection;
    }

    return null;
  }, [value, collections]);

  return (
    <Autocomplete
      id="item-collection"
      fullWidth
      value={defaultValue}
      options={collections}
      key={String(defaultValue)}
      isOptionEqualToValue={(op, val) =>
        op?.chainId === val?.chainId &&
        isAddressEqual(op?.contractAddress, val?.contractAddress)
      }
      disabled={disabled}
      onChange={(_change, value) => {
        if (value) {
          onChange({
            name: value.name,
            contractAddress: value.contractAddress,
            backgroundImage: value.backgroundImage,
            network: value.network,
            chainId: value.chainId,
            image: value.image,
          });
        }
      }}
      getOptionLabel={(option) =>
        option.name ? `${option.name}- ${getChainSymbol(option.chainId)}` : ''
      }
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img loading="lazy" width="20" src={`${option.image}`} alt="" />
          {option.name} - {getChainName(option.chainId)}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={
            <FormattedMessage
              id="choose.a.collection"
              defaultMessage="Choose a collection"
            />
          }
          fullWidth
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
