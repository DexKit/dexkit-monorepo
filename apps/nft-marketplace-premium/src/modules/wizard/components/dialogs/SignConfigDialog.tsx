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

import {
  CheckCircle,
  Error,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { AppDialogTitle } from '../../../../components/AppDialogTitle';

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
            <FormattedMessage id="config.sent" defaultMessage="Config sent" />
          ) : (
            <FormattedMessage
              id="sending.config"
              defaultMessage="Sending config"
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
          ) : error !== null ? (
            <Error fontSize="large" color="error" />
          ) : null}
          <Box>
            <Typography align="center" variant="h6">
              {error !== null && !isLoading && !isSuccess ? (
                <>
                  <FormattedMessage
                    id="oops.something.went.wrong"
                    defaultMessage="Oops, something went wrong"
                  />
                </>
              ) : isSuccess ? (
                <FormattedMessage
                  id="sent.successfully.be.aware.info"
                  defaultMessage="Sent successfully. Be aware that it takes several minutes to update and reflect on the live site."
                />
              ) : (
                <FormattedMessage
                  id="sending.app.settings"
                  defaultMessage="Sending app settings"
                />
              )}
            </Typography>
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
