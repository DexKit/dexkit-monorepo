import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export const GET_CHECKOUT_QUERY = 'GET_CHECKOUT_QUERY';

export default function useCheckout(params: { id?: string }) {
  const { instance } = { instance: null };

  return useQuery(
    [GET_CHECKOUT_QUERY, params],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      if (!params.id) {
        return null;
      }

      return (await (instance as any).get(`/checkouts/${params.id}`))
        .data;
    },
    {
      refetchOnWindowFocus: 'always',
      refetchOnMount: 'always',
      staleTime: Infinity,
    },
  );
}
