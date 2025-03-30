import { useQuery } from '@tanstack/react-query';
import { request } from 'graphql-request';
import { useMemo } from 'react';

import { ChainId } from '@/modules/common/constants/enums';

import {
  GET_RANKING_MOST_EARNED,
  GET_RANKING_MOST_JOINED,
  GET_RANKING_MOST_PROFIT,
  GET_RANKING_MOST_WINNED,
} from '../services/gql/ranking';
import { getGraphEndpoint } from '../services/graphql';
import { PlayerGraph } from '../types';

export enum RankingType {
  MostWinner = 'Most Winner',
  MostJoined = 'Most Joined',
  MostEarned = 'Most Earned',
  MostProfit = 'Most Profit',
}

export const useRanking = (
  type: RankingType,
  isNFTGame = false,
  chainId = ChainId.Polygon
) => {
  const queryString = useMemo(() => {
    switch (type) {
      case RankingType.MostWinner:
        return GET_RANKING_MOST_WINNED;
      case RankingType.MostJoined:
        return GET_RANKING_MOST_JOINED;
      case RankingType.MostEarned:
        return GET_RANKING_MOST_EARNED;
      case RankingType.MostProfit:
        return GET_RANKING_MOST_PROFIT;
    }
  }, [type]);

  return useQuery<PlayerGraph[]>(
    [queryString, isNFTGame, chainId],
    async () => {
      const { players } = await request(
        getGraphEndpoint(isNFTGame, chainId),
        queryString
      );

      return players;
    }
  );
};

// export const useRankingCompetion = (
//   type: RankingType = RankingType.MostJoined,
//   isNFTGame = false,
//   chainId = ChainId.Polygon,
//   month: Months = Months.March
// ) => {
//   const query = useQuery(['GET_RANKING_COMPETITION', month, chainId], () => {
//     if (chainId !== ChainId.Polygon) {
//       return;
//     }
//     let queryString = GET_RANKING_MOST_JOINED_COMPETITION_STRING;
//     let variables: any = {};
//     const lastMonthInd = Object.keys(Months).length - 1;
//     const monthsKeys = Object.keys(Months);

//     // February started competition so we only use till block
//     if (month === Months.February) {
//       queryString = GET_RANKING_MOST_JOINED_COMPETITION_BETWEEN_MONTHS_STRING;
//       variables.fromBlock = BLOCK_TIMESTAMP_COMPETION[Months.March][chainId];
//       variables.tillBlock = BLOCK_TIMESTAMP_COMPETION[Months.March][chainId];
//       //@ts-ignore
//     } else if (month !== Months[monthsKeys[lastMonthInd]]) {
//       // middle months we use from and till
//       const monthInd = monthsKeys.findIndex((m) => m === month);
//       queryString = GET_RANKING_MOST_JOINED_COMPETITION_BETWEEN_MONTHS_STRING;
//       variables.fromBlock = BLOCK_TIMESTAMP_COMPETION[month][chainId];
//       // @ts-ignore
//       variables.tillBlock =
//         BLOCK_TIMESTAMP_COMPETION[Months[monthsKeys[monthInd + 1]]][chainId];
//     } else {
//       // Last months we only use from block
//       queryString = GET_RANKING_MOST_JOINED_COMPETITION_STRING;
//       variables.fromBlock = BLOCK_TIMESTAMP_COMPETION[month][chainId];
//     }
//     // We can not use Apollo useQuery because it was merging fields by id
//     return fetch(GET_GRAPHQL_CLIENT_URL_MAIN_ROOM[chainId], {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         query: queryString,
//         variables: variables,
//       }),
//     }).then(
//       (r) =>
//         r.json() as unknown as {
//           data: { pastPlayers: PlayerGraph[]; players: PlayerGraph[] };
//         }
//     );
//   });

//   return query;
// };

export const useRankingMostWinned = (
  isNFTGame = false,
  chainId = ChainId.Polygon
) => {
  return useQuery<PlayerGraph[]>([isNFTGame, chainId], async () => {
    const { players } = await request(
      getGraphEndpoint(isNFTGame, chainId),
      GET_RANKING_MOST_WINNED
    );
    return players;
  });
};

export const useRankingMostJoined = (
  isNFTGame = false,
  chainId = ChainId.Polygon
) => {
  return useQuery<PlayerGraph[]>([isNFTGame, chainId], async () => {
    const { players } = await request(
      getGraphEndpoint(isNFTGame, chainId),
      GET_RANKING_MOST_JOINED
    );
    return players;
  });
};

export const useRankingMostEarned = (
  isNFTGame = false,
  chainId = ChainId.Polygon
) => {
  return useQuery<PlayerGraph[]>([isNFTGame, chainId], async () => {
    const { players } = await request(
      getGraphEndpoint(isNFTGame, chainId),
      GET_RANKING_MOST_EARNED
    );
    return players;
  });
};

export const useRankingMostProfit = (
  isNFTGame = false,
  chainId = ChainId.Polygon
) => {
  return useQuery<PlayerGraph[]>([isNFTGame, chainId], async () => {
    const { players } = await request(
      getGraphEndpoint(isNFTGame, chainId),
      GET_RANKING_MOST_PROFIT
    );
    return players;
  });
};
