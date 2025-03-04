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

interface Props {
  dialogProps: DialogProps;
  data?: { slug: string };
  isLoading: boolean;
  isSuccess: boolean;
  error: any;
  isEdit?: boolean;
}

function SendAddMemberDialog({
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
            <FormattedMessage
              id="member.permission"
              defaultMessage="Member permissions"
            />
          ) : isSuccess ? (
            <FormattedMessage id="member.added" defaultMessage="Member added" />
          ) : (
            <FormattedMessage
              id="adding.member"
              defaultMessage="Adding member"
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
                    id="member.permissions.updated"
                    defaultMessage="Member permissions updated"
                  />
                ) : (
                  <FormattedMessage
                    id="member.added"
                    defaultMessage="Member added"
                  />
                )
              ) : isEdit ? (
                <FormattedMessage
                  id="updating.member.permissions"
                  defaultMessage="Updating member permissions"
                />
              ) : (
                <FormattedMessage
                  id="adding.member"
                  defaultMessage="Adding Member"
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

export default SendAddMemberDialog;
