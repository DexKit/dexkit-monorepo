import { Game } from '@/modules/coinleague/types';
import { Button, Typography } from '@mui/material';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useGameEnd } from '../hooks/useGameEnd';
import { useGameStart } from '../hooks/useGameStart';
import GameCountdown from './GameCountdown';
import GameCounterSpan from './GameCounterSpan';

interface Props {
  game: Game;
}

export default function GameActionsButton({ game }: Props) {
  const endGame = useGameEnd({ game });
  const startGame = useGameStart({ game });

  const canEnd = useMemo(() => {
    if (game) {
      const date = new Date().getTime() / 1000;

      return (
        game?.started &&
        !game?.finished &&
        date > Number(game.start_timestamp) + Number(game.duration)
      );
    }
  }, [game]);

  const needPlayers = useMemo(() => {
    if (game) {
      const date = new Date().getTime() / 1000;

      return (
        !game?.started &&
        date > Number(game?.start_timestamp) &&
        Number(game.players.length) < 2
      );
    }
  }, [game]);

  const canStart = useMemo(() => {
    if (game) {
      const date = new Date().getTime() / 1000;

      return (
        !game.started &&
        date > Number(game.start_timestamp) &&
        Number(game.players.length) > 1
      );
    }
  }, [game]);

  const aboutToStart = useMemo(() => {
    if (game) {
      const date = new Date().getTime() / 1000;

      return !game.started && date < Number(game.start_timestamp);
    }
  }, [game]);

  const isLoading =
    startGame.startGameMutation.isLoading || endGame.endGameMutation.isLoading;

  return (
    <Button
      color="primary"
      variant="contained"
      onClick={() =>
        canStart
          ? startGame.startGameMutation.mutateAsync()
          : canEnd
            ? endGame.endGameMutation.mutateAsync()
            : {}
      }
      sx={{
        fontWeight: 600,
      }}
      disabled={game?.finished || isLoading || needPlayers || aboutToStart}
    >
      <Typography>
        {canStart ? (
          <FormattedMessage id="start.game" defaultMessage="Start game" />
        ) : canEnd ? (
          <FormattedMessage id="end.game" defaultMessage="End game" />
        ) : game?.finished ? (
          <FormattedMessage id="ended" defaultMessage="Ended" />
        ) : aboutToStart ? (
          <GameCounterSpan startsAt={Number(game.start_timestamp)} />
        ) : needPlayers ? (
          <FormattedMessage id="need.players" defaultMessage="Need players" />
        ) : (
          <>
            <FormattedMessage id="game.started" defaultMessage="Game started" />{' '}
            :{' '}
            <GameCountdown
              duration={Number(game?.duration)}
              startTimestamp={Number(game?.start_timestamp)}
            />
          </>
        )}
      </Typography>
    </Button>
  );
}
