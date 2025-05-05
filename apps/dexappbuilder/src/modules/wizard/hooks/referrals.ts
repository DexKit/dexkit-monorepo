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

// MOCK DATA IMPLEMENTATION
// This class emulates the API calls to the referrals
class MockReferralsApi {
  private static instance: MockReferralsApi;
  private referrals: Map<number, Referral[]> = new Map();

  private constructor() {
    const demoSiteId = 1;
    this.referrals.set(demoSiteId, [
      {
        id: '1',
        name: 'twitter',
        url: 'https://yourdapp.dexkit.app?ref=twitter',
        visits: 1245,
        conversions: 52,
        conversionRate: 4.18,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        name: 'instagram',
        url: 'https://yourdapp.com?ref=instagram',
        visits: 823,
        conversions: 37,
        conversionRate: 4.5,
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]);
  }

  static getInstance(): MockReferralsApi {
    if (!MockReferralsApi.instance) {
      MockReferralsApi.instance = new MockReferralsApi();
    }
    return MockReferralsApi.instance;
  }

  async getReferrals(siteId: number): Promise<Referral[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.referrals.get(siteId) || [];
  }

  async createReferral(siteId: number, name: string): Promise<Referral> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const baseUrl = 'https://yourdapp.dexkit.app';
    
    const newReferral: Referral = {
      id: Date.now().toString(),
      name,
      url: `${baseUrl}?ref=${name}`,
      visits: 0,
      conversions: 0,
      conversionRate: 0,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };

    if (!this.referrals.has(siteId)) {
      this.referrals.set(siteId, []);
    }
    
    const siteReferrals = this.referrals.get(siteId)!;
    siteReferrals.push(newReferral);
    
    return newReferral;
  }

  async deleteReferral(siteId: number, referralId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 600));

    if (this.referrals.has(siteId)) {
      const siteReferrals = this.referrals.get(siteId)!;
      const updatedReferrals = siteReferrals.filter(ref => ref.id !== referralId);
      this.referrals.set(siteId, updatedReferrals);
    }
  }
}

// Flag to determine if the mock API or the real API is used
// IMPORTANT: Change to false when the real endpoints are available
const USE_MOCK_API = true;

export function useReferralsQuery({ siteId }: { siteId?: number }) {
  const { instance } = useContext(DexkitApiProvider);
  const mockApi = MockReferralsApi.getInstance();

  return useQuery(
    [GET_REFERRALS, siteId],
    async () => {
      if (!siteId) return [];

      try {
        if (USE_MOCK_API) {
          return await mockApi.getReferrals(siteId);
        } else {
          const response = await instance?.get(`/referrals/${siteId}`);
          return response?.data || [];
        }
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
  const mockApi = MockReferralsApi.getInstance();

  return useMutation(
    async ({ siteId, name }: CreateReferralParams) => {
      if (!siteId) {
        throw new Error('Site ID is required');
      }

      if (USE_MOCK_API) {
        return await mockApi.createReferral(siteId, name);
      } else {
        const response = await instance?.post(`/referrals/${siteId}`, { name });
        return response?.data;
      }
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
  const mockApi = MockReferralsApi.getInstance();

  return useMutation(
    async ({ siteId, referralId }: { siteId?: number; referralId: string }) => {
      if (!siteId) {
        throw new Error('Site ID is required');
      }

      if (USE_MOCK_API) {
        return await mockApi.deleteReferral(siteId, referralId);
      } else {
        const response = await instance?.delete(`/referrals/${siteId}/${referralId}`);
        return response?.data;
      }
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([GET_REFERRALS, variables.siteId]);
      }
    }
  );
} 