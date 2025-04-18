import { getNormalizedUrl } from '@/modules/common/utils';
import { MoreVert } from '@mui/icons-material';
import { Box, IconButton, Skeleton, TableCell, TableRow } from '@mui/material';
import { DkApiAsset } from '../types/dexkitapi';

interface Props {
  nft?: DkApiAsset;
  onSelect: (nft?: DkApiAsset, anchorEl?: HTMLElement | null) => void;
}

export default function NftTableRow({ nft, onSelect }: Props) {
  return (
    <TableRow>
      <TableCell>
        <Box
          sx={(theme) => ({
            position: 'relative',
            height: theme.spacing(5),
            width: theme.spacing(5),
          })}
        >
          {nft?.imageUrl ? (
            <img
              src={getNormalizedUrl(nft?.imageUrl)}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
              }}
            />
          )}
        </Box>
      </TableCell>
      <TableCell>
        {nft?.collectionName} #{nft?.tokenId}
      </TableCell>
      <TableCell>
        <IconButton
          color="inherit"
          size="small"
          onClick={(e) => onSelect(nft, e.currentTarget)}
        >
          <MoreVert />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
