import {
    Box,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import {
    getBlockExplorerUrl,
    getNetworkSlugFromChainId,
    isAddressEqual,
    truncateAddress,
} from '@dexkit/core/utils/blockchain';
import { getWindowUrl } from '@dexkit/core/utils/browser';
import Link from '@dexkit/ui/components/AppLink';
import Heart from '@dexkit/ui/components/icons/Heart';
import ShareDialog from '@dexkit/ui/modules/nft/components/dialogs/ShareDialog';
import {
    useAsset,
    useAssetMetadata,
    useFavoriteAssets,
} from '@dexkit/ui/modules/nft/hooks';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import LaunchIcon from '@mui/icons-material/Launch';
import Share from '@mui/icons-material/Share';
import { useState } from 'react';

interface Props {
  address: string;
  id: string;
  nonce?: string;
}

export function OrderPageActions({ address, id, nonce }: Props) {
  const { data: asset } = useAsset(address, id);
  const { data: metadata } = useAssetMetadata(asset);

  const { account } = useWeb3React();

  const favorites = useFavoriteAssets();

  const handleToggleFavorite = () => {
    if (asset !== undefined) {
      favorites.toggleFavorite({ ...asset, metadata });
    }
  };

  const [openShare, setOpenShare] = useState(false);

  const handleCloseShareDialog = () => setOpenShare(false);

  const handleOpenShareDialog = () => setOpenShare(true);

  return (
    <>
      <ShareDialog
        dialogProps={{
          open: openShare,
          fullWidth: true,
          maxWidth: 'sm',
          onClose: handleCloseShareDialog,
        }}
        url={`${getWindowUrl()}/order/${getNetworkSlugFromChainId(
          asset?.chainId,
        )}/${nonce}`}
      />
      <Box>
        <Grid container spacing={2} alignItems="stretch" alignContent="center">
          <Grid item xs>
            <Paper variant="outlined" sx={{ p: 1, height: '100%' }}>
              <Typography variant="caption" color="textSecondary">
                <FormattedMessage id="owned.by" defaultMessage="Owned by" />
              </Typography>
              <Link
                href={`${getBlockExplorerUrl(
                  asset?.chainId,
                )}/address/${asset?.owner}`}
                color="primary"
                target="_blank"
              >
                <Stack
                  component="span"
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                  spacing={0.5}
                >
                  <div>
                    {isAddressEqual(account, asset?.owner) ? (
                      <FormattedMessage id="you" defaultMessage="you" />
                    ) : (
                      truncateAddress(asset?.owner)
                    )}
                  </div>
                  <LaunchIcon fontSize="inherit" />
                </Stack>
              </Link>
            </Paper>
          </Grid>
          <Grid item>
            <Paper variant="outlined" sx={{ p: 1, height: '100%' }}>
              <Stack
                direction="row"
                sx={{ height: '100%' }}
                divider={<Divider flexItem orientation="vertical" />}
                alignItems="center"
                spacing={2}
              >
                <Tooltip
                  title={
                    <FormattedMessage id="favorite" defaultMessage="Favorite" />
                  }
                >
                  <IconButton onClick={handleToggleFavorite}>
                    <Heart
                      sx={
                        favorites.isFavorite(asset)
                          ? (theme) => ({
                              '& path': {
                                fill: theme.palette.error.light,
                              },
                            })
                          : undefined
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton onClick={handleOpenShareDialog}>
                    <Share />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
