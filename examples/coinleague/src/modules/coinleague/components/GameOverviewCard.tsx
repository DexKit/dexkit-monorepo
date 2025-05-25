import { strPad } from '@/modules/common/utils/strings';
import { PlayArrow } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { BigNumber, ethers } from 'ethers';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { GAME_STARTED, GAME_WAITING } from '../constants';
import { GameType } from '../constants/enums';
import {
  useCoinLeagueGameOnChainQuery,
  useCoinToPlay,
} from '../hooks/coinleague';
import { getGameStatus, GET_GAME_LEVEL } from '../utils/game';
import { GET_LABEL_FROM_DURATION } from '../utils/time';
import GameCountdown from './GameCountdown';
import GameCounterSpan from './GameCounterSpan';

interface Props {
  chainId?: number;
  provider?: ethers.providers.Web3Provider;
  id: string;
  factoryAddress: string;
  onJoin: () => void;
  onStart: () => void;
  onRefetch: () => void;
  isStarting?: boolean;
  isInGame?: boolean;
  isJoining?: boolean;
  canJoinGame?: boolean;
  canStart?: boolean;
}

export function GameOverviewCard({
  chainId,
  id,
  provider,
  factoryAddress,
  onJoin,
  onStart,
  onRefetch,
  isStarting,
  isInGame,
  canJoinGame,
  canStart,
  isJoining,
}: Props) {
  const { data: game, isLoading } = useCoinLeagueGameOnChainQuery({
    id,
    provider,
    factoryAddress,
  });

  const coinToPlay = useCoinToPlay(chainId, game?.coin_to_play);

  const prizeTotalValue = useMemo(() => {
    if (game && coinToPlay) {
      return ethers.utils.formatUnits(
        BigNumber.from(game?.amount_to_play).mul(
          BigNumber.from(game.num_players)
        ),
        coinToPlay.decimals
      );
    }

    return '';
  }, [game, coinToPlay]);

  const [coins, duration, players, maxPlayers, entry] = useMemo(() => {
    if (!game) {
      return [0, 0, 0, 0, 0];
    }

    const players = strPad(Number(game?.players.length) || 0);
    const maxPlayers = strPad(Number(game?.num_players) || 0);

    const entry = ethers.utils.formatUnits(
      BigNumber.from(game?.amount_to_play),
      coinToPlay?.decimals
    );

    return [
      Number(game.num_coins),
      Number(game.duration),
      players,
      maxPlayers,
      entry,
    ];
  }, [game, coinToPlay]);

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { sm: 'row', xs: 'column' },
            alignItems: { sm: 'center' },
            alignContent: 'center',
          }}
        >
          <Box>
            <Grid
              spacing={1}
              container
              alignItems="center"
              alignContent="center"
            >
              <Grid item>
                <Typography variant="caption" color="textSecondary">
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <FormattedMessage id="id" defaultMessage="ID" />
                  )}
                </Typography>
                <Typography variant="body2">
                  {isLoading ? <Skeleton /> : game?.id}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="textSecondary">
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <FormattedMessage
                      id="game.level"
                      defaultMessage="Game Level"
                    />
                  )}
                </Typography>
                <Typography variant="body2">
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    GET_GAME_LEVEL(
                      BigNumber.from(game?.amount_to_play),
                      chainId,
                      game?.coin_to_play
                    )
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="textSecondary">
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <FormattedMessage id="duration" defaultMessage="Duration" />
                  )}
                </Typography>
                <Typography variant="body2">
                  {isLoading ? <Skeleton /> : GET_LABEL_FROM_DURATION(duration)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="textSecondary">
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <FormattedMessage id="entry" defaultMessage="Entry" />
                  )}
                </Typography>
                <Typography variant="body2">
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <>
                      {entry} {coinToPlay?.symbol}
                    </>
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="textSecondary">
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <FormattedMessage id="type" defaultMessage="Type" />
                  )}
                </Typography>
                <Typography variant="body2">
                  {isLoading ? (
                    <Skeleton />
                  ) : game?.game_type === GameType.Bull - 1 ? (
                    <FormattedMessage id="bull" defaultMessage="Bull" />
                  ) : (
                    <FormattedMessage id="bear" defaultMessage="Bear" />
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="textSecondary">
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <FormattedMessage id="coins" defaultMessage="Coins" />
                  )}
                </Typography>
                <Typography variant="body2">
                  {isLoading ? <Skeleton /> : strPad(coins)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="textSecondary">
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <FormattedMessage id="players" defaultMessage="Players" />
                  )}
                </Typography>
                <Typography variant="body2">
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <>
                      {players}/{maxPlayers}
                    </>
                  )}
                </Typography>
              </Grid>

              <Grid item>
                <Typography variant="caption" color="textSecondary">
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <FormattedMessage id="prize" defaultMessage="Prize" />
                  )}
                </Typography>
                <Typography variant="body2">
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <>
                      {prizeTotalValue} {coinToPlay?.symbol}
                    </>
                  )}
                </Typography>
              </Grid>
              {game && getGameStatus(game) === GAME_WAITING && (
                <Grid item>
                  <Typography variant="caption" color="textSecondary">
                    {isLoading ? (
                      <Skeleton />
                    ) : (
                      <FormattedMessage
                        id="starts.at"
                        defaultMessage="Starts at"
                      />
                    )}
                  </Typography>
                  <Typography variant="body2">
                    <GameCounterSpan startsAt={game.start_timestamp} />
                  </Typography>
                </Grid>
              )}
              {game && getGameStatus(game) === GAME_STARTED && (
                <Grid item>
                  <Typography variant="caption" color="textSecondary">
                    <FormattedMessage id="Ends in" defaultMessage="Ends in" />
                  </Typography>
                  <Typography variant="body2">
                    <GameCountdown
                      duration={game.duration}
                      startTimestamp={game.start_timestamp}
                      onEnd={onRefetch}
                    />
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
          {!isInGame && canJoinGame && (
            <Box sx={{ mt: { xs: 2, sm: 0 } }}>
              <Button
                fullWidth
                disabled={isJoining}
                onClick={onJoin}
                startIcon={
                  isJoining ? (
                    <CircularProgress color="inherit" size="1rem" />
                  ) : undefined
                }
                variant="contained"
                color="primary"
                sx={{ marginTop: 0 }}
              >
                <FormattedMessage id="join.game" defaultMessage="Join Game" />
              </Button>
            </Box>
          )}
          {isInGame && canStart && (
            <Box sx={{ mt: { xs: 2, sm: 0 } }}>
              <Button
                fullWidth
                disabled={isStarting}
                onClick={onStart}
                startIcon={
                  isJoining ? (
                    <CircularProgress color="inherit" size="1rem" />
                  ) : (
                    <PlayArrow />
                  )
                }
                variant="contained"
                color="primary"
                sx={{ marginTop: 0 }}
              >
                <FormattedMessage id="join.game" defaultMessage="Start Game" />
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
}
