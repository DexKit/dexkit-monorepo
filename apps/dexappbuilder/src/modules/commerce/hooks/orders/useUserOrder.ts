import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const GET_USER_ORDER_QUERY = 'GET_USER_ORDER_QUERY';

export default function useUserOrder(params: { id?: string }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery({
    queryKey: [GET_USER_ORDER_QUERY, params],
    queryFn: async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      if (!params.id) {
        return null;
      }

      return (await instance.get/*<Order>*/(`/orders/user-orders/${params.id}`))
        .data;
    },
    refetchOnWindowFocus: 'always',
    refetchOnMount: 'always',
    staleTime: Infinity,
  });
}
