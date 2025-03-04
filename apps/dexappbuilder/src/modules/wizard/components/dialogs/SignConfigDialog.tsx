import {
  Alert,
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
  data?: { slug: string };
  isLoading: boolean;
  isSuccess: boolean;
  error: any;
  isEdit?: boolean;
}

function SignConfigDialog({
  dialogProps,
  isLoading,
  isSuccess,
  error,
  isEdit,
  data,
}: Props) {
  const { onClose } = dialogProps;

  const router = useRouter();

  const [showDetails, setShowDetails] = useState(false);

  const handleGoToMarketplaces = () => {
    if (data) {
      return router.replace(`/admin/edit/${data.slug}`);
    }
    return router.replace('/admin');
  };

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
      setShowDetails(false);
    }
  };

  const handleToggleDetails = () => {
    setShowDetails((value) => !value);
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          isSuccess ? (
            <FormattedMessage
              id="settings.sent"
              defaultMessage="Settings Sent"
            />
          ) : (
            <FormattedMessage
              id="sending.settings"
              defaultMessage="Sending Settings"
            />
          )
        }
        onClose={handleClose}
        titleBox={{ px: 2 }}
      />
      <Divider />
      <DialogContent sx={{ p: 4 }}>
        <Stack
          spacing={2}
          justifyContent="center"
          alignItems="center"
          alignContent="center"
        >
          {!error && isLoading ? (
            <CircularProgress size="4rem" color="primary" />
          ) : !error && isSuccess ? (
            <CheckCircle sx={{ fontSize: '4rem' }} color="success" />
          ) : error !== null ? (
            <Error sx={{ fontSize: '4rem' }} color="error" />
          ) : null}
          <Box>
            {isSuccess ? (
              <Stack spacing={2}>
                <Typography align="center" variant="body1">
                  <FormattedMessage
                    id="settings.successfully.sent"
                    defaultMessage="Settings successfully sent"
                  />
                </Typography>
                <Alert severity="warning">
                  <Typography fontWeight="bold">
                    <FormattedMessage
                      id="update.in.progress"
                      defaultMessage="Update in progress"
                    />
                  </Typography>
                  <Typography
                    fontWeight="400"
                    variant="caption"
                    component="div"
                  >
                    <FormattedMessage
                      id="Changes.to.the.app.may.take.a.few.minutes."
                      defaultMessage="Changes to the app may take a few minutes to update and appear live."
                    />
                  </Typography>
                </Alert>
              </Stack>
            ) : (
              <Typography align="center" variant="body1">
                {error !== null && !isLoading && !isSuccess ? (
                  <FormattedMessage
                    id="oops.something.went.wrong"
                    defaultMessage="Oops, something went wrong"
                  />
                ) : (
                  <FormattedMessage
                    id="sending.app.settings.to.the.server"
                    defaultMessage="Sending app settings to the server"
                  />
                )}
              </Typography>
            )}

            <Typography align="center" variant="body1" color="textSecondary">
              {error !== null &&
                !isLoading &&
                !isSuccess &&
                error?.response?.data?.message &&
                `Reason: ${error?.response?.data?.message}`}
            </Typography>
            {false && (
              <Typography align="center" variant="body1" color="textSecondary">
                {error && !isLoading && !isSuccess ? (
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
            )}
          </Box>
          {isSuccess && !isEdit && (
            <Button onClick={handleGoToMarketplaces} variant="contained">
              <FormattedMessage id="view.app" defaultMessage="View App" />
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

export default SignConfigDialog;
