import CheckCircle from '@mui/icons-material/CheckCircle';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import {
  getBlockExplorerUrl,
  getNetworkSlugFromChainId,
} from '@dexkit/core/utils/blockchain';
import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import Link from '@dexkit/ui/components/AppLink';
import ErrorIcon from '@mui/icons-material/Error';

interface Props {
  dialogProps: DialogProps;
  isLoadingMeta?: boolean;
  isDoneMeta?: boolean;
  isErrorMeta?: boolean;
  isLoading?: boolean;
  isDone?: boolean;
  isError?: boolean;
  transactionHash?: string;
  contractAddress?: string;
  chainId?: number;
}

export default function CreateCollectionDialog({
  dialogProps,
  isError,
  isErrorMeta,
  isLoading,
  isLoadingMeta,
  isDone,
  isDoneMeta,
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
            id="creating.collection"
            defaultMessage="Creating collection"
          />
        }
        hideCloseButton={true}
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
            <Alert severity="info">
              <FormattedMessage
                defaultMessage="Please don't close modal or reload app till finish data submission!"
                id="info.create.collection.dialog"
              />
            </Alert>
            <List disablePadding>
              <ListItem divider>
                <ListItemAvatar>
                  {!(isLoading || isDone || isError) && (
                    <Box>
                      <Typography align="center" variant="h5">
                        1.
                      </Typography>
                    </Box>
                  )}
                  {isLoading && (
                    <CircularProgress color="primary" size="2rem" />
                  )}
                  {isDone && <CheckCircle color="success" fontSize="large" />}
                  {isError && <ErrorIcon color="error" fontSize="large" />}
                </ListItemAvatar>
                <ListItemText>
                  {!(isLoading || isDone || isError) && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="creating.collection.check.wallet"
                          defaultMessage="Creating collection on chain. Check wallet and accept transaction!"
                        />
                      </Typography>
                    </Box>
                  )}
                  {isLoading && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="creating.collection"
                          defaultMessage="Creating collection on chain"
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
                          id="collection.created"
                          defaultMessage="Collection created"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="your.collection.was.created.onchain"
                          defaultMessage="Your collection was created onchain"
                        />
                      </Typography>
                    </Box>
                  )}
                  {isError && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="collection.created.error"
                          defaultMessage="Collection created error"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="your.collection.not.created.onchain"
                          defaultMessage="Your collection was not created onchain"
                        />
                      </Typography>
                    </Box>
                  )}
                </ListItemText>
              </ListItem>

              <ListItem divider>
                <ListItemAvatar>
                  {!(isLoadingMeta || isDoneMeta || isErrorMeta) && (
                    <Box>
                      <Typography align="center" variant="h5">
                        2.
                      </Typography>
                    </Box>
                  )}
                  {isLoadingMeta && (
                    <CircularProgress color="primary" size="2rem" />
                  )}
                  {isDoneMeta && (
                    <CheckCircle color="success" fontSize="large" />
                  )}
                  {isErrorMeta && <ErrorIcon color="error" fontSize="large" />}
                </ListItemAvatar>
                <ListItemText>
                  {!(isLoadingMeta || isDoneMeta || isErrorMeta) && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="save.collection.metadata"
                          defaultMessage="Save collection metadata"
                        />
                      </Typography>
                    </Box>
                  )}

                  {isLoadingMeta && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="creating.collection"
                          defaultMessage="Saving collection metadata"
                        />
                      </Typography>
                    </Box>
                  )}
                  {isDoneMeta && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="collection.metadata.saved"
                          defaultMessage="Collection metadata saved"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="your.collection.was.created.successfully"
                          defaultMessage="Your collection was created successfully"
                        />
                      </Typography>
                    </Box>
                  )}
                  {isErrorMeta && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="collection.metadata.error"
                          defaultMessage="Collection metadata error"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="collection.metadata.not.saved"
                          defaultMessage="Your collection metadata was not saved"
                        />
                      </Typography>
                    </Box>
                  )}
                </ListItemText>
              </ListItem>
            </List>
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
                href={`/contract-wizard/collection/${getNetworkSlugFromChainId(
                  chainId,
                )}/${contractAddress.toLowerCase()}`}
              >
                <FormattedMessage
                  id="view.collection"
                  defaultMessage="View collection"
                />
              </Button>
            )}
            {(isErrorMeta || isError) && (
              <Button color="primary" variant="contained" onClick={handleClose}>
                <FormattedMessage
                  id="close.modal"
                  defaultMessage="Close modal"
                />
              </Button>
            )}
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
