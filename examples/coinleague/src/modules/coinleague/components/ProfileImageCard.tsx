import React, { useCallback } from 'react';

import { getNormalizedUrl } from '@/modules/common/utils';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
} from '@mui/material';

interface Props {
  tokenId?: string;
  contractAddress?: string;
  name?: string;
  image?: string;
  selected?: boolean;
  onClick?: (params: {
    tokenId: string;
    contractAddress: string;
    image: string;
  }) => void;
}

export const ProfileImageCard: React.FC<Props> = ({
  image,
  name,
  contractAddress,
  tokenId,
  onClick,
  selected,
}) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      if (contractAddress && tokenId && image) {
        onClick({
          tokenId,
          contractAddress,
          image,
        });
      }
    }
  }, [onClick, tokenId, contractAddress, image]);

  return (
    <Card
      elevation={selected ? 12 : 0}
      variant={!selected ? 'outlined' : 'elevation'}
      sx={
        selected
          ? { backgroundColor: (theme) => theme.palette.action.hover }
          : undefined
      }
    >
      <CardActionArea disabled={!handleClick} onClick={handleClick}>
        {image ? (
          <CardMedia
            sx={{ height: 0, paddingTop: '56.25%' }}
            image={getNormalizedUrl(image)}
          />
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{ height: 0, paddingTop: '56.25%' }}
          />
        )}
        <CardContent>
          <Typography noWrap variant="subtitle2">
            {!name ? <Skeleton /> : name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProfileImageCard;
