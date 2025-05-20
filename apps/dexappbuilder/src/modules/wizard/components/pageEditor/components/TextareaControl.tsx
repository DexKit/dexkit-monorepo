import { useIsMobile } from '@dexkit/core';
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
  const isMobile = useIsMobile();

  return (
    <Stack spacing={isMobile ? 1 : 2}>
      <Alert
        severity="warning"
        sx={{
          '& .MuiAlert-message': {
            fontSize: isMobile ? '0.85rem' : undefined
          }
        }}
      >
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
        minRows={isMobile ? 3 : 5}
        style={{
          padding: isMobile ? '8px' : '12px',
          fontSize: isMobile ? '0.9rem' : '1rem',
          fontFamily: 'inherit'
        }}
        onChange={(ev) => {
          data.onChange({ html: ev.currentTarget.value });
        }}
      />
    </Stack>
  );
}
