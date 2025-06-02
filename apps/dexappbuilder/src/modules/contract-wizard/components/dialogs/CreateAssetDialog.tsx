import {
  getBlockExplorerUrl,
  getNetworkSlugFromChainId,
} from '@dexkit/core/utils/blockchain';
import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import Link from '@dexkit/ui/components/AppLink';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
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

interface Props {
  dialogProps: DialogProps;
  isLoadingMeta?: boolean;
  isLazyMinting?: boolean;
  isDoneMeta?: boolean;
  isErrorMeta?: boolean;
  isLoading?: boolean;
  isDone?: boolean;
  isError?: boolean;
  transactionHash?: string;
  contractAddress?: string;
  chainId?: number;
  useContractURL: boolean;
  // if modal is on same page of the url we just close the modal
  modalOnSamePage?: boolean;
}

export default function CreateAssetDialog({
  dialogProps,
  isLazyMinting = false,
  isError,
  isErrorMeta,
  isLoading,
  isLoadingMeta,
  isDone,
  isDoneMeta,
  chainId,
  transactionHash,
  contractAddress,
  useContractURL,
  modalOnSamePage,
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
          <FormattedMessage id="creating.nfts" defaultMessage="Creating NFTs" />
        }
        disableClose={isDoneMeta && modalOnSamePage ? false : true}
        hideCloseButton={isDoneMeta && modalOnSamePage ? false : true}
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
            {isLazyMinting === false && (
              <Alert severity="info">
                <FormattedMessage
                  defaultMessage="Please don't close modal or reload app till finish data submission!"
                  id="info.create.nfts.dialog"
                />
              </Alert>
            )}
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
                          id="creating.nfts.check.wallet"
                          defaultMessage="Creating NFTs on chain. Check wallet and accept transaction!"
                        />
                      </Typography>
                    </Box>
                  )}
                  {isLoading && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="creating.nfts"
                          defaultMessage="Creating NFTs on chain"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="wait.transaction.to.complete"
                          defaultMessage="Confirm on wallet and wait transaction to complete"
                        />
                      </Typography>
                    </Box>
                  )}
                  {isDone && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="nfts.created"
                          defaultMessage="NFTs created"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="your.nfts.were.created.onchain"
                          defaultMessage="Your nfts were created onchain"
                        />
                      </Typography>
                    </Box>
                  )}
                  {isError && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="nfts.created.error"
                          defaultMessage="NFTs created error"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="your.nft.not.created.onchain"
                          defaultMessage="Your NFTs were not created onchain"
                        />
                      </Typography>
                    </Box>
                  )}
                </ListItemText>
              </ListItem>

              {isLazyMinting === false && (
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
                    {isErrorMeta && (
                      <ErrorIcon color="error" fontSize="large" />
                    )}
                  </ListItemAvatar>
                  <ListItemText>
                    {!(isLoadingMeta || isDoneMeta || isErrorMeta) && (
                      <Box>
                        <Typography align="center" variant="h5">
                          <FormattedMessage
                            id="save.nfts.metadata"
                            defaultMessage="Save NFTs metadata"
                          />
                        </Typography>
                      </Box>
                    )}

                    {isLoadingMeta && (
                      <Box>
                        <Typography align="center" variant="h5">
                          <FormattedMessage
                            id="creating.nfts"
                            defaultMessage="Saving NFTs metadata"
                          />
                        </Typography>
                      </Box>
                    )}
                    {isDoneMeta && (
                      <Box>
                        <Typography align="center" variant="h5">
                          <FormattedMessage
                            id="nfts.metadata.saved"
                            defaultMessage="NFTs metadata saved"
                          />
                        </Typography>
                        <Typography
                          align="center"
                          variant="body1"
                          color="textSecondary"
                        >
                          <FormattedMessage
                            id="your.nfts.was.created.successfully"
                            defaultMessage="Your nfts was created successfully"
                          />
                        </Typography>
                      </Box>
                    )}
                    {isErrorMeta && (
                      <Box>
                        <Typography align="center" variant="h5">
                          <FormattedMessage
                            id="nfts.metadata.error"
                            defaultMessage="NFTs metadata error"
                          />
                        </Typography>
                        <Typography
                          align="center"
                          variant="body1"
                          color="textSecondary"
                        >
                          <FormattedMessage
                            id="nfts.metadata.not.saved"
                            defaultMessage="Your nfts metadata were not saved"
                          />
                        </Typography>
                      </Box>
                    )}
                  </ListItemText>
                </ListItem>
              )}
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
            {isDoneMeta &&
              (modalOnSamePage ? (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleClose}
                >
                  <FormattedMessage
                    id="nfts.created.close.modal"
                    defaultMessage="NFT created! Close modal"
                  />
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  LinkComponent={Link}
                  href={
                    useContractURL
                      ? `/contract/${getNetworkSlugFromChainId(
                          chainId,
                        )}/${contractAddress}`
                      : `/contract-wizard/collection/${getNetworkSlugFromChainId(
                          chainId,
                        )}/${contractAddress}`
                  }
                >
                  <FormattedMessage id="view.nfts" defaultMessage="View nfts" />
                </Button>
              ))}
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
