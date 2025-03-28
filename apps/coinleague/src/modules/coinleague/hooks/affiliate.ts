import { useQuery } from '@tanstack/react-query';
import { request } from 'graphql-request';
import {
  GET_AFFILIATES_ENTRIES,
  GET_PLAYER_AFFILIATE,
} from '../services/gql/affiliate';
import { getGraphEndpoint } from '../services/graphql';
import { useLeaguesChainInfo } from './chain';
import { useIsNFTGame } from './nft';
export const usePlayerGames = () => {};

export interface AffiliateParams {
  account?: string;
  first?: number;
  skip?: number;
}

export const useAffiliateEntries = (params: AffiliateParams, isNFT = false) => {
  const { account, first, skip } = params;
  const { chainId } = useLeaguesChainInfo();
  const isNFTGame = useIsNFTGame() || isNFT;

  const query = useQuery(
    [account, chainId, isNFTGame],
    async () => {
      if (!account) {
        return;
      }

      const variables: any = {
        affiliate: account.toLowerCase(),
      };

      if (first) {
        variables.first = first;
      }
      if (skip) {
        variables.skip = skip;
      }

      const { affiliates } = await request(
        getGraphEndpoint(isNFT, chainId),
        GET_AFFILIATES_ENTRIES,
        variables
      );

      return affiliates;
    },
    { suspense: true }
  );

  return query;
};

export const useAffiliatePlayer = (account?: string, isNFT = false) => {
  const { chainId } = useLeaguesChainInfo();
  const isNFTGame = useIsNFTGame() || isNFT;

  return useQuery([account, chainId, isNFTGame], async () => {
    if (!account) {
      return;
    }

    const { player } = await request(
      getGraphEndpoint(isNFT, chainId),
      GET_PLAYER_AFFILIATE,
      {
        affiliate: account,
      }
    );

    return player;
  });
};
