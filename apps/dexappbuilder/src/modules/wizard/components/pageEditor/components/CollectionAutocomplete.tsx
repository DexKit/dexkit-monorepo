import { getChainName } from '@dexkit/core/utils/blockchain';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { CellPluginComponentProps } from '@react-page/editor';
import { useAppWizardConfig } from '../../../hooks';

interface Props {
  data: CellPluginComponentProps<Partial<any>>;
}

export function CollectionAutocomplete(props: Props) {
  const { data } = props;
  const { wizardConfig } = useAppWizardConfig();

  const formValue = data.data;
  const collections =
    wizardConfig.collections?.map((value) => {
      return {
        name: value.name,
        contractAddress: value.contractAddress,
        backgroundImage: value.backgroundImage,
        network: getChainName(value.chainId),
        chainId: value.chainId,
        image: value.image,
      };
    }) || [];

  return (
    <Autocomplete
      id="collection"
      sx={{ width: 300 }}
      inputValue={formValue?.name ? formValue.name : ''}
      options={collections}
      autoHighlight
      fullWidth
      onChange={(_change, value) => {
        if (value) {
          data.onChange({
            name: value.name,
            contractAddress: value.contractAddress,
            backgroundImage: value.backgroundImage,
            network: value.network,
            chainId: value.chainId,
            image: value.image,
          });
        }
      }}
      getOptionLabel={(option) => option.name}
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
          label="Choose a collection"
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
