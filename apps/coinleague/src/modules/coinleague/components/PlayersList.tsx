import { List } from '@mui/material';
import { CoinLeagueGame, CoinLeagueGamePlayer, GameProfile } from '../types';

import { ChainId } from '@/modules/common/constants/enums';
import { getProviderByChainId } from '@/modules/common/utils';
import { Web3Provider } from '@ethersproject/providers';
import { memo, useMemo } from 'react';
import { GameType } from '../constants/enums';
import { usePlayersScoresQuery } from '../hooks/coinleague';
import { useFactoryAddress } from '../hooks/coinleagueFactory';
import PlayersListItem from './PlayersListItem';

interface Props {
  players: CoinLeagueGamePlayer[];
  isLoadingGame: boolean;
  game: CoinLeagueGame;
  profiles?: GameProfile[];
  chainId: ChainId;
  account?: string;
  showWinners?: boolean;
  hideCoins?: boolean;
  gameType: GameType;
}

function PlayersList({
  game,
  isLoadingGame,
  players,
  profiles,
  chainId,
  account,
  showWinners,
  hideCoins,
  gameType,
}: Props) {
  const factoryAddress = useFactoryAddress();
  const provider = getProviderByChainId(chainId) as Web3Provider;
  const { data, isLoading: isLoadingScore } = usePlayersScoresQuery({
    game,
    factoryAddress,
    provider,
  });

  const isLoading = useMemo(() => {
    if (isLoadingGame) {
      return isLoadingGame;
    }

    if (game.started && !game.finished) {
      return isLoadingScore;
    }
    return false;
  }, [isLoadingGame, isLoadingScore, game]);

  const playerList = useMemo(() => {
    if (game.started && !game.finished && data) {
      const sortedPlayers = [];
      for (const pl of data.playerScoreSorted) {
        const player = players.find(
          (p) => p.player_address.toLowerCase() === pl.address.toLowerCase(),
        ) as CoinLeagueGamePlayer;
        player.score = pl.score.toString();
        sortedPlayers.push(player);
      }
      return sortedPlayers;
    } else {
      return players.sort(
        (a: CoinLeagueGamePlayer, b: CoinLeagueGamePlayer) => {
          const x = gameType ? Number(a.score) : Number(b.score);
          const y = gameType ? Number(b.score) : Number(a.score);

          if (x > y) {
            return -1;
          }

          if (x < y) {
            return 1;
          }

          return 0;
        },
      );
    }
  }, [players, game, data]);

  const coinFeeds = useMemo(() => {
    if (game.started && !game.finished && data) {
      return data.coinFeeds;
    }
    return game.coinFeeds;
  }, [game, data]);

  return (
    <List disablePadding dense>
      {playerList?.map((p, index) => (
        <PlayersListItem
          key={index}
          game={game}
          player={p}
          isLoadingScore={isLoading}
          coinFeeds={coinFeeds}
          profiles={profiles}
          chainId={chainId}
          account={account}
          position={index}
          multipleWinners={playerList.length > 3}
          showWinners={showWinners}
          hideCoins={hideCoins}
        />
      ))}
    </List>
  );
}

export default memo(PlayersList);
