import { gql } from 'graphql-request';

export const GET_GAME_QUERY = gql`
  query GetGameQuery($id: ID!) {
    game(id: $id) {
      id
      status
      entry
      endedAt
      startedAt
      createdAt
      startsAt
      type
      numPlayers
      numCoins
      duration
      currentPlayers
      coinToPlay
    }
  }
`;
