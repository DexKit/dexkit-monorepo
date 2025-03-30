import { List } from '@mui/material';
import { CoinLeagueGame, CoinLeagueGamePlayer, GameProfile } from '../types';

import { ChainId } from '@/modules/common/constants/enums';
import { BigNumber } from 'ethers';
import { memo, useMemo } from 'react';
import { GameType } from '../constants/enums';
import PlayersListItem from './PlayersListItem';

interface Props {
  players: CoinLeagueGamePlayer[];
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
  players,
  profiles,
  chainId,
  account,
  showWinners,
  hideCoins,
  gameType,
}: Props) {
  const playerList = useMemo(() => {
    return players.sort((a: CoinLeagueGamePlayer, b: CoinLeagueGamePlayer) => {
      const x = BigNumber.from(gameType ? a.score : b.score).toNumber();
      const y = BigNumber.from(gameType ? b.score : a.score).toNumber();

      if (x > y) {
        return -1;
      }

      if (x < y) {
        return 1;
      }

      return 0;
    });
  }, [players]);

  return (
    <List disablePadding dense>
      {playerList.map((p, index) => (
        <PlayersListItem
          key={index}
          game={game}
          player={p}
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
