import { ChainId } from '@/modules/common/constants/enums';
import { isAddressEqual } from '@/modules/common/utils';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { BigNumber, ethers } from 'ethers';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCoinToPlay } from '../hooks/coinleague';
import { CoinLeagueGame, CoinLeagueGamePlayer } from '../types';

interface Props {
  game?: CoinLeagueGame;
  account?: string;
  chainId?: ChainId;
  claimed?: boolean;
  onClaim: () => void;
  isClaiming?: boolean;
}

export default function GameWinnerCard({
  game,
  account,
  chainId,
  claimed,
  isClaiming,
  onClaim,
}: Props) {
  const coinToPlay = useCoinToPlay(chainId, game?.coin_to_play);

  const playerList = useMemo(() => {
    if (game?.players && account) {
      const gameType = game.game_type - 1;

      return game.players.sort(
        (a: CoinLeagueGamePlayer, b: CoinLeagueGamePlayer) => {
          const x = BigNumber.from(gameType ? a.score : b.score).toNumber();
          const y = BigNumber.from(gameType ? b.score : a.score).toNumber();

          if (x > y) {
            return -1;
          }

          if (x < y) {
            return 1;
          }

          return 0;
        }
      );
    }

    return [];
  }, [game?.players, account]);

  const position = useMemo(() => {
    if (game && account) {
      return playerList.findIndex((p) =>
        isAddressEqual(p.player_address, account)
      );
    }

    return -1;
  }, [game, playerList, account]);

  const prizeByPosition = useMemo(() => {
    if (game && coinToPlay) {
      const prize = BigNumber.from(game?.amount_to_play).mul(
        BigNumber.from(game.players.length)
      );

      if (playerList.length > 3) {
        const partPrize = prize
          .mul(BigNumber.from('9'))
          .div(BigNumber.from('10'));

        if (position === 0) {
          return ethers.utils.formatUnits(
            partPrize.div(BigNumber.from('10')).mul(BigNumber.from('6')),
            coinToPlay.decimals
          );
        } else if (position === 1) {
          return ethers.utils.formatUnits(
            partPrize.div(BigNumber.from('10')).mul(BigNumber.from('3')),
            coinToPlay.decimals
          );
        } else if (position === 2) {
          return ethers.utils.formatUnits(
            partPrize.div(BigNumber.from('10')).mul(BigNumber.from('1')),
            coinToPlay.decimals
          );
        }
      } else if (position === 0) {
        return ethers.utils.formatUnits(
          prize.div(BigNumber.from('10')).mul(BigNumber.from('9')),
          coinToPlay.decimals
        );
      }
    }

    return -1;
  }, [position, game, coinToPlay, playerList]);

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <Stack spacing={2} justifyContent="flex-start" alignItems="flex-start">
          <Box>
            <Typography variant="h5">
              <FormattedMessage
                id="congratulations"
                defaultMessage="Congratulations"
              />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <FormattedMessage
                id="you.won.in.n.place"
                defaultMessage={'you won in {place}° place'}
                values={{ place: position + 1 }}
              />
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption">
              <FormattedMessage id="prize" defaultMessage="Prize" />
            </Typography>
            <Typography variant="h4">
              {prizeByPosition} {coinToPlay?.symbol}
            </Typography>
          </Box>
          <Button
            startIcon={
              isClaiming ? (
                <CircularProgress size="1rem" color="inherit" />
              ) : undefined
            }
            onClick={onClaim}
            disabled={claimed || isClaiming}
            variant="contained"
            color="primary"
          >
            {claimed ? (
              <FormattedMessage id="claimed" defaultMessage="Claimed" />
            ) : (
              <FormattedMessage id="claim" defaultMessage="Claim" />
            )}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
