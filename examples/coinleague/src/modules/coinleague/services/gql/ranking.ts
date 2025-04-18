import { gql } from 'graphql-request';

export const GET_RANKING_MOST_WINNED = gql`
  {
    players(
      first: 100
      orderBy: totalWinnedGames
      orderDirection: desc
      where: {totalWinnedGames_gt: 0}
    ) {
      id
      totalWinnedGames
      totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
      totalEarned
      EarnedMinusSpent
    }
  }
`;

export const GET_RANKING_MOST_JOINED = gql`
  {
    players(
      first: 500
      orderBy: totalJoinedGames
      orderDirection: desc
      where: {totalJoinedGames_gt: 0}
    ) {
      id
      totalWinnedGames
      totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
      totalEarned
      EarnedMinusSpent
    }
  }
`;

export const GET_RANKING_MOST_JOINED_COMPETITION = gql`
  query GetMostJoinedPast($block: Int){
    players(
      first: 500
      orderBy: totalJoinedGames
      orderDirection: desc
      where: {totalJoinedGames_gt: 0}
    ) {
      id
      totalWinnedGames
      totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
      totalEarned
      EarnedMinusSpent
    }
    pastPlayers: players(
      first: 500
      orderBy: totalJoinedGames
      orderDirection: desc
      where: {totalJoinedGames_gt: 0}
      block: {number: $block }
    ) {
      id
      totalWinnedGames
      pastTotalJoinedGames: totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
      totalEarned
      EarnedMinusSpent
    }
  }
`;

export const GET_RANKING_MOST_JOINED_COMPETITION_STRING = `
  query GetMostJoinedPast($fromBlock: Int){
    players(
      first: 500
      orderBy: totalJoinedGames
      orderDirection: desc
      where: {totalJoinedGames_gt: 0}
    ) {
      id
      totalWinnedGames
      totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
      totalEarned
      EarnedMinusSpent
    }
    pastPlayers: players(
      first: 500
      orderBy: totalJoinedGames
      orderDirection: desc
      where: {totalJoinedGames_gt: 0}
      block: {number: $fromBlock }
    ) {
      id
      totalWinnedGames
      totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
      totalEarned
      EarnedMinusSpent
    }
  }
`;

export const GET_RANKING_MOST_JOINED_COMPETITION_BETWEEN_MONTHS_STRING = `
  query GetMostJoinedPast($tillBlock: Int, $fromBlock: Int){
    players(
      first: 500
      orderBy: totalJoinedGames
      orderDirection: desc
      where: {totalJoinedGames_gt: 0}
      block: {number: $tillBlock }
    ) {
      id
      totalWinnedGames
      totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
      totalEarned
      EarnedMinusSpent
    }
    pastPlayers: players(
      first: 500
      orderBy: totalJoinedGames
      orderDirection: desc
      where: {totalJoinedGames_gt: 0}
      block: {number: $fromBlock }
    ) {
      id
      totalWinnedGames
      totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
      totalEarned
      EarnedMinusSpent
    }
  }
`;


export const GET_RANKING_MOST_EARNED = gql`
  {
    players(
      first: 100
      orderBy: totalEarned
      orderDirection: desc
      where: {totalEarned_gt: 0}
    ) {
      id
      totalWinnedGames
      totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
      totalEarned
      EarnedMinusSpent
    }
  }
`;

export const GET_RANKING_MOST_PROFIT = gql`
  {
    players(
      first: 100
      orderBy: EarnedMinusSpent
      orderDirection: desc
      where: {EarnedMinusSpent_gt: 0}
    ) {
      id
      totalWinnedGames
      totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
      totalEarned
      EarnedMinusSpent
    }
  }
`;
