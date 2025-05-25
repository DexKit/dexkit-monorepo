import { AppDialogTitle } from '@dexkit/ui';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

export interface PriceTableDialogProps {
  DialogProps: DialogProps;
}

export default function PriceTableDialog({
  DialogProps,
}: PriceTableDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...DialogProps} maxWidth="xl" fullWidth fullScreen>
      <AppDialogTitle
        title={
          <FormattedMessage id="price.table" defaultMessage="Price table" />
        }
        onClose={handleClose}
      />
      <DialogContent sx={{ p: 0 }} dividers></DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button variant="contained">
          <FormattedMessage id="add" defaultMessage="Add" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
