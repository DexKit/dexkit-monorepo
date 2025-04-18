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
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Error from '@mui/icons-material/Error';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/router';

interface Props {
  dialogProps: DialogProps;
  isLoading: boolean;
  isSuccess: boolean;
  username?: string;
  error: any;
  isEdit?: boolean;
}

function UpsertUserDialog({
  dialogProps,
  isLoading,
  isSuccess,
  error,
  username,
  isEdit,
}: Props) {
  const { onClose } = dialogProps;

  const router = useRouter();

  const [showDetails, setShowDetails] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    if (!isEdit && username) {
      router.push(`/u/${username}`);
    }
  };

  const handleToggleDetails = () => {
    setShowDetails((value) => !value);
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="sending.user.profile.data"
            defaultMessage="Sending user profile data"
          />
        }
        disableClose={isSuccess && !isEdit}
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
                  id="sent.successfully"
                  defaultMessage="Sent successfully"
                />
              ) : isEdit ? (
                <FormattedMessage
                  id="updating.user.profile"
                  defaultMessage="Updating user profile"
                />
              ) : (
                <FormattedMessage
                  id="creating.user.profile"
                  defaultMessage="Creating user profile"
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
                isEdit ? (
                  <FormattedMessage
                    id="your.user.profile.was.updated"
                    defaultMessage="Your user profile was updated"
                  />
                ) : (
                  <FormattedMessage
                    id="your.user.profile.was.created"
                    defaultMessage="Your user profile was created"
                  />
                )
              ) : (
                <FormattedMessage
                  id="please.sign.the.settings.with.your.wallet"
                  defaultMessage="Please, sign the settings with your wallet"
                />
              )}
            </Typography>
          </Box>
          {isSuccess && !isEdit && (
            <Button
              variant="contained"
              onClick={() => router.push(`/u/${username}`)}
            >
              <FormattedMessage
                id="view.user.profile"
                defaultMessage="View user profile"
              />
            </Button>
          )}

          {error !== null && (
            <>
              <Button onClick={handleToggleDetails}>
                <FormattedMessage id="details" defaultMessage="Details" />{' '}
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

export default UpsertUserDialog;
