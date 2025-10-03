import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export const GET_CHECKOUT_SETTINGS = 'GET_CHECKOUT_SETTINGS';

export default function useCheckoutSettings() {
  const { instance } = { instance: null };

  return useQuery(
    [GET_CHECKOUT_SETTINGS],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      const result = (
        await (instance as any).get('/checkouts/settings')
      ).data;

      return result;
    },
    {
      refetchOnWindowFocus: 'always',
      refetchOnMount: 'always',
      staleTime: Infinity,
    },
  );
}
