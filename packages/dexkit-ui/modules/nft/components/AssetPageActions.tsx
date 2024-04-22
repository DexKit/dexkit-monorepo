import {
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

import {
  getBlockExplorerUrl,
  getNetworkSlugFromChainId,
  isAddressEqual,
  truncateAddress,
} from "@dexkit/core/utils/blockchain";
import Link from "@dexkit/ui/components/AppLink";
import { useWeb3React } from "@dexkit/ui/hooks/thirdweb";
import LaunchIcon from "@mui/icons-material/Launch";
import Share from "@mui/icons-material/Share";
import { useState } from "react";
import Heart from "../../../components/icons/Heart";
import {
  useAsset,
  useAssetBalance,
  useAssetMetadata,
  useFavoriteAssets,
} from "../hooks";

import { getWindowUrl } from "@dexkit/core/utils/browser";
import ShareDialog from "./dialogs/ShareDialog";

interface Props {
  address: string;
  id: string;
}

export function AssetPageActions({ address, id }: Props) {
  const { data: asset } = useAsset(address, id);
  const { data: metadata } = useAssetMetadata(asset);

  const { account } = useWeb3React();
  const { data: assetBalance } = useAssetBalance(asset, account);

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
        url={`${getWindowUrl()}/asset/${getNetworkSlugFromChainId(
          asset?.chainId
        )}/${address}/${id}`}
      />
      <Grid container spacing={2} alignItems="stretch" alignContent="center">
        <Grid item xs>
          {asset?.protocol === "ERC721" ? (
            <Paper variant="outlined" sx={{ p: 1, height: "100%" }}>
              <Typography variant="caption" color="textSecondary">
                <FormattedMessage id="owned.by" defaultMessage="Owned by" />
              </Typography>
              <Link
                href={`${getBlockExplorerUrl(
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
          ) : (
            account &&
            assetBalance?.balance && (
              <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                <Typography>
                  <FormattedMessage id="you.own" defaultMessage="You own" />:{" "}
                  {assetBalance?.balance?.toString() || ""}{" "}
                </Typography>
              </Paper>
            )
          )}
        </Grid>
        <Grid item>
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
                <IconButton onClick={handleToggleFavorite} disabled={!account}>
                  <Heart
                    sx={
                      favorites.isFavorite(asset)
                        ? (theme) => ({
                            "& path": { fill: theme.palette.error.light },
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
    </>
  );
}
