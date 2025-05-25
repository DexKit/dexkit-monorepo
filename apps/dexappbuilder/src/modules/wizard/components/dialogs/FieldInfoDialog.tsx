import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { FormattedMessage } from 'react-intl';
import { HELP_FIELD_TEXT } from '../../constants';

interface Props {
  dialogProps: DialogProps;
  field: string;
}

export default function FieldInfoDialog(props: Props) {
  const { dialogProps, field } = props;
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
      <DialogContent>
        <DialogContentText id="field-description">
          <FormattedMessage
            id={`wizard.field.${field}`}
            defaultMessage={HELP_FIELD_TEXT[field as 'name'] || ''}
            values={{ br: <br /> }}
          />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
