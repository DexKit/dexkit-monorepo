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

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/router';

interface Props {
  dialogProps: DialogProps;
  isLoading: boolean;
  isSuccess: boolean;
  error: any;
  isEdit?: boolean;
}

function UpsertPageTemplateDialog({
  dialogProps,
  isLoading,
  isSuccess,
  error,
  isEdit,
}: Props) {
  const { onClose } = dialogProps;

  const router = useRouter();

  const [showDetails, setShowDetails] = useState(false);

  const handleGoTo = () => {
    return router.replace('/admin/page-template');
  };

  const handleClose = () => {
    if (isSuccess && !isEdit) {
      return handleGoTo();
    }

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
          <FormattedMessage
            id="sending.page.template.data"
            defaultMessage="Sending page template data"
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
              ) : (
                <FormattedMessage
                  id="sending.page.template.settings"
                  defaultMessage="Sending page template settings"
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
                  id="your.marketplace.settings.was.sent.successfully"
                  defaultMessage="Your config was sent successfully"
                />
              ) : (
                <FormattedMessage
                  id="please.sign.the.settings.with.your.wallet"
                  defaultMessage="Please, sign the settings with your wallet"
                />
              )}
            </Typography>
          </Box>
          {isSuccess && !isEdit && (
            <Button onClick={handleGoTo} variant="contained">
              <FormattedMessage
                id="view.page.templates"
                defaultMessage="View page templates"
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

export default UpsertPageTemplateDialog;
