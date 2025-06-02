import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { AssetAPI } from '@dexkit/ui/modules/nft/types';
import CheckCircle from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Box,
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
  isEdit?: boolean;
  isError?: boolean;
  asset?: AssetAPI;
}

export default function CreateSiteMetadataDialog({
  dialogProps,
  isError,
  isLoading,
  isDone,
  isEdit,
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
          isEdit ? (
            <FormattedMessage
              id="editing.site.metadata"
              defaultMessage="Editing site metadata"
            />
          ) : (
            <FormattedMessage
              id="creating.site.metadata"
              defaultMessage="Creating site metadata"
            />
          )
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
                        {isEdit ? (
                          <FormattedMessage
                            id="editing.site.metadata"
                            defaultMessage="Editing site metadata"
                          />
                        ) : (
                          <FormattedMessage
                            id="creating.site.metadata"
                            defaultMessage="Creating site metadata"
                          />
                        )}
                      </Typography>
                    </Box>
                  )}
                  {isLoading && (
                    <Box>
                      <Typography align="center" variant="h5">
                        {isEdit ? (
                          <FormattedMessage
                            id="editing.site.metadata"
                            defaultMessage="Editing site metadata"
                          />
                        ) : (
                          <FormattedMessage
                            id="creating.site.metadata"
                            defaultMessage="Creating site metadata"
                          />
                        )}
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        {isEdit ? (
                          <FormattedMessage
                            id="editing.site.metadata"
                            defaultMessage="Editing site metadata"
                          />
                        ) : (
                          <FormattedMessage
                            id="creating.site.metadata"
                            defaultMessage="Creating site metadata"
                          />
                        )}
                      </Typography>
                    </Box>
                  )}
                  {isDone && (
                    <Box>
                      <Typography align="center" variant="h5">
                        {isEdit ? (
                          <FormattedMessage
                            id="site.metadata.edited"
                            defaultMessage="Site metadata edited"
                          />
                        ) : (
                          <FormattedMessage
                            id="site.metadata.created"
                            defaultMessage="Site metadata created"
                          />
                        )}
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        {isEdit ? (
                          <FormattedMessage
                            id="your.site.metadata.was.edited"
                            defaultMessage="Your site metadata was edited"
                          />
                        ) : (
                          <FormattedMessage
                            id="your.site.metadata.was.created"
                            defaultMessage="Your site metadata was created"
                          />
                        )}
                      </Typography>
                    </Box>
                  )}
                  {isError && (
                    <Box>
                      <Typography align="center" variant="h5">
                        {isEdit ? (
                          <FormattedMessage
                            id="site.metadata.edited.error"
                            defaultMessage="Site metadata edited error"
                          />
                        ) : (
                          <FormattedMessage
                            id="site.metadata.created.error"
                            defaultMessage="Site metadata created error"
                          />
                        )}
                      </Typography>
                      <Typography
                        align="center"
                        variant="body1"
                        color="textSecondary"
                      >
                        {isEdit ? (
                          <FormattedMessage
                            id="your.site.metadata.was.not.edited"
                            defaultMessage="Your site metadata was not edited"
                          />
                        ) : (
                          <FormattedMessage
                            id="your.site.metadata.was.not.created"
                            defaultMessage="Your site metadata was not created"
                          />
                        )}
                      </Typography>
                    </Box>
                  )}
                </ListItemText>
              </ListItem>
            </List>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
