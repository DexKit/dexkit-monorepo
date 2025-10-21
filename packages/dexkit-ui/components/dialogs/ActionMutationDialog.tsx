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
  title?: React.ReactNode;
  successText?: React.ReactNode;
  errorText?: React.ReactNode;
  loadingText?: React.ReactNode;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: any;
}
/**
 * Generic dialog to use with mutation
 * @param param0
 * @returns
 */
function ActionMutationDialog({
  dialogProps,
  title,
  successText,
  errorText,
  loadingText,
  isLoading,
  isSuccess,
  isError,
  error,
}: Props) {
  const { onClose } = dialogProps;

  const [showDetails, setShowDetails] = useState(false);

  const handleGoToMarketplaces = () => {};

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const handleToggleDetails = () => {
    setShowDetails((value: boolean) => !value);
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          title ? (
            title
          ) : (
            <FormattedMessage
              id="sending.request"
              defaultMessage="Sending request"
            />
          )
        }
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
          {isLoading && <CircularProgress size="4rem" color="primary" />}{" "}
          {isSuccess && <CheckCircle fontSize="large" color="success" />}
          {isError && <Error fontSize="large" color="error" />}
          <Box>
            <Typography align="center" variant="h6">
              {isError &&
                (errorText ? (
                  errorText
                ) : (
                  <FormattedMessage
                    id="oops.something.went.wrong"
                    defaultMessage="Oops, something went wrong"
                  />
                ))}

              {isSuccess &&
                (successText ? (
                  successText
                ) : (
                  <FormattedMessage
                    id="request.sent.successfully"
                    defaultMessage="Request sent successfully"
                  />
                ))}

              {isLoading &&
                (loadingText ? (
                  loadingText
                ) : (
                  <FormattedMessage
                    id="sending.request"
                    defaultMessage="Sending request"
                  />
                ))}
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
              ) : (
                isSuccess && (
                  <FormattedMessage
                    id="your.request.was.sent.successfully"
                    defaultMessage="Your request was sent successfully"
                  />
                )
              )}
            </Typography>
          </Box>
          {false && (
            <Button onClick={handleGoToMarketplaces} variant="contained">
              <FormattedMessage
                id="view.marketplace"
                defaultMessage="View Marketplace"
              />
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

export default ActionMutationDialog;
