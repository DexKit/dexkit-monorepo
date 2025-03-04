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

  return (
    <Stack spacing={2}>
      <CollectionAutocomplete data={props.data} />
      {data.data.contractAddress && (
        <TextField
          defaultValue={data.data.id ? data.data.id : undefined}
          id="outlined-basic"
          label={
            <FormattedMessage id={'token.id'} defaultMessage={'Token Id'} />
          }
          variant="outlined"
          onChange={(ev) =>
            data.onChange({ ...data.data, id: ev.currentTarget.value })
          }
        />
      )}
    </Stack>
  );
}
