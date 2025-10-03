import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export const GET_PRODUCT_QUERY = 'GET_PRODUCT_QUERY';

export default function useProduct(params: { id?: string }) {
  const { instance } = { instance: null };

  return useQuery(
    [GET_PRODUCT_QUERY, params],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      if (!params.id) {
        return null;
      }

      return (await (instance as any).get(`/products/${params.id}`))
        .data;
    },
    {
      refetchOnWindowFocus: 'always',
      refetchOnMount: 'always',
      staleTime: Infinity,
    },
  );
}
