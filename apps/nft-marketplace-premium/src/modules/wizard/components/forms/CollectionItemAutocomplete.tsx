import { useNetworkMetadata } from '@dexkit/ui/hooks/app';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';
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
  formValue: {
    chainId?: number;
    contractAddress?: string;
    backgroundImageUrl?: string;
  };
  onChange: (formValue: any) => void;
}

export function CollectionItemAutocomplete(props: Props) {
  const { formValue, onChange } = props;
  const { wizardConfig } = useAppWizardConfig();
  const [collectionValue, setCollectionValue] = useState<Data | undefined>();

  const { NETWORK_SYMBOL, NETWORK_NAME } = useNetworkMetadata();

  const collections =
    wizardConfig.collections?.map((value) => {
      return {
        name: value.name,
        contractAddress: value.contractAddress,
        backgroundImage: value.backgroundImage,
        network: NETWORK_NAME(value.chainId) as string,
        chainId: value.chainId,
        image: value.image,
      };
    }) || [];

  useEffect(() => {
    if (
      formValue &&
      collections &&
      formValue.chainId !== collectionValue?.chainId &&
      formValue.contractAddress?.toLowerCase() !==
        collectionValue?.contractAddress.toLowerCase()
    ) {
      const coll = collections.find(
        (c) =>
          Number(c.chainId) === Number(formValue.chainId) &&
          c.contractAddress?.toLowerCase() ===
            formValue.contractAddress?.toLowerCase(),
      );
      if (coll) {
        setCollectionValue({ ...coll });
      }
    }
  }, [formValue, collections, collectionValue]);

  const dataValue = useMemo(() => {
    return { ...collectionValue };
  }, [collectionValue]);

  return (
    <Autocomplete
      id="item-collection"
      sx={{ width: 300 }}
      value={dataValue || null}
      defaultValue={dataValue || null}
      options={collections}
      autoHighlight
      isOptionEqualToValue={(op, val) =>
        op?.chainId === val?.chainId &&
        op?.contractAddress?.toLowerCase() ===
          val?.contractAddress?.toLowerCase()
      }
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
        option.name ? `${NETWORK_SYMBOL(option.chainId)}-${option.name}` : ''
      }
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img loading="lazy" width="20" src={`${option.image}`} alt="" />
          {NETWORK_NAME(option.chainId)} - {option.name}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a collection"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
