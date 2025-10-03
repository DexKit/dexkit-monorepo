import { useIsMobile } from '@dexkit/core';
import { getChainName } from '@dexkit/core/utils/blockchain';
import { useTheme } from '@mui/material';
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
  const isMobile = useIsMobile();
  const theme = useTheme();

  const formValue = data.data;
  const collections =
    wizardConfig.collections?.map((value: any) => {
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
      sx={{
        width: '100%',
        '& .MuiAutocomplete-inputRoot': {
          fontSize: isMobile ? theme.typography.body2.fontSize : undefined
        }
      }}
      inputValue={formValue?.name ? formValue.name : ''}
      options={collections}
      autoHighlight
      fullWidth
      onChange={(_change: any, value: any) => {
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
      getOptionLabel={(option: any) => option.name}
      renderOption={(props: any, option: any) => (
        <Box
          component="li"
          sx={{
            '& > img': { mr: theme.spacing(2), flexShrink: 0 },
            fontSize: isMobile ? theme.typography.body2.fontSize : undefined,
            py: isMobile ? theme.spacing(1) : undefined
          }}
          {...props}
        >
          <img loading="lazy" width={isMobile ? theme.spacing(2) : theme.spacing(2.5)} src={`${option.image}`} alt="" />
          {option.name} - {getChainName(option.chainId)}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a collection"
          fullWidth
          size={isMobile ? "small" : "medium"}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
