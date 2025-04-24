import { useWeb3React } from '@web3-react/core';
import { gql, request } from 'graphql-request';

import { useMutation, useQuery } from '@tanstack/react-query';
import { getGraphEndpoint } from '../services/graphql';
import {
  create,
  createUsername,
  getProfile,
  remove,
  signUpdate,
} from '../services/profileApi';
import { ProfileStats } from '../types';
import { useLeaguesChainInfo } from './chain';
const GET_PLAYER_PROFILE_STATS_QUERY = gql`
  query getPlayerProfileStats($address: ID!) {
    stats: player(id: $address) {
      totalWinnedGames
      totalFirstWinnedGames
      totalSecondWinnedGames
      totalThirdWinnedGames
      totalJoinedGames
      totalEarned
      totalSpent
    }
  }
`;

export const PROFILE_STATUS_QUERY = 'PROFILE_STATUS_QUERY';

export function usePlayerProfileStats(account?: string, isNFT = false) {
  const { chainId } = useLeaguesChainInfo();

  return useQuery<ProfileStats>(
    [PROFILE_STATUS_QUERY, account, isNFT, chainId],
    async () => {
      const data = await request(
        getGraphEndpoint(isNFT, chainId),
        GET_PLAYER_PROFILE_STATS_QUERY,
        { address: account?.toLowerCase() }
      );

      return data.stats;
    }
  );
}

export const useGameProfileUpdater = () => {
  const { provider, account } = useWeb3React();
  const { chainId } = useLeaguesChainInfo();

  const onPostMetadataMutation = useMutation(
    async ({
      username,
      tokenAddress,
      tokenId,
    }: {
      username: string;
      tokenAddress: string;
      tokenId: string;
    }) => {
      if (!chainId || !account || !provider) {
        return;
      }

      const signedData = await signUpdate(provider, chainId);

      await create(
        signedData.sig,
        signedData.messageSigned,
        tokenAddress,
        tokenId,
        username,
        account?.toLowerCase(),
        chainId
      );
    }
  );

  const onPostOnlyUsernameMetadataMutation = useMutation(
    async ({ username }: { username: string }) => {
      if (!chainId || !account || !provider) {
        return;
      }

      const signedData = await signUpdate(provider, chainId);

      await createUsername(
        signedData.sig,
        signedData.messageSigned,
        username,
        account?.toLowerCase(),
        chainId
      );
    }
  );

  return { onPostMetadataMutation, onPostOnlyUsernameMetadataMutation };
};

export const useProfileGameDelete = () => {
  const { provider, chainId, account } = useWeb3React();

  const onDeleteGameMetadataMutation = useMutation(async () => {
    if (!chainId || !account || !provider) {
      return;
    }

    const signedData = await signUpdate(provider, chainId);

    await remove(signedData.sig, signedData.messageSigned, account);
  });

  return { onDeleteGameMetadataMutation };
};

export const GET_GAME_PROFILE = 'GET_GAME_PROFILE';

export const useProfileGame = (account?: string) => {
  return useQuery(
    [GET_GAME_PROFILE, account],
    async () => {
      if (!account) {
        return undefined;
      }

      return await getProfile(account);
    },
    { retryDelay: 30000 }
  );
};

const PROFILE_USERNAME_CHECK_QUERY = 'PROFILE_USERNAME_CHECK_QUERY';

export function useCoinLeagueProfileChecker(username: string) {
  return useQuery([PROFILE_USERNAME_CHECK_QUERY, username], async () => {
    if (!username) {
      return;
    }

    return getProfile(username)
      .then((profile) => {
        return { isAvailable: false };
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) {
            return { isAvailable: true };
          }
        }

        return err;
      });
  });
}

const GET_COIN_LEAGUE_PROFILE = 'GET_COIN_LEAGUE_PROFILE';

export function useCoinLeagueProfile(address: string) {
  return useQuery([GET_COIN_LEAGUE_PROFILE, address], () => {
    return getProfile(address);
  });
}
