import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../../../../components";

export interface ConfirmOpenContentDialogProps {
  DialogProps: DialogProps;
  onConfirm: () => void;
}

export default function ConfirmOpenContentDialog({
  DialogProps,
  onConfirm,
}: ConfirmOpenContentDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog maxWidth="sm" fullWidth {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="access.protected.content"
            defaultMessage="Access Protected Content"
          />
        }
        onClose={handleClose}
        sx={{ py: 2, px: 4 }}
      />
      <DialogContent sx={{ py: 2, px: 4 }} dividers>
        <Stack spacing={2}>
          <Alert severity="warning">
            <FormattedMessage
              id="protected.content.alert.text"
              defaultMessage="Protected content includes exclusive information provided by the seller for your access."
            />
          </Alert>
          <Typography variant="body1">
            <FormattedMessage
              defaultMessage="Are you sure you want to access it now?"
              id="Are.you.sure.you.want.to.access.it.now"
            />
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ py: 2, px: 4 }}>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button variant="contained" onClick={onConfirm}>
          <FormattedMessage id="access" defaultMessage="Access" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
