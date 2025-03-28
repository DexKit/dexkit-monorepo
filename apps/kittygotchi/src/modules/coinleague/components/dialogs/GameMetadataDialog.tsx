import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';
import CrownIcon from '@/modules/common/components/icons/Crown';
import { truncateAddress } from '@/modules/common/utils';
import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { GameGraph } from '../../types';
import { GET_CREATOR_LABELS } from '../../utils/game';

interface Props {
  dialogProps: DialogProps;

  game?: GameGraph;
}

export default function GameMetadataDialog({ dialogProps, game }: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        icon={<CrownIcon />}
        title={game?.title}
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5">{game?.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {game?.smallDescription}
            </Typography>
          </Box>
          <Typography variant="body1">{game?.description}</Typography>
          <Typography variant="body1">
            <FormattedMessage
              id="created.by.creator"
              defaultMessage="Created by: {creator}"
              values={{
                creator: GET_CREATOR_LABELS(game?.creator)
                  ? GET_CREATOR_LABELS(game?.creator)
                  : truncateAddress(game?.creator),
              }}
            />
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
