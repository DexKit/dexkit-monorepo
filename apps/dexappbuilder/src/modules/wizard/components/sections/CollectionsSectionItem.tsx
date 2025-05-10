import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { NETWORK_SLUG } from '@dexkit/core/constants/networks';
import { getChainName } from '@dexkit/core/utils/blockchain';
import Img from '@dexkit/ui/components/AppImage';
import { AppCollection } from '@dexkit/ui/modules/wizard/types/config';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface Props {
  appUrl?: string;
  collection: AppCollection;
  onRemove: (collection: AppCollection) => void;
  onEdit: (collection: AppCollection) => void;
  onPreview: (collection: AppCollection) => void;
  disabled?: boolean;
}

export default function CollectionsSectionItem({
  appUrl,
  collection,
  onRemove,
  onEdit,
  onPreview,
  disabled,
}: Props) {
  return (
    <Card>
      <Box sx={{ p: 2, m: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box
              sx={{
                position: 'relative',
                paddingBottom: '75.00%',
              }}
            >
              <Img
                src={collection.backgroundImage}
                sx={{
                  objectFit: 'cover',
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  borderRadius: (theme) => theme.spacing(0.5),
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Stack spacing={1} alignItems="flex-start">
              <Box>
                <Typography variant="h5">{collection.name}</Typography>
                <Typography
                  gutterBottom
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {collection.description}
                </Typography>
                <Chip size="small" label={getChainName(collection.chainId)} />
              </Box>
              <Stack
                sx={{ display: { xs: 'none', sm: 'flex' } }}
                direction="row"
                alignItems="center"
                alignContent="center"
                spacing={1}
              >
                <Button
                  size="small"
                  startIcon={<Edit color="inherit" />}
                  disabled={disabled}
                  onClick={() => onEdit(collection)}
                >
                  <FormattedMessage id="edit" defaultMessage="Edit" />
                </Button>
                <Button
                  size="small"
                  startIcon={<Delete color="inherit" />}
                  disabled={disabled}
                  onClick={() => onRemove(collection)}
                >
                  <FormattedMessage id="remove" defaultMessage="Remove" />
                </Button>
                <Button
                  size="small"
                  startIcon={<VisibilityIcon color="inherit" />}
                  disabled={disabled}
                  onClick={() => onPreview(collection)}
                >
                  <FormattedMessage id="preview" defaultMessage="Preview" />
                </Button>
                {appUrl && (
                  <Button
                    size="small"
                    startIcon={<OpenInNewIcon color="inherit" />}
                    disabled={disabled}
                    target="_blank"
                    href={`${appUrl}/collection/${NETWORK_SLUG(
                      collection.chainId,
                    )}/${collection.contractAddress}`}
                  >
                    <FormattedMessage
                      id="preview.url"
                      defaultMessage="Preview url"
                    />
                  </Button>
                )}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack
              sx={{ display: { xs: 'flex', sm: 'none' } }}
              direction="row"
              alignItems="center"
              alignContent="center"
              justifyContent="center"
              spacing={1}
            >
              <Button
                size="small"
                startIcon={<Edit color="inherit" />}
                disabled={disabled}
                onClick={() => onEdit(collection)}
              >
                <FormattedMessage id="edit" defaultMessage="Edit" />
              </Button>
              <Button
                size="small"
                startIcon={<Delete color="inherit" />}
                disabled={disabled}
                onClick={() => onRemove(collection)}
              >
                <FormattedMessage id="remove" defaultMessage="Remove" />
              </Button>
              <Button
                size="small"
                startIcon={<VisibilityIcon color="inherit" />}
                disabled={disabled}
                onClick={() => onPreview(collection)}
              >
                <FormattedMessage id="preview" defaultMessage="Preview" />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}
