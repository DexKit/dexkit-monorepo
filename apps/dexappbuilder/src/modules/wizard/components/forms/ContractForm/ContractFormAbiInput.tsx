import { inputMapping } from '@/modules/wizard/utils';
import { useIsMobile } from '@dexkit/core';
import PasteIconButton from '@dexkit/ui/components/PasteIconButton';
import { AbiFragment, ContractFormParams } from '@dexkit/web3forms/types';
import { normalizeAbi } from '@dexkit/web3forms/utils';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Box, InputAdornment, TextField, Tooltip, useTheme } from '@mui/material';
import { useFormikContext } from 'formik';
import { useSnackbar } from 'notistack';
import { memo } from 'react';
import { FormattedMessage } from 'react-intl';

export interface ContractFormAbiInputProps {
  abiStr: string;
}

function ContractFormAbiInput({ abiStr }: ContractFormAbiInputProps) {
  const { setFieldValue } = useFormikContext<ContractFormParams>();
  const isMobile = useIsMobile();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const handlePaste = (data: string) => {
    try {
      const abi: AbiFragment[] = normalizeAbi(JSON.parse(data));
      const fields = inputMapping(abi);

      setFieldValue('abi', abi);
      setFieldValue('fields', fields);
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }
  };

  return (
    <TextField
      fullWidth
      multiline
      rows={isMobile ? 1 : 3}
      value={abiStr}
      disabled
      label={<FormattedMessage id="abi" defaultMessage="ABI" />}
      size={isMobile ? "small" : "medium"}
      margin={isMobile ? "dense" : "normal"}
      inputProps={{
        style: isMobile ? {
          fontSize: theme.typography.body2.fontSize,
          padding: `${theme.spacing(0.75)} ${theme.spacing(1.25)}`
        } : {}
      }}
      InputLabelProps={isMobile ? {
        style: { fontSize: theme.typography.body2.fontSize }
      } : {}}
      sx={isMobile ? {
        '& .MuiInputBase-root': {
          minHeight: theme.spacing(4.375)
        }
      } : {}}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip
              title={<FormattedMessage id="paste" defaultMessage="Paste" />}
            >
              <Box>
                <PasteIconButton
                  icon={<FileCopyIcon fontSize={isMobile ? "small" : "medium"} />}
                  onPaste={handlePaste}
                />
              </Box>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default memo(ContractFormAbiInput);
