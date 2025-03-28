import {
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
} from '@mui/material';

interface RankingButtonProps {}

export default function RankingListItemSkeleton({}: RankingButtonProps) {
  return (
    <ListItemButton>
      <ListItemAvatar>
        <Skeleton
          variant="circular"
          sx={{ width: '1.5rem', height: '1.5rem' }}
        />
      </ListItemAvatar>
      <ListItemText primary={<Skeleton />} />
    </ListItemButton>
  );
}
