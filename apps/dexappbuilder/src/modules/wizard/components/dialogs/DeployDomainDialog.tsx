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

function DeployDomainDialog({
  dialogProps,
  isLoading,
  isSuccess,
  error,
  isEdit,
}: Props) {
  const { onClose } = dialogProps;

  const router = useRouter();

  const [showDetails, setShowDetails] = useState(false);

  const handleGoToMarketplaces = () => {
    return router.replace('/admin');
  };

  const handleClose = () => {
    if (isSuccess) {
      return handleGoToMarketplaces();
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
            id="deploying.domain"
            defaultMessage="Deploying domain"
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
            <Typography align="center" variant="h5">
              {error !== undefined && !isLoading && !isSuccess ? (
                <FormattedMessage
                  id="oops.something.went.wrong"
                  defaultMessage="Oops, something went wrong"
                />
              ) : isSuccess ? (
                <FormattedMessage
                  id="sent.successfully"
                  defaultMessage="Sent successfully"
                />
              ) : (
                <FormattedMessage
                  id="deploying.domain"
                  defaultMessage="Deploying domain"
                />
              )}
            </Typography>
            <Typography align="center" variant="body1" color="textSecondary">
              {error !== undefined && !isLoading && !isSuccess ? (
                <FormattedMessage
                  id="please.try.again.later"
                  defaultMessage="Please, try again later"
                />
              ) : isSuccess ? (
                <FormattedMessage
                  id="your.app.domain.was.added.to.our.system"
                  defaultMessage="Your app domain was added to our system. Please add CNAME to your DNS provider and after that check domain status often till propagate"
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
            <Button onClick={handleGoToMarketplaces} variant="contained">
              <FormattedMessage id="view.apps" defaultMessage="View Apps" />
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

export default DeployDomainDialog;
