import { Token } from "@dexkit/core/types";
import { AppDialogTitle } from "@dexkit/ui/components";
import Warning from "@mui/icons-material/Warning";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

export interface ExternTokenWarningDialogProps {
  DialogProps: DialogProps;
  onConfirm: () => void;
  token: Token;
}

export default function ExternTokenWarningDialog({
  DialogProps,
  onConfirm,
  token,
}: ExternTokenWarningDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="import.token" defaultMessage="Import token" />
        }
        onClose={handleClose}
      />
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="center">
            <Warning fontSize="large" />
          </Stack>
          <Box>
            <Typography textAlign="center" variant="h5">
              <FormattedMessage id="warning" defaultMessage="Warning" />
            </Typography>
            <Typography
              textAlign="center"
              variant="body1"
              color="text.secondary"
            >
              <FormattedMessage
                id="app.token.warning"
                defaultMessage="The token you're importing is not on the current list. Please use it with caution."
              />
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions {...({ onClick: handleClose } as any)} sx={{ px: 4, py: 1 }}>
        <Button>
          <FormattedMessage id="cancel" defaultMessage="cancel" />
        </Button>
        <Button onClick={onConfirm} variant="contained">
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
