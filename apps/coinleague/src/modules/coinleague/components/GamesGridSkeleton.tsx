import Grid from '@mui/material/Grid';
import { memo } from 'react';
import GameCardSkeleton from './GameCardSkeleton';

function GamesGridSkeleton() {
  return (
    <Grid container spacing={2}>
      {new Array(8).fill(null).map((_, index) => (
        <Grid key={index} size={{ xs: 12, sm: 3 }}>
          <GameCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

export default memo(GamesGridSkeleton);


