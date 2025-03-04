import { getBlockExplorerUrl } from '@dexkit/core/utils/blockchain';
import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import Link from '@dexkit/ui/components/AppLink';
import CheckCircle from '@mui/icons-material/CheckCircle';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface Props {
  dialogProps: DialogProps;
  isLoading?: boolean;
  isDone?: boolean;
  transactionHash?: string;
  contractAddress?: string;
  chainId?: number;
}

export default function CreateTokenDialog({
  dialogProps,
  isLoading,
  isDone,
  chainId,
  transactionHash,
  contractAddress,
}: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="creating.token"
            defaultMessage="Creating token"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <Box p={2}>
          <Stack
            spacing={2}
            justifyContent="center"
            alignItems="center"
            alignContent="center"
          >
            {isLoading && <CircularProgress color="primary" size="2rem" />}
            {isDone && <CheckCircle color="success" fontSize="large" />}
            {isLoading && (
              <Box>
                <Typography align="center" variant="h5">
                  <FormattedMessage
                    id="creating.token"
                    defaultMessage="Creating Token"
                  />
                </Typography>
                <Typography
                  align="center"
                  variant="body1"
                  color="textSecondary"
                >
                  <FormattedMessage
                    id="wait.transaction.to.complete"
                    defaultMessage="Wait transaction to complete"
                  />
                </Typography>
              </Box>
            )}
            {isDone && (
              <Box>
                <Typography align="center" variant="h5">
                  <FormattedMessage
                    id="token.created"
                    defaultMessage="Token created"
                  />
                </Typography>
                <Typography
                  align="center"
                  variant="body1"
                  color="textSecondary"
                >
                  <FormattedMessage
                    id="Your token was created successfully"
                    defaultMessage="Your token was created successfully"
                  />
                </Typography>
              </Box>
            )}
            {transactionHash && (
              <Button
                color="primary"
                variant="outlined"
                LinkComponent={Link}
                href={`${getBlockExplorerUrl(chainId)}/tx/${transactionHash}`}
                target="_blank"
              >
                <FormattedMessage
                  id="view.token"
                  defaultMessage="View transaction"
                />
              </Button>
            )}
            {contractAddress && (
              <Button
                color="primary"
                variant="contained"
                LinkComponent={Link}
                href={`/contract-wizard/token/${contractAddress}`}
                target="_blank"
              >
                <FormattedMessage id="view.token" defaultMessage="View token" />
              </Button>
            )}
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
