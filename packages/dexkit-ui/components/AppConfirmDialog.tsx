import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from "@mui/material";

import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "./AppDialogTitle";

interface Props {
  DialogProps: DialogProps;
  onConfirm: () => void;
  title?: React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode | React.ReactNode[];
  children?: React.ReactNode | React.ReactNode[];
  isConfirming?: boolean;
  actionCaption?: React.ReactNode;
  cancelCaption?: React.ReactNode;
}

export default function AppConfirmDialog({
  DialogProps,
  onConfirm,
  children,
  title,
  icon,
  isConfirming,
  actionCaption,
  cancelCaption,
}: Props) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog {...DialogProps} onClose={handleClose}>
      <AppDialogTitle
        icon={icon}
        title={
          title ? (
            title
          ) : (
            <FormattedMessage id="confirm" defaultMessage="Confirm" />
          )
        }
        onClose={handleClose}
        titleBox={{ px: 2 }}
      />
      <DialogContent dividers sx={{ p: 4 }}>
        <>{children}</>
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 2 }}>
        <Button disabled={isConfirming} onClick={handleClose}>
          {cancelCaption ? (
            cancelCaption
          ) : (
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          )}
        </Button>
        <Button
          startIcon={
            isConfirming && <CircularProgress color="inherit" size="1rem" />
          }
          disabled={isConfirming}
          color="primary"
          variant="contained"
          onClick={onConfirm}
        >
          {isConfirming ? (
            <FormattedMessage id="confirming" defaultMessage="Confirming" />
          ) : actionCaption ? (
            actionCaption
          ) : (
            <FormattedMessage id="confirm" defaultMessage="Confirm" />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
