import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export const GET_USER_ORDER_LIST_QUERY = 'GET_USER_ORDER_LIST_QUERY';

export default function useUserOrderList(params: {
  page: number;
  limit: number;
  q?: string;
  address: string;
  status: string;
}) {
  const { instance } = { instance: null };

  return useQuery(
    [GET_USER_ORDER_LIST_QUERY, params],
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
        }>*/(`/orders/user-orders`, { params })
      ).data;
    },
    {
      refetchOnWindowFocus: 'always',
      refetchOnMount: 'always',
      staleTime: 1000,
    },
  );
}
