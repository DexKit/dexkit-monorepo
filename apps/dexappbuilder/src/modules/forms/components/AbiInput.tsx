import PasteIconButton from '@dexkit/ui/components/PasteIconButton';
import { AbiFragment } from '@dexkit/web3forms/types';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { InputAdornment, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { useSnackbar } from 'notistack';
import { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

export interface AbiInputProps {}

function AbiInput({}: AbiInputProps) {
  const { setFieldValue, values } = useFormikContext();

  const { enqueueSnackbar } = useSnackbar();

  const handlePaste = (data: string) => {
    try {
      const abi: AbiFragment[] = JSON.parse(data);

      setFieldValue('abi', data);
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  const formattedAbi = useMemo(() => {
    if ((values as any).abi) {
      return JSON.stringify(JSON.parse((values as any).abi), null, 2);
    }
  }, [values]);

  return (
    <TextField
      fullWidth
      multiline
      InputLabelProps={{ shrink: Boolean((values as any).abi) }}
      rows={3}
      value={formattedAbi}
      disabled
      label={<FormattedMessage id="abi" defaultMessage="ABI" />}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <PasteIconButton icon={<FileCopyIcon />} onPaste={handlePaste} />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default memo(AbiInput);
