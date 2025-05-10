import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Typography,
} from '@mui/material';

import { FormattedMessage } from 'react-intl';

interface Props {
  dialogProps: DialogProps;
  section: AppPageSection;
  onConfirm: () => void;
}

export default function ConfirmRemoveSectionDialog({
  dialogProps,
  section,
  onConfirm,
}: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="delete.section.section"
            defaultMessage="Delete Section: {section}"
            values={{
              section: (
                <Typography variant="inherit" component="span" fontWeight="400">
                  {section?.name || section?.title}
                </Typography>
              ),
            }}
          />
        }
        onClose={handleClose}
        titleBox={{ px: 2 }}
      />
      <DialogContent dividers sx={{ p: 4 }}>
        <FormattedMessage
          id="are.you.sure.you.want.to.delete.this.section"
          defaultMessage="Are you sure you want to delete this section?"
        />
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 2 }}>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button color="primary" variant="contained" onClick={onConfirm}>
          <FormattedMessage id="delete" defaultMessage="Delete" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
