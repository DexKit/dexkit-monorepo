import { Check } from '@mui/icons-material';
import Close from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { AppDialogTitle } from '../AppDialogTitle';

interface Props {
  dialogProps: DialogProps;
  children: React.ReactNode | React.ReactNode[];
  title?: React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode | React.ReactNode[];
  onConfirm: () => void;
}

export default function AppConfirmDialog({
  dialogProps,
  children,
  icon,
  title,
  onConfirm,
}: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle title={title} icon={icon} onClose={handleClose} />
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button startIcon={<Check />} variant="contained" onClick={onConfirm}>
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button startIcon={<Close />} onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
