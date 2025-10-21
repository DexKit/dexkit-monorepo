import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import {
  CheckCircle,
  Error,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { AppDialogTitle } from "../AppDialogTitle";

interface Props {
  dialogProps: DialogProps;
  isLoading: boolean;
  isSuccess: boolean;
  error: any;
}

function DeleteImageDialog({
  dialogProps,
  isLoading,
  isSuccess,
  error,
}: Props) {
  const { onClose } = dialogProps;

  const [showDetails, setShowDetails] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const handleSuccess = () => {
    handleClose();
  };

  const handleToggleDetails = () => {
    setShowDetails((value: boolean) => !value);
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose} sx={{ zIndex: 100000 }}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="deleting.image"
            defaultMessage="Deleting Image"
          />
        }
        disableClose={isSuccess}
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Stack
          spacing={2}
          justifyContent="center"
          alignItems="center"
          alignContent="center"
        >
          {!error && isLoading ? (
            <CircularProgress size="4rem" color="primary" />
          ) : !error && isSuccess ? (
            <CheckCircle fontSize="large" color="success" />
          ) : error !== undefined ? (
            <Error fontSize="large" color="error" />
          ) : null}
          <Box>
            <Typography align="center" variant="h6">
              {error !== undefined && !isLoading && !isSuccess ? (
                <>
                  <FormattedMessage
                    id="oops.something.went.wrong"
                    defaultMessage="Oops, something went wrong"
                  />
                </>
              ) : isSuccess ? (
                <FormattedMessage
                  id="image.deleted"
                  defaultMessage="Image deleted"
                />
              ) : (
                <FormattedMessage
                  id="deleting.image"
                  defaultMessage="Deleting image"
                />
              )}
            </Typography>
            <Typography align="center" variant="body1" color="textSecondary">
              {error !== undefined &&
                !isLoading &&
                !isSuccess &&
                error?.response?.data?.message &&
                `Reason: ${error?.response?.data?.message}`}
            </Typography>
            <Typography align="center" variant="body1" color="textSecondary">
              {error !== undefined && !isLoading && !isSuccess ? (
                <FormattedMessage
                  id="please.try.again.later"
                  defaultMessage="Please, try again later"
                />
              ) : isSuccess ? (
                <FormattedMessage
                  id="your.image.was.deleted.successfully"
                  defaultMessage="Your image was deleted successfully"
                />
              ) : (
                <FormattedMessage
                  id="please.login.with.your.wallet.to.delete.your.image"
                  defaultMessage="Please, login with your wallet to delete your image"
                />
              )}
            </Typography>
          </Box>
          {isSuccess && (
            <Button onClick={handleSuccess} variant="contained">
              <FormattedMessage id="close" defaultMessage="Close" />
            </Button>
          )}

          {error !== null && (
            <>
              <Button onClick={handleToggleDetails}>
                <FormattedMessage id="details" defaultMessage="Details" />{" "}
                {showDetails ? <ExpandLess /> : <ExpandMore />}
              </Button>
              <Collapse in={showDetails}>
                <Typography color="error">{String(error)}</Typography>
              </Collapse>
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
export default DeleteImageDialog;
