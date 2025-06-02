import { getNetworkSlugFromChainId } from '@dexkit/core/utils/blockchain';
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
  isDoneMeta?: boolean;
  isErrorMeta?: boolean;
  contractAddress?: string;
  chainId?: number;
}

export default function CreateAssetDialog({
  dialogProps,
  isErrorMeta,
  isLoadingMeta,
  isDoneMeta,
  chainId,
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
          <FormattedMessage id="editing.nft" defaultMessage="Editing NFT" />
        }
        disableClose={true}
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
                id="info.edit.nft.dialog"
              />
            </Alert>
            <List disablePadding>
              <ListItem divider>
                <ListItemAvatar>
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
                          id="edit.nft.metadata"
                          defaultMessage="Edit NFT metadata"
                        />
                      </Typography>
                    </Box>
                  )}

                  {isLoadingMeta && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="editing.nft"
                          defaultMessage="Editing NFT metadata"
                        />
                      </Typography>
                    </Box>
                  )}
                  {isDoneMeta && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="nfts.metadata.edited"
                          defaultMessage="NFTs metadata edited"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="your.nfts.was.edited.successfully"
                          defaultMessage="Your nfts was edited successfully"
                        />
                      </Typography>
                    </Box>
                  )}
                  {isErrorMeta && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="nft.metadata.error"
                          defaultMessage="NFT metadata error"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="nft.metadata.not.saved"
                          defaultMessage="Your nft metadata was not saved"
                        />
                      </Typography>
                    </Box>
                  )}
                </ListItemText>
              </ListItem>
            </List>

            {isDoneMeta && (
              <Button
                color="primary"
                variant="contained"
                LinkComponent={Link}
                href={`/contract-wizard/collection/${getNetworkSlugFromChainId(
                  chainId,
                )}/${contractAddress}`}
              >
                <FormattedMessage id="view.nfts" defaultMessage="View nfts" />
              </Button>
            )}
            {isErrorMeta && (
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
