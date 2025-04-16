import { useCoinToPlay } from '@/modules/coinleague/hooks/coinleague';
import { GameGraph } from '@/modules/coinleague/types';
import ArrowDownSquare from '@/modules/common/components/icons/ArrowDownSquare';
import ArrowUpSquare from '@/modules/common/components/icons/ArrowUpSquare';
import Clock from '@/modules/common/components/icons/Clock';
import Coins from '@/modules/common/components/icons/Coins';
import CrownIcon from '@/modules/common/components/icons/Crown';
import Graph from '@/modules/common/components/icons/Graph';
import Persons from '@/modules/common/components/icons/Persons';
import Link from '@/modules/common/components/Link';
import { ChainId } from '@/modules/common/constants/enums';
import { getNetworkSlugFromChainId } from '@/modules/common/utils';
import { strPad } from '@/modules/common/utils/strings';
import { Share } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  lighten,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { BigNumber, ethers } from 'ethers';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { GET_GAME_LEVEL } from '../utils/game';
import { GET_LABEL_FROM_DURATION } from '../utils/time';
import GameCountdown from './GameCountdown';
import GameCounterSpan from './GameCounterSpan';

interface Props {
  game: GameGraph;
  onShare: (game: GameGraph) => void;
  onShowMetadata: (game: GameGraph) => void;
  chainId?: ChainId;
  affiliate?: string;
}

export default function GameCard({
  game,
  chainId,
  affiliate,
  onShare,
  onShowMetadata,
}: Props) {
  const coinToPlay = useCoinToPlay(chainId, game?.coinToPlay);

  const prizeTotalValue = useMemo(() => {
    if (game && coinToPlay) {
      return ethers.utils.formatUnits(
        BigNumber.from(game?.entry).mul(BigNumber.from(game.numPlayers)),
        coinToPlay.decimals
      );
    }

    return '';
  }, [game, coinToPlay]);

  const handleShare = () => {
    onShare(game);
  };

  const handleShowMetadata = () => onShowMetadata(game);

  const gameLevel =
    game !== undefined
      ? GET_GAME_LEVEL(BigNumber.from(game.entry), chainId, game.coinToPlay)
      : '';

  const [coins, duration, players, maxPlayers, entry] = useMemo(() => {
    if (!game) {
      return [0, 0];
    }

    const players = strPad(Number(game?.currentPlayers) || 0);
    const maxPlayers = strPad(Number(game?.numPlayers) || 0);

    const entry = ethers.utils.formatUnits(
      BigNumber.from(game?.entry),
      coinToPlay?.decimals
    );

    return [
      Number(game.numCoins),
      Number(game.duration),
      players,
      maxPlayers,
      entry,
    ];
  }, [game, coinToPlay]);

  return (
    <Card variant={game?.title ? 'outlined' : 'elevation'}>
      <Box
        sx={{
          px: 2,
          py: 1,
          backgroundColor: (theme) =>
            lighten(theme.palette.background.default, 0.05),
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          alignContent="center"
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            justifyContent="space-between"
            spacing={1}
          >
            {game?.title && (
              <IconButton size="small" onClick={handleShowMetadata}>
                <CrownIcon fontSize="small" />
              </IconButton>
            )}
            <Typography sx={{ fontWeight: 600 }}>
              #{game.id.toString()}
            </Typography>
          </Stack>
          <Button
            color="inherit"
            onClick={handleShare}
            startIcon={<Share />}
            size="small"
          >
            <FormattedMessage id="share" defaultMessage="Share" />
          </Button>
        </Stack>
      </Box>
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                <FormattedMessage id="max.prize" defaultMessage="Max Prize" />
              </Typography>
              <Typography sx={{ fontWeight: 600 }} variant="h5">
                <>
                  {prizeTotalValue} {coinToPlay?.symbol}
                </>
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">
                <FormattedMessage id="game.type" defaultMessage="Game Type" />
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                alignContent="center"
                spacing={0.5}
              >
                <Tooltip
                  title={
                    <FormattedMessage
                      id="game.level"
                      defaultMessage="Game level"
                    />
                  }
                >
                  <Chip
                    icon={<Graph />}
                    variant="outlined"
                    size="small"
                    label={gameLevel}
                  />
                </Tooltip>
                <Tooltip
                  title={
                    <FormattedMessage
                      id="game.type"
                      defaultMessage="Game type"
                    />
                  }
                >
                  <Chip
                    icon={
                      game?.type === 'Bull' ? (
                        <ArrowUpSquare />
                      ) : (
                        <ArrowDownSquare />
                      )
                    }
                    variant="outlined"
                    size="small"
                    label={
                      game?.type === 'Bull' ? (
                        <Typography
                          variant="inherit"
                          sx={(theme) => ({
                            color: theme.palette.success.main,
                          })}
                        >
                          <FormattedMessage id="bull" defaultMessage="Bull" />
                        </Typography>
                      ) : (
                        <Typography
                          variant="inherit"
                          sx={(theme) => ({ color: theme.palette.error.main })}
                        >
                          <FormattedMessage id="bear" defaultMessage="Bear" />
                        </Typography>
                      )
                    }
                  />
                </Tooltip>
              </Stack>
            </Box>
          </Stack>
          <Box>
            <Typography variant="caption" color="textSecondary">
              <FormattedMessage id="information" defaultMessage="Information" />
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              alignContent="center"
              spacing={0.5}
            >
              <Tooltip
                title={
                  <FormattedMessage
                    id="number.of.coins"
                    defaultMessage="Number of coins"
                  />
                }
              >
                <Chip
                  icon={<Coins />}
                  variant="outlined"
                  size="small"
                  label={strPad(coins)}
                />
              </Tooltip>
              <Tooltip
                title={
                  <FormattedMessage id="duration" defaultMessage="Duration" />
                }
              >
                <Chip
                  icon={<Clock />}
                  variant="outlined"
                  size="small"
                  label={GET_LABEL_FROM_DURATION(duration)}
                />
              </Tooltip>
              <Tooltip
                title={
                  <FormattedMessage id="players" defaultMessage="Players" />
                }
              >
                <Chip
                  variant="outlined"
                  size="small"
                  icon={<Persons />}
                  label={
                    <>
                      {players}/{maxPlayers}{' '}
                      <FormattedMessage id="players" defaultMessage="Players" />
                    </>
                  }
                />
              </Tooltip>
            </Stack>
          </Box>

          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: (theme) => `${theme.shape.borderRadius}px`,
              backgroundColor: (theme) =>
                lighten(theme.palette.background.default, 0.05),
            }}
          >
            <Typography
              sx={{ fontWeight: 600, textTransform: 'uppercase' }}
              variant="body1"
              align="center"
            >
              {!game?.startedAt ? (
                <GameCounterSpan startsAt={Number(game.startsAt || 0)} />
              ) : game.status === 'Started' ? (
                <GameCountdown
                  duration={Number(game.duration)}
                  startTimestamp={Number(game.startedAt)}
                />
              ) : (
                <FormattedMessage id="ended" defaultMessage="Ended" />
              )}
            </Typography>
          </Box>
          <Button
            LinkComponent={Link}
            href={`/coinleague/${getNetworkSlugFromChainId(chainId)}/${
              game.id
            }${affiliate ? '?affiliate=' + affiliate : ''}`}
            color="primary"
            variant="contained"
            sx={{
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {game?.startedAt ? (
              <FormattedMessage id="view.game" defaultMessage="View Game" />
            ) : (
              <FormattedMessage id="join.game" defaultMessage="Join Game" />
            )}
            <Typography variant="inherit">
              {entry} {coinToPlay?.symbol}
            </Typography>
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
