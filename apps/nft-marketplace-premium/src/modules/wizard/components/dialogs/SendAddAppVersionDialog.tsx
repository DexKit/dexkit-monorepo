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

import CheckCircle from '@mui/icons-material/CheckCircle';

import Error from '@mui/icons-material/Error';

import ExpandLess from '@mui/icons-material/ExpandLess';

import ExpandMore from '@mui/icons-material/ExpandMore';
import { AppDialogTitle } from '../../../../components/AppDialogTitle';

interface Props {
  dialogProps: DialogProps;
  data?: { slug: string };
  isLoading: boolean;
  isSuccess: boolean;
  error: any;
  isEdit?: boolean;
}

function SendAddAppVersionDialog({
  dialogProps,
  isLoading,
  isSuccess,
  error,
  isEdit,
}: Props) {
  const { onClose } = dialogProps;

  const [showDetails, setShowDetails] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const handleToggleDetails = () => {
    setShowDetails((value) => !value);
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          isEdit ? (
            <FormattedMessage id="app.versions" defaultMessage="App versions" />
          ) : isSuccess ? (
            <FormattedMessage
              id="version.added"
              defaultMessage="Version added"
            />
          ) : (
            <FormattedMessage
              id="adding.version"
              defaultMessage="Adding version"
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
                isEdit ? (
                  <FormattedMessage
                    id="app.version.updated"
                    defaultMessage="App version updated"
                  />
                ) : (
                  <FormattedMessage
                    id="version.added"
                    defaultMessage="Version added"
                  />
                )
              ) : isEdit ? (
                <FormattedMessage
                  id="updating.app.versions"
                  defaultMessage="Updating app version"
                />
              ) : (
                <FormattedMessage
                  id="adding.app.version"
                  defaultMessage="Adding app version"
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
          </Box>
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

export default SendAddAppVersionDialog;
