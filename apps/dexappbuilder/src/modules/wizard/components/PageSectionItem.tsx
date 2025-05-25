import { getChainName } from '@dexkit/core/utils/blockchain';
import {
  useAssetByApi,
  useCollectionByApi,
} from '@dexkit/ui/modules/nft/hooks';
import { truncateErc1155TokenId } from '@dexkit/ui/modules/nft/utils';
import { SectionItem } from '@dexkit/ui/modules/wizard/types/config';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface Props {
  item: SectionItem;
  index: number;
  length?: number;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  onSwap?: (direction: 'up' | 'down', index: number) => void;
}

export function PageSectionItem({
  item,
  onEdit,
  index,
  onRemove,
  onSwap,
  length,
}: Props) {
  const { data: asset, isLoading: isAssetLoading } = useAssetByApi(
    item.type === 'asset'
      ? {
          chainId: item.chainId,
          contractAddress: item.contractAddress,
          tokenId: item.tokenId,
        }
      : {},
  );

  const { data: collection, isLoading: isCollectionLoading } =
    useCollectionByApi(
      item.type === 'collection'
        ? {
            chainId: item.chainId,
            contractAddress: item.contractAddress,
          }
        : {},
    );
  const renderCollection = () => {
    return (
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        alignContent="center"
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1">
            {isCollectionLoading ? <Skeleton /> : collection?.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {isCollectionLoading ? <Skeleton /> : collection?.symbol}
          </Typography>
        </Box>
        <Box>
          {isCollectionLoading ? (
            <Skeleton />
          ) : (
            <Chip size="small" label={getChainName(collection?.chainId)} />
          )}
        </Box>
      </Stack>
    );
  };

  const renderAsset = () => {
    return (
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        alignContent="center"
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="primary">
            {isAssetLoading ? <Skeleton /> : asset?.collectionName}
          </Typography>
          <Typography variant="body1">
            {' '}
            {isAssetLoading ? (
              <Skeleton />
            ) : (
              `#${truncateErc1155TokenId(asset?.id)}`
            )}{' '}
          </Typography>
          {item.title && (
            <Typography variant="body1">
              {' '}
              {isAssetLoading ? <Skeleton /> : item?.title || ''}{' '}
            </Typography>
          )}
        </Box>
        <Box>
          {isAssetLoading ? (
            <Skeleton />
          ) : (
            <Chip size="small" label={getChainName(asset?.chainId)} />
          )}
        </Box>
      </Stack>
    );
  };

  return (
    <Card>
      <CardContent>
        {item.type === 'asset'
          ? renderAsset()
          : item.type === 'collection'
          ? renderCollection()
          : null}
      </CardContent>
      <CardActions>
        <Button onClick={() => onEdit(index)} startIcon={<Edit />} size="small">
          <FormattedMessage id="edit" defaultMessage="Edit" />
        </Button>
        <Button
          onClick={() => onRemove(index)}
          startIcon={<Delete />}
          size="small"
        >
          <FormattedMessage id="remove" defaultMessage="Remove" />
        </Button>

        {onSwap && length && length > 1 && (
          <>
            <Button
              onClick={() => onSwap('up', index)}
              disabled={index === 0}
              startIcon={<KeyboardArrowUpIcon />}
            >
              <FormattedMessage id="up" defaultMessage="Up" />
            </Button>
            <Button
              onClick={() => onSwap('down', index)}
              disabled={index === length - 1}
              startIcon={<KeyboardArrowDownIcon />}
            >
              <FormattedMessage id="down" defaultMessage="Down" />
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
}
