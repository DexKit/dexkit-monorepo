import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormControlLabel,
  InputAdornment,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useAtom } from 'jotai';
import { ChangeEvent, memo, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { isAutoSlippageAtom, maxSlippageAtom } from '../../../../state/atoms';

interface Props {
  dialogProps: DialogProps;
}

function SwapSettingsDialog({ dialogProps }: Props) {
  const { onClose } = dialogProps;

  const [maxSlippage, setMaxSlippage] = useAtom(maxSlippageAtom);
  const [isAutoSlippageStore, setIsAutoSlippageStore] =
    useAtom(isAutoSlippageAtom);

  const [isAutoSlippage, setIsAutoSlippage] = useState(isAutoSlippageStore);
  const [slippage, setSlippage] = useState<string>(
    (maxSlippage * 100).toString(),
  );

  const handleClose = () => {
    onClose!({}, 'backdropClick');
  };

  const handleToggleAutoSlippage = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    return setIsAutoSlippage(checked);
  };

  const handleChangeSlippage = (e: ChangeEvent<HTMLInputElement>) => {
    setSlippage(e.target.value);
  };

  const handleSave = () => {
    setIsAutoSlippageStore(isAutoSlippage);

    if (isAutoSlippage) {
      setMaxSlippage(0.0);
      setSlippage('0.0');
    } else {
      setMaxSlippage(parseFloat(slippage) / 100);
    }
    handleClose();
  };

  const { formatMessage } = useIntl();

  const slippageError = useMemo(() => {
    if (parseFloat(slippage) > 100) {
      return formatMessage({
        id: 'slippage.is.above.one.hundred.percent',
        defaultMessage: 'Slippage is above 100%',
      });
    } else if (parseFloat(slippage) < 0) {
      return formatMessage({
        id: 'slippage.is.below.zero',
        defaultMessage: 'Slippage is below zero',
      });
    }
  }, [slippage]);

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage id="swap.settings" defaultMessage="Swap Settings" />
        }
        onClose={handleClose}
      />
      <DialogContent dividers>
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={isAutoSlippage}
                onChange={handleToggleAutoSlippage}
              />
            }
            label={
              <FormattedMessage
                id="auto.slippage"
                defaultMessage="Auto Slippage"
              />
            }
          />
          {!isAutoSlippage && (
            <TextField
              value={slippage}
              onChange={handleChangeSlippage}
              type="number"
              fullWidth
              error={Boolean(slippageError)}
              helperText={slippageError}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" color="primary">
          <FormattedMessage id="save" defaultMessage="Save" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(SwapSettingsDialog);
