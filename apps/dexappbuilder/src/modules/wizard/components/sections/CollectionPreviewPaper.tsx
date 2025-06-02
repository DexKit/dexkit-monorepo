import CollectionFromApiCard from '@dexkit/ui/modules/nft/components/CollectionFromApi';
import { AppCollection } from '@dexkit/ui/modules/wizard/types/config';
import Close from '@mui/icons-material/Close';
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface Props {
  previewCollection: AppCollection;
  onClose: () => void;
}

export function CollectionPreviewPaper({ previewCollection, onClose }: Props) {
  return (
    <Paper>
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          alignContent="center"
          justifyContent="space-between"
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            <FormattedMessage
              id="collection.preview"
              defaultMessage="Collection preview"
            />
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </Box>
      <Divider />
      <Box>
        <CollectionFromApiCard
          totalSupply={0}
          contractAddress={previewCollection.contractAddress}
          chainId={previewCollection.chainId}
          title={previewCollection.name}
          backgroundImageUrl={previewCollection.backgroundImage}
          disabled={true}
        />
      </Box>
    </Paper>
  );
}
