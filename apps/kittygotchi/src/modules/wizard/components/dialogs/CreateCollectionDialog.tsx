import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';
import Link from '@/modules/common/components/Link';
import { getBlockExplorerUrl } from '@/modules/common/utils';
import { Image, Info } from '@mui/icons-material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircle from '@mui/icons-material/CheckCircle';
import GavelIcon from '@mui/icons-material/Gavel';
import {
  Avatar,
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
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface Props {
  dialogProps: DialogProps;
  isUploadingImages?: boolean;
  isUploadingMetadata?: boolean;
  isCreatingCollection?: boolean;
  isCreatingItems?: boolean;

  isUploadingImagesDone?: boolean;
  isUploadingMetadataDone?: boolean;
  isCreatingCollectionDone?: boolean;
  isCreatingItemsDone?: boolean;

  deployHash?: string;
  itemsHash?: string;
  contractAddress?: string;

  canMintItems?: boolean;

  chainId?: number;
  onCreateCollection: () => void;
  onCreateItems: () => void;
  onReset: () => void;
}

export default function CreateCollectionDialog({
  dialogProps,
  isUploadingImages,
  isUploadingMetadata,
  isCreatingCollection,
  isCreatingItems,

  isUploadingImagesDone,
  isUploadingMetadataDone,
  isCreatingCollectionDone,
  isCreatingItemsDone,
  onCreateItems,
  onCreateCollection,
  onReset,
  deployHash,
  itemsHash,
  contractAddress,
  chainId,
  canMintItems,
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
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <Stack spacing={2}>
          <List disablePadding>
            <ListItem divider>
              <ListItemAvatar>
                <Avatar>
                  {isUploadingImages ? (
                    <CircularProgress size="2rem" color="primary" />
                  ) : (
                    <Image color="action" />
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <FormattedMessage
                    id="upload.images"
                    defaultMessage="Upload images"
                  />
                }
              />
              <ListItemSecondaryAction>
                {isUploadingImagesDone && <CheckCircle />}
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem divider>
              <ListItemAvatar>
                <Avatar>
                  {isUploadingMetadata ? (
                    <CircularProgress size="2rem" color="primary" />
                  ) : (
                    <Info color="action" />
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <FormattedMessage
                    id="send.metadata"
                    defaultMessage="Send metadata"
                  />
                }
              />
              <ListItemSecondaryAction>
                {isUploadingMetadataDone && <CheckCircle />}
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem divider>
              <ListItemAvatar>
                {isCreatingCollection ? (
                  <CircularProgress size="2rem" color="primary" />
                ) : (
                  <Avatar>
                    <AssignmentIcon color="action" />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <FormattedMessage
                    id="create.collection"
                    defaultMessage="Create collection"
                  />
                }
              />
              <ListItemSecondaryAction>
                {deployHash ? (
                  <Button
                    size="small"
                    LinkComponent={Link}
                    href={`${getBlockExplorerUrl(chainId)}/tx/${deployHash}`}
                    target="_blank"
                  >
                    <FormattedMessage
                      id="view.transaction"
                      defaultMessage="View Transaction"
                    />
                  </Button>
                ) : isCreatingCollectionDone ? (
                  <CheckCircle />
                ) : (
                  <Button
                    disabled={
                      isCreatingCollection ||
                      (canMintItems && !isUploadingMetadataDone)
                    }
                    onClick={onCreateCollection}
                    size="small"
                    variant="outlined"
                  >
                    <FormattedMessage id="create" defaultMessage="Create" />
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
            {canMintItems && (
              <ListItem divider>
                <ListItemAvatar>
                  {isCreatingItems ? (
                    <CircularProgress size="2rem" color="primary" />
                  ) : (
                    <Avatar>
                      <GavelIcon color="action" />
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <FormattedMessage
                      id="create.items"
                      defaultMessage="Create items"
                    />
                  }
                />
                <ListItemSecondaryAction>
                  {itemsHash ? (
                    <Button
                      size="small"
                      target="_blank"
                      LinkComponent={Link}
                      href={`${getBlockExplorerUrl(chainId)}/tx/${itemsHash}`}
                    >
                      <FormattedMessage
                        id="view.transaction"
                        defaultMessage="View Transaction"
                      />
                    </Button>
                  ) : isCreatingItemsDone ? (
                    <CheckCircle />
                  ) : (
                    <Button
                      disabled={isCreatingItems || !isCreatingCollectionDone}
                      onClick={onCreateItems}
                      size="small"
                      variant="outlined"
                    >
                      <FormattedMessage id="create" defaultMessage="Create" />
                    </Button>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            )}
          </List>
          {contractAddress && (
            <Box p={2}>
              <Stack
                spacing={2}
                justifyContent="center"
                alignItems="center"
                alignContent="center"
              >
                <CheckCircle color="success" fontSize="large" />
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
                      id="Your collection was created successfully"
                      defaultMessage="Your collection was created successfully"
                    />
                  </Typography>
                </Box>
                <Stack alignItems="center" alignContent="center" spacing={1}>
                  <Button
                    color="primary"
                    variant="contained"
                    LinkComponent={Link}
                    href={`/wizard/collection/${contractAddress}`}
                    target="_blank"
                  >
                    <FormattedMessage
                      id="view.collection"
                      defaultMessage="View Collection"
                    />
                  </Button>
                  <Button onClick={onReset} color="primary" variant="outlined">
                    <FormattedMessage
                      id="create.new"
                      defaultMessage="Create new"
                    />
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
