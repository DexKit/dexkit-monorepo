import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export const GET_ORDER_ITEMS_QUERY = 'GET_ORDER_ITEMS_QUERY';

export default function useOrderItems(params: { id?: string }) {
  const { instance } = { instance: null };

  return useQuery(
    [GET_ORDER_ITEMS_QUERY, params],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      if (!params.id) {
        return null;
      }

      return (await (instance as any).get/*<OrderItem[]>*/(`/orders/${params.id}/items`))
        .data;
    },
    {
      refetchOnWindowFocus: 'always',
      refetchOnMount: 'always',
      staleTime: Infinity,
    },
  );
}
