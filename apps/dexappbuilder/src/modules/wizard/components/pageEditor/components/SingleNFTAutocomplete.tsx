import { useIsMobile } from '@dexkit/core';
import { Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import { CellPluginComponentProps } from '@react-page/editor';
import { FormattedMessage } from 'react-intl';
import { CollectionAutocomplete } from './CollectionAutocomplete';

interface Props {
  data: CellPluginComponentProps<Partial<any>>;
}
export function SingleNFTAutocomplete(props: Props) {
  const { data } = props;
  const isMobile = useIsMobile();

  return (
    <Stack spacing={isMobile ? 1 : 2} sx={{ width: '100%' }}>
      <CollectionAutocomplete data={props.data} />
      {data.data.contractAddress && (
        <TextField
          defaultValue={data.data.id ? data.data.id : undefined}
          id="outlined-basic"
          fullWidth
          size={isMobile ? "small" : "medium"}
          label={
            <FormattedMessage id={'token.id'} defaultMessage={'Token Id'} />
          }
          variant="outlined"
          onChange={(ev) =>
            data.onChange({ ...data.data, id: ev.currentTarget.value })
          }
          sx={{
            mt: isMobile ? 1 : 2,
            '& .MuiInputBase-root': {
              fontSize: isMobile ? '0.9rem' : undefined
            }
          }}
        />
      )}
    </Stack>
  );
}
