import { UserOptions } from '@dexkit/ui/types/ai';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth, useLoginAccountMutation } from '@dexkit/ui/hooks/auth';
import { useSiteId } from 'src/hooks/app';
import {
  getClaimCampaign,
  getUserAddAccountMessage,
  getUserByAccount,
  getUserByUsername,
  getUserConnectDiscord,
  getUserConnectTwitter,
  postUserAddAccount,
  postUserRemoveAccount,
  setNftProfile,
  upsertUser,
  validateNFTOwnership,
} from '../services';

export function useClaimCampaignMutation({
  onSuccess,
}: {
  onSuccess?: ({ txHash }: { txHash: string }) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      const response = await axios.post<{ txHash: string }>(
        `/api/airdrop/websummit`,
        undefined,
        { withCredentials: true },
      );

      return response.data;
    },
    {
      onSuccess(data) {
        if (onSuccess) {
          onSuccess(data);
        }

        queryClient.refetchQueries([GET_USER_CLAIM_CAMPAIGN_QUERY]);
      },
    },
  );
}

export const GET_USER_CLAIM_CAMPAIGN_QUERY = 'GET_USER_CLAIM_CAMPAIGN_QUERY';

export function useUserClaimCampaignQuery() {
  const { account } = useWeb3React();
  const { isLoggedIn } = useAuth();
  return useQuery(
    [GET_USER_CLAIM_CAMPAIGN_QUERY, account, isLoggedIn],
    async () => {
      if (!account) {
        return;
      }
      if (!isLoggedIn) {
        return;
      }
      const { data } = await getClaimCampaign();
      return data;
    },
  );
}

export function useAddAccountUserMutation() {
  const { account, provider, signMessage } = useWeb3React();
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  return useMutation(async () => {
    if (!provider || !account) {
      return;
    }
    if (!isLoggedIn) {
      return;
    }
    const messageToSign = await getUserAddAccountMessage({ address: account });
    const signature = await signMessage({
      message: messageToSign.data,
    });
    const user = await postUserAddAccount({ signature, address: account });
    queryClient.refetchQueries([GET_AUTH_USER]);
    return user;
  });
}

export function useRemoveAccountUserMutation() {
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  return useMutation(async (account?: string) => {
    if (!isLoggedIn || !account) {
      return;
    }
    const user = await postUserRemoveAccount({ address: account });
    queryClient.refetchQueries([GET_AUTH_USER]);
    return user;
  });
}

export function useUpsertUserMutation() {
  const { isLoggedIn } = useAuth();
  const siteId = useSiteId();
  const loginMutation = useLoginAccountMutation();
  return useMutation(async (user?: UserOptions) => {
    if (!user) {
      return;
    }
    if (!isLoggedIn) {
      await loginMutation.mutateAsync();
    }
    await upsertUser({ ...user, createdOnSiteId: siteId });
  });
}

export function useUserConnectTwitterMutation() {
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();
  return useMutation(async () => {
    if (!isLoggedIn) {
      await loginMutation.mutateAsync();
    }

    await getUserConnectTwitter();
  });
}

export function useUserConnectDiscordMutation() {
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();
  return useMutation(async () => {
    if (!isLoggedIn) {
      await loginMutation.mutateAsync();
    }
    await getUserConnectDiscord();
  });
}

export const GET_USER_BY_USERNAME_QUERY = 'GET_USER_BY_USERNAME_QUERY';

export function useUserQuery(username?: string) {
  const { isLoggedIn } = useAuth();
  return useQuery(
    [GET_USER_BY_USERNAME_QUERY, username, isLoggedIn],
    async () => {
      if (username) {
        const userRequest = await getUserByUsername(username);
        return userRequest.data;
      }
      return null;
    },
  );
}

export const GET_AUTH_USER = 'GET_AUTH_USER';
export function useAuthUserQuery() {
  const { account } = useWeb3React();
  const { isLoggedIn } = useAuth();
  return useQuery([GET_AUTH_USER, account, isLoggedIn], async () => {
    if (account && isLoggedIn) {
      try {
        const userRequest = await getUserByAccount();
        return userRequest.data || null;
      } catch (error) {
        console.error('Error fetching auth user:', error);
        return null;
      }
    }
    return null;
  });
}

export function useValidateNFTOwnershipMutation() {
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation(
    async ({
      nftChainId,
      nftAddress,
      nftId,
    }: {
      nftChainId: number;
      nftAddress: string;
      nftId: string;
    }) => {
      if (!isLoggedIn) {
        try {
          await loginMutation.mutateAsync();
        } catch (loginError) {
          throw new Error('Could not authenticate to validate NFT');
        }
      }

      try {
        if (!nftChainId || !nftAddress || !nftId) {
          throw new Error('Missing required parameters to validate NFT');
        }

        const response = await validateNFTOwnership({
          nftChainId,
          nftAddress,
          nftId,
        });

        if (!response.data.success) {
          throw new Error(
            response.data.message || 'You are not the owner of this NFT',
          );
        }

        return response.data;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Unknown error validating NFT';
        throw new Error(errorMessage);
      }
    },
  );
}

export function useSetNftProfileMutation() {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation(
    async (data: { nftId: number; signature: string }) => {
      if (!isLoggedIn) {
        await loginMutation.mutateAsync();
      }
      const response = await setNftProfile(data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_AUTH_USER]);
      },
      onError: (error: any) => {
        console.error('Error setting NFT profile:', error);
        throw error;
      },
    },
  );
}
