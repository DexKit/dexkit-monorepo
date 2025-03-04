import { Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { CellPluginComponentProps } from '@react-page/editor';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
  data: CellPluginComponentProps<Partial<any>>;
}

export function TextareaControl(props: Props) {
  const { formatMessage } = useIntl();
  const { data } = props;

  return (
    <Stack spacing={2}>
      <Alert severity="warning">
        <FormattedMessage
          id={'careful.with.scripts'}
          defaultMessage={'Be careful with scripts and html that you use here'}
        />
      </Alert>
      <TextareaAutosize
        defaultValue={data.data.html ? data.data.html : undefined}
        aria-label="empty textarea"
        placeholder={formatMessage({
          id: 'insert.valid.html',
          defaultMessage: 'Insert valid HTML',
        })}
        minRows={5}
        onChange={(ev) => {
          data.onChange({ html: ev.currentTarget.value });
        }}
      />
    </Stack>
  );
}
