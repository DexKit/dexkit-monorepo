import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Link from '../../../components/Link';
import { Asset, AssetMetadata, OrderBookItem } from '../../../types/nft';
import {
  getChainLogoImage,
  getChainName,
  getNetworkSlugFromChainId,
} from '../../../utils/blockchain';
import { truncateErc1155TokenId } from '../../../utils/nfts';
import { AssetBuyOrder } from './AssetBuyOrder';
import { AssetMedia } from './AssetMedia';
const AssetDetailsDialog = dynamic(
  () => import('./dialogs/AssetDetailsDialog'),
);
interface Props {
  asset?: Asset;
  assetMetadata?: AssetMetadata;
  onFavorite?: (asset: Asset) => void;
  isFavorite?: boolean;
  showAssetDetailsInDialog?: boolean;
  onHide?: (asset: Asset) => void;
  isHidden?: boolean;
  showControls?: boolean;
  lazyLoadMetadata?: boolean;
  disabled?: boolean;
  orderBookItem?: OrderBookItem;
  onTransfer?: (asset: Asset) => void;
  onClickCardAction?: (asset: Asset | undefined) => void;
}

export function BaseAssetCard({
  asset,
  onFavorite,
  isFavorite,
  showControls,
  isHidden,
  onHide,
  disabled,
  assetMetadata,
  orderBookItem,
  onTransfer,
  onClickCardAction,
  showAssetDetailsInDialog,
}: Props) {
  const metadata = assetMetadata || asset?.metadata;
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [assetName] = useMemo(() => {
    if (metadata) {
      return [metadata.name, metadata.image];
    } else if (asset?.metadata) {
      return [`${asset?.collectionName} #${asset?.id}`, asset?.metadata.image];
    }

    return [];
  }, [metadata, asset]);

  const assetDetails = (
    <>
      {' '}
      {asset ? (
        <AssetMedia asset={asset} />
      ) : (
        <Box
          sx={{
            position: 'relative',
            overflow: ' hidden',
            paddingTop: '80%',
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              position: 'absolute',
              display: 'block',
              width: '100%',
              height: '100%',
            }}
          />
        </Box>
      )}
      <CardContent>
        <Typography variant="caption">
          {asset === undefined ? <Skeleton /> : asset?.collectionName}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {asset === undefined ? (
            <Skeleton />
          ) : assetName ? (
            assetName
          ) : (
            `${asset?.collectionName} #${truncateErc1155TokenId(asset?.id)}`
          )}
        </Typography>
      </CardContent>
    </>
  );

  return (
    <Card sx={{ position: 'relative', heigh: '100%', borderRadius: '12px' }}>
      {onClickCardAction ? (
        <CardActionArea onClick={() => onClickCardAction(asset)}>
          {assetDetails}
        </CardActionArea>
      ) : showAssetDetailsInDialog ? (
        <>
          {openDetailsDialog && (
            <AssetDetailsDialog
              dialogProps={{
                open: openDetailsDialog,
                onClose: () => setOpenDetailsDialog(false),
                fullWidth: true,
              }}
              asset={asset}
            />
          )}
          <CardActionArea onClick={() => setOpenDetailsDialog(true)}>
            {assetDetails}
          </CardActionArea>
        </>
      ) : (
        <CardActionArea
          LinkComponent={Link}
          disabled={disabled}
          href={`/asset/${getNetworkSlugFromChainId(
            asset?.chainId,
          )}/${asset?.contractAddress}/${asset?.id}`}
        >
          {assetDetails}
        </CardActionArea>
      )}
      {showControls && (
        <IconButton
          aria-controls={open ? 'asset-menu-action' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={(theme) => ({
            top: theme.spacing(1),
            right: theme.spacing(2),
            position: 'absolute',
            backgroundColor: theme.palette.common.white,
            boxShadow: theme.shadows[1],
          })}
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
      )}

      {asset?.chainId && (
        <Tooltip title={getChainName(asset.chainId) || ''}>
          <Avatar
            src={getChainLogoImage(asset.chainId)}
            sx={(theme) => ({
              top: theme.spacing(2),
              left: theme.spacing(2),
              position: 'absolute',
              width: 'auto',
              height: theme.spacing(3),
            })}
            alt={getChainName(asset.chainId) || ''}
          />
        </Tooltip>
      )}

      <Menu
        id="asset-menu-action"
        aria-labelledby="asset-menu-action"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {isHidden !== undefined && onHide && asset && (
          <MenuItem
            onClick={() => {
              onHide(asset);
              handleClose();
            }}
          >
            {isHidden ? (
              <Stack spacing={2} direction={'row'}>
                <VisibilityIcon />
                <Typography>
                  <FormattedMessage id="unhide" defaultMessage={'Unhide'} />
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={2} direction={'row'}>
                <VisibilityOffIcon />
                <Typography>
                  <FormattedMessage id="hide" defaultMessage={'Hide'} />
                </Typography>
              </Stack>
            )}
          </MenuItem>
        )}
        {onTransfer !== undefined && asset && (
          <MenuItem
            onClick={() => {
              onTransfer(asset);
              handleClose();
            }}
          >
            <Stack spacing={2} direction={'row'}>
              <SendIcon />
              <Typography>
                <FormattedMessage
                  id="transfer.nft"
                  defaultMessage={'Transfer NFT'}
                />
              </Typography>
            </Stack>
          </MenuItem>
        )}
      </Menu>
      {orderBookItem && (
        <CardActions disableSpacing>
          <AssetBuyOrder orderBookItem={orderBookItem} asset={asset} />
        </CardActions>
      )}

      {/*onFavorite && isFavorite && asset && (
        <IconButton
          sx={(theme) => ({
            top: theme.spacing(1),
            right: theme.spacing(2),
            position: 'absolute',
          })}
          onClick={() => onFavorite(asset)}
        >
          <Heart
            sx={
              isFavorite
                ? (theme) => ({
                    '& path': { fill: theme.palette.error.light },
                  })
                : undefined
            }
          />
        </IconButton>
          )*/}
    </Card>
  );
}
