import {
  Box,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Share } from "@mui/icons-material";
import LaunchIcon from "@mui/icons-material/Launch";
import { useState } from "react";
import Link from "../../../components/AppLink";
import Heart from "../../../components/icons/Heart";
import { useAsset, useAssetMetadata, useFavoriteAssets } from "../../nft/hooks";

import {
  NETWORK_EXPLORER,
  NETWORK_SLUG,
} from "@dexkit/core/constants/networks";
import { isAddressEqual, truncateAddress } from "@dexkit/core/utils";
import { getWindowUrl } from "@dexkit/core/utils/browser";
import ShareDialog from "../../../components/dialogs/ShareDialog";

interface Props {
  address: string;
  id: string;
  nonce?: string;
}

export function OrderPageActions({ address, id, nonce }: Props) {
  const theme = useTheme();
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
          maxWidth: "sm",
          onClose: handleCloseShareDialog,
        }}
        url={`${getWindowUrl()}/order/${NETWORK_SLUG(asset?.chainId)}/${nonce}`}
      />
      <Box>
        <Grid container spacing={2} alignItems="stretch" alignContent="center">
          <Grid size="grow">
            <Paper variant="outlined" sx={{ p: 1, height: "100%" }}>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}
              >
                <FormattedMessage id="owned.by" defaultMessage="Owned by" />
              </Typography>
              <Link
                href={`${NETWORK_EXPLORER(
                  asset?.chainId
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
                  sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}
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
          <Grid>
            <Paper variant="outlined" sx={{ p: 1, height: "100%" }}>
              <Stack
                direction="row"
                sx={{ height: "100%" }}
                divider={<Divider flexItem orientation="vertical" />}
                alignItems="center"
                spacing={2}
              >
                <Tooltip
                  title={
                    <FormattedMessage id="favorite" defaultMessage="Favorite" />
                  }
                >
                  <IconButton 
                    onClick={handleToggleFavorite}
                    sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}
                  >
                    <Heart
                      sx={
                        favorites.isFavorite(asset)
                          ? (theme) => ({
                            "& path": {
                              fill: theme.palette.error.light,
                            },
                          })
                          : {
                            "& path": {
                              fill: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit'
                            }
                          }
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton 
                    onClick={handleOpenShareDialog}
                    sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}
                  >
                    <Share sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }} />
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
