import Link from '@/modules/common/components/Link';
import { getChainLogoImage, getNormalizedUrl } from '@/modules/common/utils';
import { MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { DkApiAsset } from '../types/dexkitapi';

interface Props {
  nft?: DkApiAsset;
  onSelect: (nft?: DkApiAsset, anchorEl?: HTMLElement | null) => void;
}

export default function NftCard({ nft, onSelect }: Props) {
  return (
    <Card
      sx={{
        position: 'relative',
        '& .MuiAvatar-root': { display: 'none' },
        '&:hover .MuiAvatar-root': { display: 'block' },
      }}
    >
      <CardActionArea
        sx={{
          height: '100%',
          width: '100%',
        }}
        LinkComponent={Link}
        href={`/kittygotchi/${nft?.tokenId}`}
      >
        <CardMedia
          sx={{
            height: 'auto',
            width: '100%',
            position: 'relative',
            aspectRatio: '1/1',
            overflow: 'hidden',
            '& img': {
              transition: 'transform .5s ease',
              objectFit: 'cover',
              height: '100%',
              width: '100%',
              position: 'absolute',

              top: 0,
              left: 0,
              right: 0,
            },
            '&:hover img': { transform: 'scale(1.2)' },
          }}
        >
          {nft?.imageUrl ? (
            <img src={getNormalizedUrl(nft?.imageUrl)} />
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
        </CardMedia>
      </CardActionArea>
      <CardContent>
        <Typography
          color="text.secondary"
          component="div"
          variant="caption"
          sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
        >
          {nft?.collectionName}
        </Typography>
        <Typography variant="body2">#{nft?.tokenId}</Typography>
      </CardContent>
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, p: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            {nft?.chainId && (
              <Avatar
                src={getChainLogoImage(nft?.chainId)}
                sx={(theme) => ({
                  height: theme.spacing(4),
                  width: theme.spacing(4),
                })}
              />
            )}
          </Box>

          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.action.hover,
              borderRadius: '50%',
              boxShadow: (theme) => theme.shadows[0],
            }}
          >
            <IconButton
              color="inherit"
              size="small"
              onClick={(e) => onSelect(nft, e.currentTarget)}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}
