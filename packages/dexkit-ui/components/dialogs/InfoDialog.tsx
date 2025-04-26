import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

interface Props {
  dialogProps: DialogProps;
  title: string;
  content: string;
}

export default function InfoDialog(props: Props) {
  const { dialogProps, title, content } = props;
  const { onClose } = dialogProps;
  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog
      {...dialogProps}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <AppDialogTitle title={title} onClose={handleClose} />
      <DialogContent>
        <DialogContentText id="field-description">{content}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
