import CheckCircle from "@mui/icons-material/CheckCircle";
import Error from "@mui/icons-material/Error";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Stack,
} from "@mui/material";

import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../AppDialogTitle";

interface Props {
  dialogProps: DialogProps;
  isLoading: boolean;
  loadingBlock?: React.ReactNode | React.ReactNode[];
  isError: boolean;
  errorBlock?: React.ReactNode | React.ReactNode[];
  isSuccess?: boolean;
  successBlock?: React.ReactNode | React.ReactNode[];
  title?: React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode | React.ReactNode[];
}

export default function AppMutationDialog({
  dialogProps,
  isLoading,
  loadingBlock,
  isError,
  errorBlock,
  isSuccess,
  successBlock,
  title,
  icon,
}: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
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
      />
      <DialogContent dividers>
        <Box p={2}>
          <Stack
            spacing={2}
            justifyContent="center"
            alignItems="center"
            alignContent="center"
          >
            {isLoading && <CircularProgress color="primary" size="2rem" />}
            {isSuccess && <CheckCircle color="success" sx={{ fontSize: 60 }} />}
            {isError && <Error color="error" fontSize="large" />}
            {isLoading && loadingBlock && <>{loadingBlock}</>}
            {isError && errorBlock && <>{errorBlock}</>}
            {isSuccess && successBlock && <>{successBlock}</>}
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
