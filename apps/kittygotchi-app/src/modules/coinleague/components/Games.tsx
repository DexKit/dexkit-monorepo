import TableSkeleton from '@/modules/common/components/skeletons/TableSkeleton';
import { ChainId } from '@/modules/common/constants/enums';
import { Box, Stack, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCoinLeagueGames } from '../hooks/coinleague';
import { GameFiltersState, GameGraph } from '../types';
import GamesGrid from './GamesGrid';
import GamesGridSkeleton from './GamesGridSkeleton';
import GamesTable from './GamesTable';

interface Props {
  account?: string;
  chainId?: ChainId;
  filters: GameFiltersState;
  status: string;
  showTable: boolean;
  onShare: (game: GameGraph) => void;
}

export default function Games({
  account,
  chainId,
  filters,
  status,
  showTable,
  onShare,
}: Props) {
  const [selectedGame, setSelectedGame] = useState<GameGraph>();
  const [showMetadata, setShowMetadata] = useState(false);

  const gamesQuery = useCoinLeagueGames({
    status: status,
    accounts: account ? [account] : undefined,
    filters: filters,
  });

  const gameChainId = useMemo(() => {
    return chainId ? chainId : ChainId.Polygon;
  }, [chainId]);

  const handleShowMetadata = useCallback((game: GameGraph) => {
    setSelectedGame(game);
    setShowMetadata(true);
  }, []);

  return (
    <Box>
      {gamesQuery.isLoading &&
        (showTable ? (
          <TableSkeleton cols={4} rows={4} />
        ) : (
          <GamesGridSkeleton />
        ))}
      {gamesQuery.data && gamesQuery.data.length > 0 ? (
        showTable ? (
          <GamesTable
            chainId={gameChainId}
            games={gamesQuery.data}
            onShare={onShare}
            onShowMetadata={handleShowMetadata}
          />
        ) : (
          <GamesGrid
            chainId={gameChainId}
            games={gamesQuery.data}
            onShare={onShare}
            onShowMetadata={handleShowMetadata}
          />
        )
      ) : (
        <Box sx={{ py: 4 }}>
          <Stack>
            <Box>
              <Typography align="center" variant="h5">
                <FormattedMessage id="no.games" defaultMessage="No games" />
              </Typography>
              <Typography align="center" variant="body1" color="textSecondary">
                <FormattedMessage
                  id="no.games.available"
                  defaultMessage="No games available"
                />
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
