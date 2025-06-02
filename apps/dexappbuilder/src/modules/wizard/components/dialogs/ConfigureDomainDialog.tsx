import {
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import { copyToClipboard } from '@dexkit/core/utils/browser';
import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { CopyIconButton } from '../../../../components/CopyIconButton';
import { ConfigResponse } from '../../../../types/whitelabel';

interface Props {
  dialogProps: DialogProps;
  config?: ConfigResponse;
}

export default function ConfigureDomainDialog({ dialogProps, config }: Props) {
  const { onClose } = dialogProps;

  const { formatMessage } = useIntl();

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const handleCopy = () => {
    if (config && config.cname) {
      copyToClipboard(config.cname);
    }
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="configure.domain"
            defaultMessage="Configure Domain"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Stack>
          <TextField
            fullWidth
            value={config?.cname || ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CopyIconButton
                    iconButtonProps={{
                      onClick: handleCopy,
                      size: 'small',
                    }}
                    tooltip={formatMessage({
                      id: 'copy',
                      defaultMessage: 'Copy',
                      description: 'Copy text',
                    })}
                    activeTooltip={formatMessage({
                      id: 'copied',
                      defaultMessage: 'Copied!',
                      description: 'Copied text',
                    })}
                  >
                    <FileCopyIcon />
                  </CopyIconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
