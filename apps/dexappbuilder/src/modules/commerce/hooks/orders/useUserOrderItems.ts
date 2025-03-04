import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { OrderItem } from '../../types';

export const GET_USER_ORDER_ITEMS_QUERY = 'GET_USER_ORDER_ITEMS_QUERY';

export default function useUserOrderItems(params: { id?: string }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([GET_USER_ORDER_ITEMS_QUERY, params], async () => {
    if (!instance) {
      throw new Error('no instance');
    }

    if (!params.id) {
      return null;
    }

    return (
      await instance.get<OrderItem[]>(`/orders/user-orders/${params.id}/items`)
    ).data;
  });
}
