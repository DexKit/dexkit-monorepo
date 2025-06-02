import { getNetworkSlugFromChainId } from '@dexkit/core/utils/blockchain';
import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import Link from '@dexkit/ui/components/AppLink';
import { AssetAPI } from '@dexkit/ui/modules/nft/types';
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
  isLoading?: boolean;
  isDone?: boolean;
  isError?: boolean;
  asset?: AssetAPI;
}

export default function CreateWhitelabelDialog({
  dialogProps,
  isError,
  isLoading,
  isDone,
  asset,
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
          <FormattedMessage id="creating.nft" defaultMessage="Creating NFT" />
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
                id="info.create.nfts.dialog"
              />
            </Alert>
            <List disablePadding>
              <ListItem divider>
                <ListItemAvatar>
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
                          id="creating.nft.on.server"
                          defaultMessage="Creating NFT on chain and saving metadata."
                        />
                      </Typography>
                    </Box>
                  )}
                  {isLoading && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="creating.nft.on.server"
                          defaultMessage="Creating NFT on chain and saving metadata"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="wait.nft.creation.by.dexkit"
                          defaultMessage="Wait for NFT creation by DexKit"
                        />
                      </Typography>
                    </Box>
                  )}
                  {isDone && (
                    <Box>
                      <Typography align="center" variant="h5">
                        <FormattedMessage
                          id="nft.created"
                          defaultMessage="NFT created"
                        />
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        <FormattedMessage
                          id="your.nft.were.created"
                          defaultMessage="Your NFT were created"
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
                          id="your.nft.not.created"
                          defaultMessage="Your NFT were not created"
                        />
                      </Typography>
                    </Box>
                  )}
                </ListItemText>
              </ListItem>
            </List>
            {isDone && asset && (
              <Button
                color="primary"
                variant="contained"
                LinkComponent={Link}
                href={`/asset/${getNetworkSlugFromChainId(
                  asset?.chainId as any,
                )}/${asset.address}/${asset.tokenId}`}
              >
                <FormattedMessage id="view.nft" defaultMessage="View NFT" />
              </Button>
            )}
            {(isError || isDone) && (
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
