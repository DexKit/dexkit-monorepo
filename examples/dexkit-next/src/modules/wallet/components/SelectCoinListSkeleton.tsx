import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from '@mui/material';
import { memo } from 'react';

function SelectCoinListSkeleton() {
  const renderItems = () => {
    return new Array(4).fill(null).map((_, index: number) => {
      return (
        <ListItem key={index}>
          <ListItemAvatar>
            <Skeleton
              variant="circular"
              sx={(theme) => ({
                width: theme.spacing(6),
                height: theme.spacing(6),
              })}
            />
          </ListItemAvatar>
          <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
        </ListItem>
      );
    });
  };
  return <List>{renderItems()}</List>;
}

export default memo(SelectCoinListSkeleton);
