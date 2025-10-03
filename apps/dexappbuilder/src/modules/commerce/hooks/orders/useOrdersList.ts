import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export const GET_ORDER_LIST_QUERY = 'GET_ORDER_LIST_QUERY';

export default function useOrderList(params: {
  page: number;
  limit: number;
  status: string;
  q?: string;
}) {
  const { instance } = { instance: null };

  return useQuery(
    [GET_ORDER_LIST_QUERY, params],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      return (
        await (instance as any).get/*<{
          items: Order[];
          totalItems: number;
          totalPages: number;
          currentPage: number;
        }>*/('/orders', { params })
      ).data;
    },
    {
      refetchOnWindowFocus: 'always',
      refetchOnMount: 'always',
      staleTime: Infinity,
    },
  );
}
