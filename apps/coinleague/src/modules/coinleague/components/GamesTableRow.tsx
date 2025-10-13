import ArrowDownSquare from '@/modules/common/components/icons/ArrowDownSquare';
import ArrowUpSquare from '@/modules/common/components/icons/ArrowUpSquare';
import Crown from '@/modules/common/components/icons/Crown';
import { ChainId } from '@/modules/common/constants/enums';
import { getNetworkSlugFromChainId } from '@/modules/common/utils';
import {
  Button,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { BigNumber, ethers } from 'ethers';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCoinToPlay } from '../hooks/coinleague';
import { GameGraph } from '../types';
import { GET_GAME_LEVEL } from '../utils/game';

interface Props {
  game: GameGraph;
  onShare: (game: GameGraph) => void;
  onShowMetadata: (game: GameGraph) => void;
  chainId?: ChainId;
  affiliate?: string;
}

export default function GamesTableRow({
  game,
  onShare,
  onShowMetadata,
  chainId,
  affiliate,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const coinToPlay = useCoinToPlay(chainId, game?.coinToPlay);

  const entry = ethers.utils.formatUnits(
    BigNumber.from(game?.entry),
    coinToPlay?.decimals,
  );

  const handleToggle = () => {
    setExpanded((value) => !value);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <Stack
            spacing={1}
            direction="row"
            alignItems="center"
          >
            {game.title && <Crown fontSize="small" />}
            <Typography>#{game.id}</Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack
            spacing={1}
            direction="row"
            alignItems="center"
          >
            {game?.type === 'Bull' ? <ArrowUpSquare /> : <ArrowDownSquare />}

            {game?.type === 'Bull' ? (
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
            )}
          </Stack>
        </TableCell>
        <TableCell>
          {GET_GAME_LEVEL(BigNumber.from(game.entry), chainId, game.coinToPlay)}
        </TableCell>

        <TableCell>
          <Button
            href={`/game/${getNetworkSlugFromChainId(chainId)}/${game.id
              }${affiliate ? '?affiliate=' + affiliate : ''}`}
            color="primary"
            variant="contained"
            sx={{
              fontWeight: 600,
              maxWidth: 250,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="inherit">
              {game?.startedAt ? (
                <FormattedMessage id="view.game" defaultMessage="View Game" />
              ) : (
                <FormattedMessage id="join.game" defaultMessage="Join Game" />
              )}
            </Typography>
            <Typography variant="inherit">
              {entry} {coinToPlay?.symbol}
            </Typography>
          </Button>
        </TableCell>

        {/*<TableCell>
          <IconButton onClick={handleToggle}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>*/}
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={4}>
            <Grid container spacing={2}>
              <Grid size="grow">
                <Typography variant="caption"></Typography>
                <Typography variant="body2"></Typography>
              </Grid>
            </Grid>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}


