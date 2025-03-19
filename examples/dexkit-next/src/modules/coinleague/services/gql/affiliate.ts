import { gql } from 'graphql-request';

export const GET_AFFILIATES_ENTRIES = gql`
  query GetAffiliates($affiliate: String, $first: Int, $skip: Int) {
    affiliates(first: $first, skip: $skip, where: { affiliate: $affiliate }) {
      id
      type
      status
      createdAt
      game {
        intId
        coinToPlay
      }
      player {
        id
      }
    }
  }
`;

export const GET_PLAYER_AFFILIATE = gql`
  query GetPlayerAffiliates($affiliate: Bytes!) {
    player(id: $affiliate) {
      id
      estimatedAffiliateEarnings
    }
  }
`;
