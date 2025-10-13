import { ChainId } from '@/modules/common/constants/enums';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { GameGraph } from '../types';
import GameCard from './GameCard';

interface Props {
  games: GameGraph[];
  onShare: (game: GameGraph) => void;
  onShowMetadata: (game: GameGraph) => void;
  chainId?: ChainId;
  affiliate?: string;
}

export default function GamesGrid({
  games,
  affiliate,
  chainId,
  onShare,
  onShowMetadata,
}: Props) {
  return (
    <Box>
      <Grid container spacing={2}>
        {games.map((game, index) => (
          <Grid size={{ xs: 12, sm: 3 }} key={index}>
            <GameCard
              game={game}
              onShare={onShare}
              chainId={chainId}
              onShowMetadata={onShowMetadata}
              affiliate={affiliate}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}


