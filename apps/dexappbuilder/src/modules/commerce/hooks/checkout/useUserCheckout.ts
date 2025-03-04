import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { Checkout } from '../../types';

export const GET_USER_CHECKOUT_QUERY = 'GET_USER_CHECKOUT_QUERY';

export default function useUserCheckout({ id }: { id?: string }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_USER_CHECKOUT_QUERY, id],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      const result = (await instance?.get<Checkout>(`/checkouts/user/${id}`))
        .data;

      return result;
    },
    {
      refetchOnWindowFocus: 'always',
      refetchOnMount: 'always',
      staleTime: Infinity,
    },
  );
}
