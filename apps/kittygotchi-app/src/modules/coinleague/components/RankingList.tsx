import { ChainId } from '@/modules/common/constants/enums';
import { isAddressEqual } from '@/modules/common/utils';
import { List } from '@mui/material';
import { ethers } from 'ethers';
import { useCoinToPlayStable } from '../hooks/coinleague';
import { GameProfile, PlayerGraph } from '../types';
import RankingListItem from './RankingListItem';

interface Props {
  ranking: PlayerGraph[];
  profiles: GameProfile[];
  chainId?: ChainId;
  account?: string;
}

export default function RankingList({
  profiles,
  ranking,
  chainId,
  account,
}: Props) {
  const coinToPlay = useCoinToPlayStable(chainId);

  const coinSymbol = coinToPlay?.symbol.toUpperCase() || '';
  const decimals = coinToPlay?.decimals;

  return (
    <List disablePadding>
      {ranking.map((player, index) => (
        <RankingListItem
          key={index}
          position={index + 1}
          address={player.id}
          featured={isAddressEqual(account, player.id)}
          profile={profiles.find((p) => isAddressEqual(p?.address, player?.id))}
          joinsCount={Number(player.totalJoinedGames)}
          winsCount={Number(player.totalWinnedGames)}
          firstCount={Number(player.totalFirstWinnedGames)}
          secondCount={Number(player.totalSecondWinnedGames)}
          thirdCount={Number(player.totalThirdWinnedGames)}
          count={Number(player.totalWinnedGames)}
          EarnedMinusSpent={Number(
            ethers.utils.formatUnits(player.EarnedMinusSpent, decimals)
          )}
          totalEarned={Number(
            ethers.utils.formatUnits(player.totalEarned, decimals)
          )}
          coinSymbol={coinSymbol}
          label="asdas"
        />
      ))}
    </List>
  );
}
