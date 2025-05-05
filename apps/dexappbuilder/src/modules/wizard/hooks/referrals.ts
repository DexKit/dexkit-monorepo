import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

export const GET_REFERRALS = 'get-referrals';

export interface Referral {
  id: string;
  name: string;
  url: string;
  visits: number;
  conversions: number;
  conversionRate: number;
  createdAt: string;
  lastUsed: string | null;
}

export interface CreateReferralParams {
  siteId?: number;
  name: string;
}

export function useReferralsQuery({ siteId }: { siteId?: number }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_REFERRALS, siteId],
    async () => {
      if (!siteId) return [];

      try {
        const response = await instance?.get(`/referrals/${siteId}`);
        return response?.data || [];
      } catch (error) {
        console.error('Error fetching referrals:', error);
        return [];
      }
    },
    {
      enabled: !!siteId,
      staleTime: 1000 * 60 * 5,
    }
  );
}

export function useCreateReferralMutation() {
  const { instance } = useContext(DexkitApiProvider);
  const queryClient = useQueryClient();

  return useMutation(
    async ({ siteId, name }: CreateReferralParams) => {
      if (!siteId) {
        throw new Error('Site ID is required');
      }

      const response = await instance?.post(`/referrals/${siteId}`, { name });
      return response?.data;
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([GET_REFERRALS, variables.siteId]);
      }
    }
  );
}

export function useDeleteReferralMutation() {
  const { instance } = useContext(DexkitApiProvider);
  const queryClient = useQueryClient();

  return useMutation(
    async ({ siteId, referralId }: { siteId?: number; referralId: string }) => {
      if (!siteId) {
        throw new Error('Site ID is required');
      }

      const response = await instance?.delete(`/referrals/${siteId}/${referralId}`);
      return response?.data;
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([GET_REFERRALS, variables.siteId]);
      }
    }
  );
} 