import { gql } from "graphql-request";

export const GET_KITTYGOTCHI_RANKING = gql`
  query QueryKittygotchiRanking($offset: Int!, $limit: Int!) {
    tokens(
      first: $limit
      skip: $offset
      orderBy: totalStrength
      orderDirection: desc
    ) {
      id
      owner {
        id
      }
      uri
      attack
      totalStrength
    }
  }
`;

export const GET_MY_KITTYGOTCHIES = gql`
  query QueryKittygotchies($owner: String!) {
    tokens(where: {owner_contains: $owner}) {
      id
      owner {
        id
      }
      attack
      defense
      run
      uri
      lastUpdated
    }
  }
`;

export const GET_KITTYGOTCHI = gql`
  query QueryKittygotchi($id: String!) {
    token(id: $id) {
      id
      owner {
        id
      }
      attack
      defense
      run
      uri
      lastUpdated
    }
  }
`;