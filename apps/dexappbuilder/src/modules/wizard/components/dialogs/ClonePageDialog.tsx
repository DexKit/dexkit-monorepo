import { AppDialogTitle } from '@dexkit/ui';
import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface CloneSectionDialogProps {
  DialogProps: DialogProps;
  page: AppPage;
  onConfirm: (name: string) => void;
}

export default function ClonePageDialog({
  DialogProps,
  page,
  onConfirm,
}: CloneSectionDialogProps) {
  const [name, setName] = useState<string>('');

  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }

    setName('');
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="clone.page.page"
            defaultMessage="Clone Page: {page}"
            values={{
              page: (
                <Typography variant="inherit" component="span" fontWeight={400}>
                  {page.title}
                </Typography>
              ),
            }}
          />
        }
        titleBox={{ px: 2 }}
        onClose={handleClose}
      />
      <DialogContent sx={{ p: 4 }} dividers>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          label={
            <FormattedMessage
              id="new.page.name"
              defaultMessage="New page name"
            />
          }
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 2 }}>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button onClick={() => onConfirm(name)} variant="contained">
          <FormattedMessage id="clone" defaultMessage="Clone" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
